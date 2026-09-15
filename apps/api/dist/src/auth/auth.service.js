"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("./auth.constants");
const email_token_service_1 = require("./email-token.service");
const password_service_1 = require("./password.service");
const session_service_1 = require("./session.service");
const outbox_service_1 = require("../outbox/outbox.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    passwords;
    emailTokens;
    sessions;
    outbox;
    constructor(prisma, passwords, emailTokens, sessions, outbox) {
        this.prisma = prisma;
        this.passwords = passwords;
        this.emailTokens = emailTokens;
        this.sessions = sessions;
        this.outbox = outbox;
    }
    async register(input) {
        if (!input.ageConfirmed) {
            throw new common_1.BadRequestException({
                code: 'AGE_REQUIRED',
                message: 'You must confirm you are 16 or older.',
                errors: { ageConfirmed: ['Age confirmation is required.'] },
            });
        }
        if (!input.termsAccepted || !input.privacyAccepted || !input.guidelinesAccepted) {
            throw new common_1.BadRequestException({
                code: 'LEGAL_REQUIRED',
                message: 'You must accept the Terms, Privacy Policy, and Community Guidelines.',
            });
        }
        const email = (0, auth_constants_1.normalizeEmail)(input.email);
        const username = (0, auth_constants_1.normalizeUsername)(input.username);
        if (!(0, auth_constants_1.isValidUsername)(username)) {
            throw new common_1.BadRequestException({
                code: 'INVALID_USERNAME',
                message: 'Username must be 3–30 characters: lowercase letters, numbers, underscore.',
                errors: { username: ['Invalid username format.'] },
            });
        }
        if (!(0, auth_constants_1.isValidPassword)(input.password)) {
            throw new common_1.BadRequestException({
                code: 'WEAK_PASSWORD',
                message: 'Password must be at least 8 characters with a number and symbol.',
                errors: { password: ['Password does not meet requirements.'] },
            });
        }
        const existingEmail = await this.prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            throw new common_1.ConflictException({
                code: 'EMAIL_TAKEN',
                message: 'An account with this email already exists.',
                errors: { email: ['Email is already registered.'] },
            });
        }
        const existingUsername = await this.prisma.profile.findUnique({ where: { username } });
        if (existingUsername) {
            throw new common_1.ConflictException({
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
                    termsVersion: auth_constants_1.LEGAL_DOC_VERSION,
                    privacyVersion: auth_constants_1.LEGAL_DOC_VERSION,
                    communityGuidelinesVersion: auth_constants_1.LEGAL_DOC_VERSION,
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
    async login(email, password, res, req, returnTo) {
        const user = await this.findUserForLogin(email);
        if (!user?.credential) {
            throw new common_1.UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: auth_constants_1.GENERIC_AUTH_ERROR });
        }
        if (user.credential.lockedUntil && user.credential.lockedUntil > new Date()) {
            throw new common_1.UnauthorizedException({ code: 'ACCOUNT_LOCKED', message: auth_constants_1.GENERIC_AUTH_ERROR });
        }
        const valid = await this.passwords.verify(user.credential.passwordHash, password);
        if (!valid) {
            await this.prisma.credential.update({
                where: { userId: user.id },
                data: { failedAttempts: { increment: 1 } },
            });
            throw new common_1.UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: auth_constants_1.GENERIC_AUTH_ERROR });
        }
        if (user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException({
                code: 'ACCOUNT_SUSPENDED',
                message: 'Your account is suspended. Contact support for help.',
            });
        }
        if (user.status === 'BANNED') {
            throw new common_1.UnauthorizedException({
                code: 'ACCOUNT_BANNED',
                message: 'Your account is banned. Contact support for help.',
            });
        }
        if (!user.emailVerifiedAt || user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException({
                code: 'EMAIL_NOT_VERIFIED',
                message: 'Please verify your email before signing in.',
            });
        }
        await this.prisma.credential.update({
            where: { userId: user.id },
            data: { failedAttempts: 0, lockedUntil: null },
        });
        await this.sessions.createSession(user.id, res, req);
        return { ok: true, returnTo: (0, auth_constants_1.sanitizeReturnTo)(returnTo) };
    }
    async verifyEmail(rawToken) {
        const record = await this.emailTokens.consume(rawToken, 'VERIFY_EMAIL');
        if (!record) {
            throw new common_1.BadRequestException({
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
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({ where: { email: (0, auth_constants_1.normalizeEmail)(email) } });
        if (user && user.status === 'PENDING_VERIFICATION') {
            const rawToken = await this.emailTokens.create(user.id, 'VERIFY_EMAIL');
            await this.outbox.emitEmailVerification(user.id, user.email, rawToken);
        }
        return {
            ok: true,
            message: 'If an account exists and is unverified, we sent a new verification email.',
        };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: (0, auth_constants_1.normalizeEmail)(email) },
            include: { credential: true },
        });
        if (user?.credential && user.status === 'ACTIVE') {
            const rawToken = await this.emailTokens.create(user.id, 'RESET_PASSWORD');
            await this.outbox.emitPasswordReset(user.id, user.email, rawToken);
        }
        else if (user && !user.credential && user.status === 'ACTIVE') {
            const map = await this.prisma.migrationSourceMap.findFirst({
                where: { entityType: 'USER', targetId: user.id, status: 'IMPORTED' },
            });
            if (map) {
                const rawToken = await this.emailTokens.create(user.id, 'RESET_PASSWORD');
                await this.outbox.emitPasswordReset(user.id, user.email, rawToken);
            }
        }
        return { ok: true, message: auth_constants_1.GENERIC_RESET_MESSAGE };
    }
    async resetPassword(rawToken, newPassword) {
        if (!(0, auth_constants_1.isValidPassword)(newPassword)) {
            throw new common_1.BadRequestException({
                code: 'WEAK_PASSWORD',
                message: 'Password must be at least 8 characters with a number and symbol.',
            });
        }
        const record = await this.emailTokens.consume(rawToken, 'RESET_PASSWORD');
        if (!record) {
            throw new common_1.BadRequestException({
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
        }
        else {
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
    async logout(req, res) {
        const sessionId = this.sessions.getCurrentSessionId(req);
        if (sessionId)
            await this.sessions.revokeSession(sessionId, 'logout');
        this.sessions.clearCookies(res);
        return { ok: true };
    }
    async logoutAll(req, res) {
        const user = await this.sessions.resolveUserFromRequest(req);
        if (!user)
            throw new common_1.UnauthorizedException();
        await this.sessions.revokeAllSessions(user.id, 'logout_all');
        this.sessions.clearCookies(res);
        return { ok: true };
    }
    async findUserForLogin(identifier) {
        const trimmed = identifier.trim();
        if (!trimmed)
            return null;
        if (trimmed.includes('@')) {
            return this.prisma.user.findUnique({
                where: { email: (0, auth_constants_1.normalizeEmail)(trimmed) },
                include: { credential: true },
            });
        }
        const profile = await this.prisma.profile.findUnique({
            where: { username: (0, auth_constants_1.normalizeUsername)(trimmed) },
            include: { user: { include: { credential: true } } },
        });
        return profile?.user ?? null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_service_1.PasswordService,
        email_token_service_1.EmailTokenService,
        session_service_1.SessionService,
        outbox_service_1.OutboxService])
], AuthService);
//# sourceMappingURL=auth.service.js.map