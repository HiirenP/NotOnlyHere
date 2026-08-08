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
exports.EmailTokenService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("./auth.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let EmailTokenService = class EmailTokenService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest();
    }
    async create(userId, purpose, tx) {
        const db = tx ?? this.prisma;
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = this.hashToken(rawToken);
        const ttl = purpose === 'VERIFY_EMAIL' ? auth_constants_1.EMAIL_TOKEN_TTL.VERIFY_EMAIL : auth_constants_1.EMAIL_TOKEN_TTL.RESET_PASSWORD;
        await db.emailToken.create({
            data: {
                userId,
                purpose,
                tokenHash,
                expiresAt: new Date(Date.now() + ttl),
            },
        });
        return rawToken;
    }
    async consume(rawToken, purpose) {
        const tokenHash = this.hashToken(rawToken);
        const record = await this.prisma.emailToken.findFirst({
            where: {
                tokenHash,
                purpose,
                consumedAt: null,
                expiresAt: { gt: new Date() },
            },
        });
        if (!record)
            return null;
        await this.prisma.emailToken.update({
            where: { id: record.id },
            data: { consumedAt: new Date() },
        });
        return record;
    }
};
exports.EmailTokenService = EmailTokenService;
exports.EmailTokenService = EmailTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailTokenService);
//# sourceMappingURL=email-token.service.js.map