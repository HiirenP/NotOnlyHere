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
exports.MigrationClaimService = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth/auth.constants");
const email_token_service_1 = require("../auth/email-token.service");
const outbox_service_1 = require("../outbox/outbox.service");
const prisma_service_1 = require("../prisma/prisma.service");
let MigrationClaimService = class MigrationClaimService {
    prisma;
    emailTokens;
    outbox;
    constructor(prisma, emailTokens, outbox) {
        this.prisma = prisma;
        this.emailTokens = emailTokens;
        this.outbox = outbox;
    }
    async isMigrationUserPendingClaim(userId) {
        const map = await this.prisma.migrationSourceMap.findFirst({
            where: { entityType: 'USER', targetId: userId, status: 'IMPORTED' },
        });
        if (!map)
            return false;
        const credential = await this.prisma.credential.findUnique({ where: { userId } });
        return !credential;
    }
    async requestClaim(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: (0, auth_constants_1.normalizeEmail)(email) },
            include: { credential: true },
        });
        if (user && !user.credential) {
            const pending = await this.isMigrationUserPendingClaim(user.id);
            if (pending && user.status === 'ACTIVE') {
                const rawToken = await this.emailTokens.create(user.id, 'RESET_PASSWORD');
                await this.outbox.emitPasswordReset(user.id, user.email, rawToken);
            }
        }
        return { ok: true, message: auth_constants_1.GENERIC_RESET_MESSAGE };
    }
};
exports.MigrationClaimService = MigrationClaimService;
exports.MigrationClaimService = MigrationClaimService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_token_service_1.EmailTokenService,
        outbox_service_1.OutboxService])
], MigrationClaimService);
//# sourceMappingURL=migration-claim.service.js.map