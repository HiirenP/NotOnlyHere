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
exports.SessionService = exports.CSRF_COOKIE = exports.REFRESH_COOKIE = exports.ACCESS_COOKIE = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("./auth.constants");
const prisma_service_1 = require("../prisma/prisma.service");
exports.ACCESS_COOKIE = 'noh_access';
exports.REFRESH_COOKIE = 'noh_refresh';
exports.CSRF_COOKIE = 'noh_csrf';
let SessionService = class SessionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    isDevAuthEnabled() {
        return process.env.NODE_ENV !== 'production' && process.env.PHASE0_DEV_AUTH === 'true';
    }
    summarizeUserAgent(userAgent) {
        if (!userAgent)
            return 'Unknown browser';
        if (userAgent.length > 120)
            return `${userAgent.slice(0, 117)}...`;
        return userAgent;
    }
    issueCsrfToken(res) {
        const token = (0, crypto_1.randomBytes)(24).toString('hex');
        const secure = process.env.NODE_ENV === 'production';
        res.cookie(exports.CSRF_COOKIE, token, {
            httpOnly: false,
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: auth_constants_1.SESSION_REFRESH_TTL_MS,
        });
        return token;
    }
    async createSession(userId, res, req) {
        const now = new Date();
        const absoluteExpiresAt = new Date(now.getTime() + auth_constants_1.SESSION_ABSOLUTE_TTL_MS);
        const refreshToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const refreshHash = (0, crypto_1.createHash)('sha256').update(refreshToken).digest();
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
                expiresAt: new Date(now.getTime() + auth_constants_1.SESSION_REFRESH_TTL_MS),
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
    async createDevSession(userId, res) {
        if (!this.isDevAuthEnabled()) {
            throw new common_1.UnauthorizedException({ code: 'DEV_AUTH_DISABLED', message: 'Dev auth disabled' });
        }
        return this.createSession(userId, res);
    }
    setCookies(res, accessSessionId, refreshToken) {
        const secure = process.env.NODE_ENV === 'production';
        const common = { httpOnly: true, secure, sameSite: 'lax', path: '/' };
        res.cookie(exports.ACCESS_COOKIE, accessSessionId, { ...common, maxAge: auth_constants_1.SESSION_ACCESS_TTL_MS });
        res.cookie(exports.REFRESH_COOKIE, refreshToken, { ...common, maxAge: auth_constants_1.SESSION_REFRESH_TTL_MS });
    }
    clearCookies(res) {
        const opts = { path: '/' };
        res.clearCookie(exports.ACCESS_COOKIE, opts);
        res.clearCookie(exports.REFRESH_COOKIE, opts);
        res.clearCookie(exports.CSRF_COOKIE, opts);
    }
    async resolveUserFromRequest(req) {
        const accessSessionId = req.cookies?.[exports.ACCESS_COOKIE];
        if (!accessSessionId)
            return null;
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
        if (!session)
            return null;
        const user = session.family.user;
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
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException({
                code: 'ACCOUNT_INACTIVE',
                message: 'Your account is not active yet.',
            });
        }
        return user;
    }
    async revokeSession(sessionId, reason = 'logout') {
        const now = new Date();
        const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
        if (!session)
            return;
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
    async revokeAllSessions(userId, reason = 'logout_all') {
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
    async listSessions(userId, currentSessionId) {
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
    getCurrentSessionId(req) {
        return req.cookies?.[exports.ACCESS_COOKIE];
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionService);
//# sourceMappingURL=session.service.js.map