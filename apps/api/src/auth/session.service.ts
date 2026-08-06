import { createHash, randomBytes } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  SESSION_ABSOLUTE_TTL_MS,
  SESSION_ACCESS_TTL_MS,
  SESSION_REFRESH_TTL_MS,
} from './auth.constants';
import { PrismaService } from '../prisma/prisma.service';

export const ACCESS_COOKIE = 'noh_access';
export const REFRESH_COOKIE = 'noh_refresh';
export const CSRF_COOKIE = 'noh_csrf';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  isDevAuthEnabled() {
    return process.env.NODE_ENV !== 'production' && process.env.PHASE0_DEV_AUTH === 'true';
  }

  summarizeUserAgent(userAgent?: string) {
    if (!userAgent) return 'Unknown browser';
    if (userAgent.length > 120) return `${userAgent.slice(0, 117)}...`;
    return userAgent;
  }

  issueCsrfToken(res: Response) {
    const token = randomBytes(24).toString('hex');
    const secure = process.env.NODE_ENV === 'production';
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_REFRESH_TTL_MS,
    });
    return token;
  }

  async createSession(userId: string, res: Response, req?: Request) {
    const now = new Date();
    const absoluteExpiresAt = new Date(now.getTime() + SESSION_ABSOLUTE_TTL_MS);
    const refreshToken = randomBytes(32).toString('hex');
    const refreshHash = createHash('sha256').update(refreshToken).digest();

    const family = await this.prisma.sessionFamily.create({
      data: {
        userId,
        userAgentSummary: this.summarizeUserAgent(req?.headers['user-agent']),
        absoluteExpiresAt,
        lastUsedAt: now,
      },
    });

    const session = await this.prisma.session.create({
      data: {
        familyId: family.id,
        generation: 0,
        refreshTokenHash: refreshHash,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + SESSION_REFRESH_TTL_MS),
      },
    });

    this.setCookies(res, session.id, refreshToken);
    this.issueCsrfToken(res);

    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: now },
    });

    return session.id;
  }

  async createDevSession(userId: string, res: Response) {
    if (!this.isDevAuthEnabled()) {
      throw new UnauthorizedException({ code: 'DEV_AUTH_DISABLED', message: 'Dev auth disabled' });
    }
    return this.createSession(userId, res);
  }

  setCookies(res: Response, accessSessionId: string, refreshToken: string) {
    const secure = process.env.NODE_ENV === 'production';
    const common = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/' };
    res.cookie(ACCESS_COOKIE, accessSessionId, { ...common, maxAge: SESSION_ACCESS_TTL_MS });
    res.cookie(REFRESH_COOKIE, refreshToken, { ...common, maxAge: SESSION_REFRESH_TTL_MS });
  }

  clearCookies(res: Response) {
    const opts = { path: '/' };
    res.clearCookie(ACCESS_COOKIE, opts);
    res.clearCookie(REFRESH_COOKIE, opts);
    res.clearCookie(CSRF_COOKIE, opts);
  }

  async resolveUserFromRequest(req: Request) {
    const accessSessionId = req.cookies?.[ACCESS_COOKIE];
    if (!accessSessionId) return null;

    const session = await this.prisma.session.findFirst({
      where: {
        id: accessSessionId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        family: { revokedAt: null, absoluteExpiresAt: { gt: new Date() } },
      },
      include: {
        family: {
          include: {
            user: {
              include: {
                profile: true,
                adminUserRoles: { include: { role: true } },
              },
            },
          },
        },
      },
    });

    if (!session) return null;

    const user = session.family.user;
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
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException({
        code: 'ACCOUNT_INACTIVE',
        message: 'Your account is not active yet.',
      });
    }

    return user;
  }

  async revokeSession(sessionId: string, reason = 'logout') {
    const now = new Date();
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return;

    await this.prisma.$transaction([
      this.prisma.session.update({
        where: { id: sessionId },
        data: { revokedAt: now },
      }),
      this.prisma.sessionFamily.update({
        where: { id: session.familyId },
        data: { revokedAt: now, revocationReason: reason },
      }),
    ]);
  }

  async revokeAllSessions(userId: string, reason = 'logout_all') {
    const now = new Date();
    await this.prisma.sessionFamily.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: now, revocationReason: reason },
    });
    await this.prisma.session.updateMany({
      where: { family: { userId }, revokedAt: null },
      data: { revokedAt: now },
    });
  }

  async listSessions(userId: string, currentSessionId?: string) {
    const families = await this.prisma.sessionFamily.findMany({
      where: { userId, revokedAt: null },
      orderBy: { lastUsedAt: 'desc' },
      include: {
        sessions: {
          where: { revokedAt: null },
          orderBy: { issuedAt: 'desc' },
          take: 1,
        },
      },
    });

    return families
      .filter((family) => family.sessions[0])
      .map((family) => ({
        id: family.sessions[0].id,
        userAgentSummary: family.userAgentSummary ?? 'Unknown browser',
        lastUsedAt: family.lastUsedAt.toISOString(),
        isCurrent: family.sessions[0].id === currentSessionId,
      }));
  }

  getCurrentSessionId(req: Request) {
    return req.cookies?.[ACCESS_COOKIE] as string | undefined;
  }
}
