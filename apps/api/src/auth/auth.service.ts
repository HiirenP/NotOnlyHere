import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  GENERIC_AUTH_ERROR,
  GENERIC_RESET_MESSAGE,
  LEGAL_DOC_VERSION,
  isValidPassword,
  isValidUsername,
  normalizeEmail,
  normalizeUsername,
  sanitizeReturnTo,
} from './auth.constants';
import { EmailTokenService } from './email-token.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { OutboxService } from '../outbox/outbox.service';
import { PrismaService } from '../prisma/prisma.service';

type RegisterInput = {
  displayName: string;
  username: string;
  email: string;
  password: string;
  ageConfirmed: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  guidelinesAccepted: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly emailTokens: EmailTokenService,
    private readonly sessions: SessionService,
    private readonly outbox: OutboxService,
  ) {}

  async register(input: RegisterInput) {
    if (!input.ageConfirmed) {
      throw new BadRequestException({
        code: 'AGE_REQUIRED',
        message: 'You must confirm you are 16 or older.',
        errors: { ageConfirmed: ['Age confirmation is required.'] },
      });
    }
    if (!input.termsAccepted || !input.privacyAccepted || !input.guidelinesAccepted) {
      throw new BadRequestException({
        code: 'LEGAL_REQUIRED',
        message: 'You must accept the Terms, Privacy Policy, and Community Guidelines.',
      });
    }

    const email = normalizeEmail(input.email);
    const username = normalizeUsername(input.username);

    if (!isValidUsername(username)) {
      throw new BadRequestException({
        code: 'INVALID_USERNAME',
        message: 'Username must be 3–30 characters: lowercase letters, numbers, underscore.',
        errors: { username: ['Invalid username format.'] },
      });
    }
    if (!isValidPassword(input.password)) {
      throw new BadRequestException({
        code: 'WEAK_PASSWORD',
        message: 'Password must be at least 8 characters with a number and symbol.',
        errors: { password: ['Password does not meet requirements.'] },
      });
    }

    const existingEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new ConflictException({
        code: 'EMAIL_TAKEN',
        message: 'An account with this email already exists.',
        errors: { email: ['Email is already registered.'] },
      });
    }

    const existingUsername = await this.prisma.profile.findUnique({ where: { username } });
    if (existingUsername) {
      throw new ConflictException({
        code: 'USERNAME_TAKEN',
        message: 'This username is already taken.',
        errors: { username: ['Username is unavailable.'] },
      });
    }

    const now = new Date();
    const passwordHash = await this.passwords.hash(input.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          status: 'PENDING_VERIFICATION',
          ageAttestedAt: now,
          termsVersion: LEGAL_DOC_VERSION,
          privacyVersion: LEGAL_DOC_VERSION,
          communityGuidelinesVersion: LEGAL_DOC_VERSION,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
          communityGuidelinesAcceptedAt: now,
          profile: {
            create: {
              username,
              displayName: input.displayName.trim(),
            },
          },
          credential: {
            create: {
              passwordHash,
              passwordChangedAt: now,
            },
          },
        },
      });

      const rawToken = await this.emailTokens.create(created.id, 'VERIFY_EMAIL', tx);
      await this.outbox.emitEmailVerification(created.id, email, rawToken, tx);

      return created;
    });

    return { userId: user.id, email: user.email, status: user.status };
  }

  async login(email: string, password: string, res: Response, req: Request, returnTo?: string) {
    const user = await this.findUserForLogin(email);

    if (!user?.credential) {
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: GENERIC_AUTH_ERROR });
    }

    if (user.credential.lockedUntil && user.credential.lockedUntil > new Date()) {
      throw new UnauthorizedException({ code: 'ACCOUNT_LOCKED', message: GENERIC_AUTH_ERROR });
    }

    const valid = await this.passwords.verify(user.credential.passwordHash, password);
    if (!valid) {
      await this.prisma.credential.update({
        where: { userId: user.id },
        data: { failedAttempts: { increment: 1 } },
      });
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: GENERIC_AUTH_ERROR });
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException({
        code: 'ACCOUNT_SUSPENDED',
        message: 'Your account is suspended. Contact support for help.',
      });
    }
    if (user.status === 'BANNED') {
      throw new UnauthorizedException({
        code: 'ACCOUNT_BANNED',
        message: 'Your account is banned. Contact support for help.',
      });
    }
    if (!user.emailVerifiedAt || user.status !== 'ACTIVE') {
      throw new UnauthorizedException({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email before signing in.',
      });
    }

    await this.prisma.credential.update({
      where: { userId: user.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    await this.sessions.createSession(user.id, res, req);
    return { ok: true, returnTo: sanitizeReturnTo(returnTo) };
  }

  async verifyEmail(rawToken: string) {
    const record = await this.emailTokens.consume(rawToken, 'VERIFY_EMAIL');
    if (!record) {
      throw new BadRequestException({
        code: 'INVALID_TOKEN',
        message: 'This verification link is invalid or has expired.',
      });
    }

    const now = new Date();
    await this.prisma.user.update({
      where: { id: record.userId },
      data: {
        emailVerifiedAt: now,
        activatedAt: now,
        status: 'ACTIVE',
      },
    });

    return { ok: true };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (user && user.status === 'PENDING_VERIFICATION') {
      const rawToken = await this.emailTokens.create(user.id, 'VERIFY_EMAIL');
      await this.outbox.emitEmailVerification(user.id, user.email, rawToken);
    }
    return {
      ok: true,
      message: 'If an account exists and is unverified, we sent a new verification email.',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
      include: { credential: true },
    });

    if (user?.credential && user.status === 'ACTIVE') {
      const rawToken = await this.emailTokens.create(user.id, 'RESET_PASSWORD');
      await this.outbox.emitPasswordReset(user.id, user.email, rawToken);
    } else if (user && !user.credential && user.status === 'ACTIVE') {
      const map = await this.prisma.migrationSourceMap.findFirst({
        where: { entityType: 'USER', targetId: user.id, status: 'IMPORTED' },
      });
      if (map) {
        const rawToken = await this.emailTokens.create(user.id, 'RESET_PASSWORD');
        await this.outbox.emitPasswordReset(user.id, user.email, rawToken);
      }
    }

    return { ok: true, message: GENERIC_RESET_MESSAGE };
  }

  async resetPassword(rawToken: string, newPassword: string) {
    if (!isValidPassword(newPassword)) {
      throw new BadRequestException({
        code: 'WEAK_PASSWORD',
        message: 'Password must be at least 8 characters with a number and symbol.',
      });
    }

    const record = await this.emailTokens.consume(rawToken, 'RESET_PASSWORD');
    if (!record) {
      throw new BadRequestException({
        code: 'INVALID_TOKEN',
        message: 'This reset link is invalid or has expired.',
      });
    }

    const passwordHash = await this.passwords.hash(newPassword);
    const now = new Date();

    const existingCredential = await this.prisma.credential.findUnique({
      where: { userId: record.userId },
    });

    if (existingCredential) {
      await this.prisma.credential.update({
        where: { userId: record.userId },
        data: { passwordHash, passwordChangedAt: now, failedAttempts: 0, lockedUntil: null },
      });
    } else {
      await this.prisma.credential.create({
        data: {
          userId: record.userId,
          passwordHash,
          passwordChangedAt: now,
        },
      });
    }

    await this.sessions.revokeAllSessions(record.userId, 'password_reset');
    return { ok: true };
  }

  async logout(req: Request, res: Response) {
    const sessionId = this.sessions.getCurrentSessionId(req);
    if (sessionId) await this.sessions.revokeSession(sessionId, 'logout');
    this.sessions.clearCookies(res);
    return { ok: true };
  }

  async logoutAll(req: Request, res: Response) {
    const user = await this.sessions.resolveUserFromRequest(req);
    if (!user) throw new UnauthorizedException();
    await this.sessions.revokeAllSessions(user.id, 'logout_all');
    this.sessions.clearCookies(res);
    return { ok: true };
  }

  private async findUserForLogin(identifier: string) {
    const trimmed = identifier.trim();
    if (!trimmed) return null;

    if (trimmed.includes('@')) {
      return this.prisma.user.findUnique({
        where: { email: normalizeEmail(trimmed) },
        include: { credential: true },
      });
    }

    const profile = await this.prisma.profile.findUnique({
      where: { username: normalizeUsername(trimmed) },
      include: { user: { include: { credential: true } } },
    });

    return profile?.user ?? null;
  }
}
