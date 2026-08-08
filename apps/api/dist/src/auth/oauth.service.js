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
exports.OAuthService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("./auth.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let OAuthService = class OAuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseProvider(provider) {
        const normalized = provider.toUpperCase();
        if (normalized !== 'GOOGLE' && normalized !== 'APPLE') {
            throw new common_1.BadRequestException({ code: 'INVALID_PROVIDER', message: 'Unsupported provider.' });
        }
        return normalized;
    }
    isConfigured(provider) {
        if (provider === 'GOOGLE')
            return !!process.env.OAUTH_GOOGLE_CLIENT_ID;
        return !!process.env.OAUTH_APPLE_CLIENT_ID;
    }
    async start(providerName, returnTo, res) {
        const provider = this.parseProvider(providerName);
        if (!this.isConfigured(provider)) {
            const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
            return res.redirect(`${webUrl}/login?error=oauth_not_configured`);
        }
        const state = (0, crypto_1.randomBytes)(24).toString('hex');
        const codeVerifier = (0, crypto_1.randomBytes)(32).toString('base64url');
        const stateHash = (0, crypto_1.createHash)('sha256').update(state).digest();
        await this.prisma.oAuthTransaction.create({
            data: {
                provider,
                stateHash,
                codeVerifier,
                returnTo: (0, auth_constants_1.sanitizeReturnTo)(returnTo),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
        const redirectUri = `${apiUrl}/api/v1/auth/oauth/${providerName.toLowerCase()}/callback`;
        if (provider === 'GOOGLE') {
            const params = new URLSearchParams({
                client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
                redirect_uri: redirectUri,
                response_type: 'code',
                scope: 'openid email profile',
                state,
                code_challenge: (0, crypto_1.createHash)('sha256').update(codeVerifier).digest('base64url'),
                code_challenge_method: 'S256',
            });
            return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
        }
        return res.redirect(`${process.env.WEB_URL ?? 'http://localhost:3000'}/login?error=apple_pending`);
    }
    async callback(providerName, code, state, res) {
        const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
        if (!code || !state) {
            return res.redirect(`${webUrl}/login?error=oauth_failed`);
        }
        const provider = this.parseProvider(providerName);
        const stateHash = (0, crypto_1.createHash)('sha256').update(state).digest();
        const transaction = await this.prisma.oAuthTransaction.findFirst({
            where: {
                provider,
                stateHash,
                consumedAt: null,
                expiresAt: { gt: new Date() },
            },
        });
        if (!transaction) {
            return res.redirect(`${webUrl}/login?error=oauth_state_invalid`);
        }
        await this.prisma.oAuthTransaction.update({
            where: { id: transaction.id },
            data: { consumedAt: new Date() },
        });
        return res.redirect(`${webUrl}/login?error=oauth_linking_pending`);
    }
};
exports.OAuthService = OAuthService;
exports.OAuthService = OAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OAuthService);
//# sourceMappingURL=oauth.service.js.map