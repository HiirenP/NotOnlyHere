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
exports.AnonymousQuotaService = void 0;
const common_1 = require("@nestjs/common");
const anonymous_constants_1 = require("./anonymous.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let AnonymousQuotaService = class AnonymousQuotaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQuota(userId) {
        const usageDate = (0, anonymous_constants_1.utcUsageDate)();
        const row = await this.prisma.anonymousUsageDaily.findUnique({
            where: { userId_usageDate: { userId, usageDate } },
        });
        const used = row?.contributionCount ?? 0;
        const remaining = Math.max(anonymous_constants_1.ANONYMOUS_DAILY_LIMIT - used, 0);
        return {
            limit: anonymous_constants_1.ANONYMOUS_DAILY_LIMIT,
            used,
            remaining,
            resetsAt: (0, anonymous_constants_1.nextUtcMidnight)().toISOString(),
        };
    }
    async consumeQuota(userId) {
        const usageDate = (0, anonymous_constants_1.utcUsageDate)();
        const rows = await this.prisma.$queryRaw `
      WITH updated AS (
        INSERT INTO anonymous_usage_daily (user_id, usage_date, contribution_count, created_at, updated_at)
        VALUES (${userId}::uuid, ${usageDate}::date, 1, NOW(), NOW())
        ON CONFLICT (user_id, usage_date)
        DO UPDATE SET
          contribution_count = anonymous_usage_daily.contribution_count + 1,
          updated_at = NOW()
        WHERE anonymous_usage_daily.contribution_count < ${anonymous_constants_1.ANONYMOUS_DAILY_LIMIT}
        RETURNING contribution_count
      )
      SELECT contribution_count FROM updated
    `;
        if (rows.length === 0) {
            const quota = await this.getQuota(userId);
            throw new common_1.HttpException({
                code: 'ANONYMOUS_QUOTA_EXCEEDED',
                message: 'Daily anonymous contribution limit reached.',
                quota,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
};
exports.AnonymousQuotaService = AnonymousQuotaService;
exports.AnonymousQuotaService = AnonymousQuotaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnonymousQuotaService);
//# sourceMappingURL=anonymous-quota.service.js.map