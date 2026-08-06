import { createHash, randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { MigrationEntityType, MigrationMapStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type MigrationFixture = {
  users?: Array<{
    sourceId: string;
    email: string;
    username: string;
    displayName: string;
    bio?: string | null;
    status?: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  }>;
  circles?: Array<{
    sourceId: string;
    name: string;
    slug: string;
    description?: string;
    visibility?: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
  }>;
  posts?: Array<{
    sourceId: string;
    authorSourceId: string;
    body: string;
    circleSourceId?: string | null;
  }>;
};

function checksum(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

@Injectable()
export class MigrationImportService {
  constructor(private readonly prisma: PrismaService) {}

  async runImport(
    startedByUserId: string,
    input: { sourceSystem: string; dryRun?: boolean; fixture: MigrationFixture },
  ) {
    const run = await this.prisma.migrationRun.create({
      data: {
        id: randomUUID(),
        sourceSystem: input.sourceSystem,
        dryRun: input.dryRun ?? false,
        startedByUserId,
        status: 'RUNNING',
      },
    });

    const counts: Record<string, { imported: number; skipped: number; failed: number }> = {
      USER: { imported: 0, skipped: 0, failed: 0 },
      CIRCLE: { imported: 0, skipped: 0, failed: 0 },
      POST: { imported: 0, skipped: 0, failed: 0 },
    };

    try {
      const userIdBySource = new Map<string, string>();
      const circleIdBySource = new Map<string, string>();

      for (const row of input.fixture.users ?? []) {
        const result = await this.importUser(run.id, input.sourceSystem, row, input.dryRun ?? false);
        if (result.status === 'IMPORTED' && result.targetId) {
          userIdBySource.set(row.sourceId, result.targetId);
          counts.USER.imported += 1;
        } else if (result.status === 'SKIPPED') counts.USER.skipped += 1;
        else counts.USER.failed += 1;
      }

      for (const row of input.fixture.circles ?? []) {
        const creatorId = [...userIdBySource.values()][0];
        const result = await this.importCircle(
          run.id,
          input.sourceSystem,
          row,
          creatorId,
          input.dryRun ?? false,
        );
        if (result.status === 'IMPORTED' && result.targetId) {
          circleIdBySource.set(row.sourceId, result.targetId);
          counts.CIRCLE.imported += 1;
        } else if (result.status === 'SKIPPED') counts.CIRCLE.skipped += 1;
        else counts.CIRCLE.failed += 1;
      }

      for (const row of input.fixture.posts ?? []) {
        const authorId = userIdBySource.get(row.authorSourceId);
        const circleId = row.circleSourceId ? circleIdBySource.get(row.circleSourceId) : null;
        const result = await this.importPost(
          run.id,
          input.sourceSystem,
          row,
          authorId,
          circleId,
          input.dryRun ?? false,
        );
        if (result.status === 'IMPORTED') counts.POST.imported += 1;
        else if (result.status === 'SKIPPED') counts.POST.skipped += 1;
        else counts.POST.failed += 1;
      }

      await this.prisma.migrationRun.update({
        where: { id: run.id },
        data: {
          status: 'COMPLETED',
          counts,
          completedAt: new Date(),
        },
      });

      return { runId: run.id, dryRun: input.dryRun ?? false, status: 'COMPLETED', counts };
    } catch (error) {
      await this.prisma.migrationRun.update({
        where: { id: run.id },
        data: {
          status: 'FAILED',
          errorCode: error instanceof Error ? error.message : 'IMPORT_FAILED',
          completedAt: new Date(),
        },
      });
      throw error;
    }
  }

  private async upsertMap(input: {
    runId: string;
    sourceSystem: string;
    entityType: MigrationEntityType;
    sourceId: string;
    targetId?: string | null;
    checksumValue: string;
    status: MigrationMapStatus;
    errorCode?: string | null;
    metadata?: object;
    dryRun: boolean;
  }) {
    const existing = await this.prisma.migrationSourceMap.findUnique({
      where: {
        sourceSystem_entityType_sourceId: {
          sourceSystem: input.sourceSystem,
          entityType: input.entityType,
          sourceId: input.sourceId,
        },
      },
    });

    if (existing?.status === 'IMPORTED' && existing.checksum === input.checksumValue) {
      return { status: 'SKIPPED' as const, targetId: existing.targetId };
    }

    if (input.dryRun) {
      return { status: 'IMPORTED' as const, targetId: existing?.targetId ?? randomUUID() };
    }

    await this.prisma.migrationSourceMap.upsert({
      where: {
        sourceSystem_entityType_sourceId: {
          sourceSystem: input.sourceSystem,
          entityType: input.entityType,
          sourceId: input.sourceId,
        },
      },
      update: {
        runId: input.runId,
        targetId: input.targetId,
        checksum: input.checksumValue,
        status: input.status,
        errorCode: input.errorCode,
        metadata: input.metadata,
      },
      create: {
        id: randomUUID(),
        runId: input.runId,
        sourceSystem: input.sourceSystem,
        entityType: input.entityType,
        sourceId: input.sourceId,
        targetId: input.targetId,
        checksum: input.checksumValue,
        status: input.status,
        errorCode: input.errorCode,
        metadata: input.metadata,
      },
    });

    return { status: input.status, targetId: input.targetId };
  }

  private async importUser(
    runId: string,
    sourceSystem: string,
    row: NonNullable<MigrationFixture['users']>[number],
    dryRun: boolean,
  ) {
    const checksumValue = checksum(row);
    const existing = await this.prisma.migrationSourceMap.findUnique({
      where: {
        sourceSystem_entityType_sourceId: {
          sourceSystem,
          entityType: 'USER',
          sourceId: row.sourceId,
        },
      },
    });
    if (existing?.status === 'IMPORTED' && existing.checksum === checksumValue) {
      return { status: 'SKIPPED' as const, targetId: existing.targetId };
    }

    const email = row.email.trim().toLowerCase();
    const username = row.username.trim().toLowerCase();
    if (!email || !username) {
      await this.upsertMap({
        runId,
        sourceSystem,
        entityType: 'USER',
        sourceId: row.sourceId,
        checksumValue,
        status: 'FAILED',
        errorCode: 'INVALID_USER',
        dryRun,
      });
      return { status: 'FAILED' as const, targetId: null };
    }

    if (dryRun) {
      return this.upsertMap({
        runId,
        sourceSystem,
        entityType: 'USER',
        sourceId: row.sourceId,
        targetId: randomUUID(),
        checksumValue,
        status: 'IMPORTED',
        dryRun: true,
      });
    }

    const now = new Date();
    const docVersion = '2026-07-30';
    const userId = randomUUID();

    const user = await this.prisma.$transaction(async (tx) => {
      const byEmail = await tx.user.findUnique({ where: { email } });
      if (byEmail) {
        return byEmail;
      }

      return tx.user.create({
        data: {
          id: userId,
          email,
          status: row.status ?? 'ACTIVE',
          emailVerifiedAt: now,
          activatedAt: now,
          ageAttestedAt: now,
          termsVersion: docVersion,
          privacyVersion: docVersion,
          communityGuidelinesVersion: docVersion,
          termsAcceptedAt: now,
          privacyAcceptedAt: now,
          communityGuidelinesAcceptedAt: now,
          profile: {
            create: {
              username,
              displayName: row.displayName.trim(),
              bio: row.bio?.trim() || null,
            },
          },
        },
      });
    });

    await this.upsertMap({
      runId,
      sourceSystem,
      entityType: 'USER',
      sourceId: row.sourceId,
      targetId: user.id,
      checksumValue,
      status: 'IMPORTED',
      metadata: { email, username },
      dryRun: false,
    });

    return { status: 'IMPORTED' as const, targetId: user.id };
  }

  private async importCircle(
    runId: string,
    sourceSystem: string,
    row: NonNullable<MigrationFixture['circles']>[number],
    creatorUserId: string | undefined,
    dryRun: boolean,
  ) {
    const checksumValue = checksum(row);
    if (!creatorUserId) {
      await this.upsertMap({
        runId,
        sourceSystem,
        entityType: 'CIRCLE',
        sourceId: row.sourceId,
        checksumValue,
        status: 'FAILED',
        errorCode: 'MISSING_CREATOR',
        dryRun,
      });
      return { status: 'FAILED' as const, targetId: null };
    }

    if (dryRun) {
      return this.upsertMap({
        runId,
        sourceSystem,
        entityType: 'CIRCLE',
        sourceId: row.sourceId,
        targetId: randomUUID(),
        checksumValue,
        status: 'IMPORTED',
        dryRun: true,
      });
    }

    const baseSlug = slugify(row.slug || row.name) || `circle-${row.sourceId}`;
    const existingMap = await this.prisma.migrationSourceMap.findUnique({
      where: {
        sourceSystem_entityType_sourceId: {
          sourceSystem,
          entityType: 'CIRCLE',
          sourceId: row.sourceId,
        },
      },
    });
    if (existingMap?.targetId) {
      const circle = await this.prisma.circle.findUnique({ where: { id: existingMap.targetId } });
      if (circle) {
        return { status: 'SKIPPED' as const, targetId: circle.id };
      }
    }

    let slug = baseSlug;
    const slugTaken = await this.prisma.circle.findUnique({ where: { slug } });
    if (slugTaken) slug = `${baseSlug}-${row.sourceId}`;

    const circle = await this.prisma.circle.create({
      data: {
        id: randomUUID(),
        name: row.name.trim(),
        slug,
        description: row.description?.trim() || row.name.trim(),
        guidelines: row.description?.trim() || 'Be kind and respectful.',
        visibility: row.visibility ?? 'PUBLIC',
        joinPolicy: 'OPEN',
        status: 'ACTIVE',
        createdByUserId: creatorUserId,
      },
    });

    await this.upsertMap({
      runId,
      sourceSystem,
      entityType: 'CIRCLE',
      sourceId: row.sourceId,
      targetId: circle.id,
      checksumValue,
      status: 'IMPORTED',
      dryRun: false,
    });

    return { status: 'IMPORTED' as const, targetId: circle.id };
  }

  private async importPost(
    runId: string,
    sourceSystem: string,
    row: NonNullable<MigrationFixture['posts']>[number],
    authorUserId: string | undefined,
    circleId: string | null | undefined,
    dryRun: boolean,
  ) {
    const checksumValue = checksum(row);
    if (!authorUserId) {
      await this.upsertMap({
        runId,
        sourceSystem,
        entityType: 'POST',
        sourceId: row.sourceId,
        checksumValue,
        status: 'FAILED',
        errorCode: 'MISSING_AUTHOR',
        dryRun,
      });
      return { status: 'FAILED' as const, targetId: null };
    }

    if (dryRun) {
      return this.upsertMap({
        runId,
        sourceSystem,
        entityType: 'POST',
        sourceId: row.sourceId,
        targetId: randomUUID(),
        checksumValue,
        status: 'IMPORTED',
        dryRun: true,
      });
    }

    const post = await this.prisma.post.create({
      data: {
        id: randomUUID(),
        authorUserId,
        body: row.body.trim(),
        circleId: circleId ?? null,
        visibility: 'MEMBERS',
      },
    });

    await this.upsertMap({
      runId,
      sourceSystem,
      entityType: 'POST',
      sourceId: row.sourceId,
      targetId: post.id,
      checksumValue,
      status: 'IMPORTED',
      dryRun: false,
    });

    return { status: 'IMPORTED' as const, targetId: post.id };
  }
}
