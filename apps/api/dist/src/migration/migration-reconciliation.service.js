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
exports.MigrationReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MigrationReconciliationService = class MigrationReconciliationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRunReport(runId) {
        const run = await this.prisma.migrationRun.findUnique({ where: { id: runId } });
        if (!run)
            return null;
        const maps = await this.prisma.migrationSourceMap.groupBy({
            by: ['entityType', 'status'],
            where: { runId },
            _count: { _all: true },
        });
        const byEntity = {};
        for (const row of maps) {
            byEntity[row.entityType] ??= {};
            byEntity[row.entityType][row.status] = row._count._all;
        }
        return {
            runId: run.id,
            sourceSystem: run.sourceSystem,
            dryRun: run.dryRun,
            status: run.status,
            counts: run.counts,
            grouped: byEntity,
            startedAt: run.startedAt.toISOString(),
            completedAt: run.completedAt?.toISOString() ?? null,
        };
    }
    async getLatestSummary() {
        const run = await this.prisma.migrationRun.findFirst({
            orderBy: { startedAt: 'desc' },
        });
        if (!run) {
            return { latestRun: null, totals: {}, pendingClaims: 0 };
        }
        const totals = await this.prisma.migrationSourceMap.groupBy({
            by: ['entityType', 'status'],
            _count: { _all: true },
        });
        const grouped = {
            USER: {},
            CIRCLE: {},
            POST: {},
            COMMENT: {},
            BLOG_POST: {},
            MEDIA: {},
        };
        for (const row of totals) {
            grouped[row.entityType][row.status] = row._count._all;
        }
        const importedUsers = await this.prisma.migrationSourceMap.findMany({
            where: { entityType: 'USER', status: 'IMPORTED' },
            select: { targetId: true },
        });
        const userIds = importedUsers.map((row) => row.targetId).filter(Boolean);
        const withCredentials = userIds.length
            ? await this.prisma.credential.count({ where: { userId: { in: userIds } } })
            : 0;
        return {
            latestRun: {
                id: run.id,
                sourceSystem: run.sourceSystem,
                status: run.status,
                dryRun: run.dryRun,
                startedAt: run.startedAt.toISOString(),
                completedAt: run.completedAt?.toISOString() ?? null,
            },
            totals: grouped,
            pendingClaims: Math.max(userIds.length - withCredentials, 0),
            reconciled: run.status === 'COMPLETED' &&
                Object.values(grouped).every((entity) => !entity.FAILED || entity.FAILED === 0),
        };
    }
    async getReleaseReadiness() {
        const migration = await this.getLatestSummary();
        const checks = [
            {
                key: 'migration.completed',
                ok: migration.latestRun?.status === 'COMPLETED',
                detail: migration.latestRun ? `Latest run ${migration.latestRun.status}` : 'No migration run yet',
            },
            {
                key: 'migration.no_failures',
                ok: Object.values(migration.totals).every((entity) => (entity.FAILED ?? 0) === 0),
                detail: 'Failed entity imports must be zero or documented',
            },
            {
                key: 'migration.claims',
                ok: migration.pendingClaims === 0,
                detail: `${migration.pendingClaims} imported users still need account claim`,
            },
        ];
        return {
            ready: checks.every((check) => check.ok),
            checks,
            migration,
        };
    }
};
exports.MigrationReconciliationService = MigrationReconciliationService;
exports.MigrationReconciliationService = MigrationReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MigrationReconciliationService);
//# sourceMappingURL=migration-reconciliation.service.js.map