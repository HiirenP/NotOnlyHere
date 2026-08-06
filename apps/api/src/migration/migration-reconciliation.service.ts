import { Injectable } from '@nestjs/common';
import type { MigrationEntityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MigrationReconciliationService {
  constructor(private readonly prisma: PrismaService) {}

  async getRunReport(runId: string) {
    const run = await this.prisma.migrationRun.findUnique({ where: { id: runId } });
    if (!run) return null;

    const maps = await this.prisma.migrationSourceMap.groupBy({
      by: ['entityType', 'status'],
      where: { runId },
      _count: { _all: true },
    });

    const byEntity: Record<string, Record<string, number>> = {};
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

    const grouped: Record<MigrationEntityType, Record<string, number>> = {
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
    const userIds = importedUsers.map((row) => row.targetId).filter(Boolean) as string[];
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
      reconciled:
        run.status === 'COMPLETED' &&
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
}
