import { createHash, randomUUID } from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { PrismaService } from '../prisma/prisma.service';

const FUNNEL_STEPS = [
  { key: 'page.view', label: 'Visit' },
  { key: 'auth.register_completed', label: 'Register' },
  { key: 'feed.first_post_created', label: 'First post' },
  { key: 'circle.first_joined', label: 'Join circle' },
] as const;

function hashIdentifier(value: string) {
  return createHash('sha256').update(value).digest();
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function validateProperties(
  properties: Record<string, unknown>,
  allowed: Record<string, string>,
) {
  for (const key of Object.keys(properties)) {
    if (!(key in allowed)) {
      throw new BadRequestException({
        code: 'INVALID_PROPERTY',
        message: `Property "${key}" is not allowed for this event.`,
      });
    }
    const expected = allowed[key];
    const actual = typeof properties[key];
    if (expected === 'string' && actual !== 'string') {
      throw new BadRequestException({ code: 'INVALID_PROPERTY', message: `Property "${key}" must be a string.` });
    }
    if (expected === 'number' && actual !== 'number') {
      throw new BadRequestException({ code: 'INVALID_PROPERTY', message: `Property "${key}" must be a number.` });
    }
    if (expected === 'boolean' && actual !== 'boolean') {
      throw new BadRequestException({ code: 'INVALID_PROPERTY', message: `Property "${key}" must be a boolean.` });
    }
  }
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: AdminPermissionsService,
  ) {}

  async ingestEvent(input: {
    dedupId: string;
    eventKey: string;
    eventVersion: number;
    occurredAt: string;
    properties?: Record<string, unknown>;
    source: string;
    userId?: string | null;
    anonymousId?: string | null;
    sessionId?: string | null;
    requestId?: string | null;
  }) {
    const definition = await this.prisma.analyticsEventDefinition.findUnique({
      where: { key: input.eventKey },
    });
    if (!definition || !definition.active || definition.version !== input.eventVersion) {
      throw new BadRequestException({ code: 'UNKNOWN_EVENT', message: 'Event is not allowlisted.' });
    }

    const properties = input.properties ?? {};
    validateProperties(properties, definition.allowedProperties as Record<string, string>);

    const occurredAt = new Date(input.occurredAt);
    if (Number.isNaN(occurredAt.getTime())) {
      throw new BadRequestException({ code: 'INVALID_TIME', message: 'Invalid occurredAt timestamp.' });
    }

    const hasUser = Boolean(input.userId);
    const hasAnonymous = Boolean(input.anonymousId);
    if (hasUser && hasAnonymous) {
      throw new BadRequestException({
        code: 'INVALID_IDENTITY',
        message: 'Provide either userId or anonymousId, not both.',
      });
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.analyticsEventDedup.create({
          data: {
            id: input.dedupId,
            firstOccurredAt: occurredAt,
          },
        });

        await tx.analyticsEvent.create({
          data: {
            id: randomUUID(),
            occurredAt,
            eventKey: input.eventKey,
            eventVersion: input.eventVersion,
            userId: input.userId ?? null,
            anonymousIdHash: input.anonymousId ? hashIdentifier(input.anonymousId) : null,
            sessionIdHash: input.sessionId ? hashIdentifier(input.sessionId) : null,
            properties: properties as Prisma.InputJsonValue,
            source: input.source,
            requestId: input.requestId ?? null,
          },
        });
      });
      return { ok: true, duplicate: false };
    } catch (error) {
      const existing = await this.prisma.analyticsEventDedup.findUnique({ where: { id: input.dedupId } });
      if (existing) return { ok: true, duplicate: true };
      throw error;
    }
  }

  async computeDailyAggregates(metricDate = startOfUtcDay(new Date())) {
    const nextDay = new Date(metricDate.getTime() + 24 * 60 * 60 * 1000);
    const dau = await this.prisma.analyticsEvent.findMany({
      where: {
        occurredAt: { gte: metricDate, lt: nextDay },
        userId: { not: null },
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    await this.prisma.analyticsDailyAggregate.upsert({
      where: {
        metricDate_metricKey_dimensionKey_dimensionValue: {
          metricDate,
          metricKey: 'dau',
          dimensionKey: 'all',
          dimensionValue: 'all',
        },
      },
      update: {
        valueNumeric: dau.length,
        computedAt: new Date(),
        sourceWindowEnd: nextDay,
      },
      create: {
        metricDate,
        metricKey: 'dau',
        dimensionKey: 'all',
        dimensionValue: 'all',
        valueNumeric: dau.length,
        sourceWindowEnd: nextDay,
      },
    });

    const thirtyDaysAgo = new Date(metricDate.getTime() - 29 * 24 * 60 * 60 * 1000);
    const mau = await this.prisma.analyticsEvent.findMany({
      where: {
        occurredAt: { gte: thirtyDaysAgo, lt: nextDay },
        userId: { not: null },
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    await this.prisma.analyticsDailyAggregate.upsert({
      where: {
        metricDate_metricKey_dimensionKey_dimensionValue: {
          metricDate,
          metricKey: 'mau',
          dimensionKey: 'all',
          dimensionValue: 'all',
        },
      },
      update: {
        valueNumeric: mau.length,
        computedAt: new Date(),
        sourceWindowEnd: nextDay,
      },
      create: {
        metricDate,
        metricKey: 'mau',
        dimensionKey: 'all',
        dimensionValue: 'all',
        valueNumeric: mau.length,
        sourceWindowEnd: nextDay,
      },
    });

    return { dau: dau.length, mau: mau.length };
  }

  private parseRange(filters: { from?: string; to?: string }) {
    const to = filters.to ? new Date(filters.to) : new Date();
    const from = filters.from
      ? new Date(filters.from)
      : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) {
      throw new BadRequestException({ code: 'INVALID_RANGE', message: 'Invalid analytics date range.' });
    }
    return { from, to };
  }

  private async assertCanRead(userId: string) {
    const allowed = await this.permissions.hasPermission(userId, 'analytics.read');
    if (!allowed) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Analytics access required.' });
    }
  }

  private async assertCanExport(userId: string) {
    const allowed = await this.permissions.hasPermission(userId, 'analytics.export');
    if (!allowed) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Analytics export permission required.' });
    }
  }

  async getUsersOverview(userId: string, filters: { from?: string; to?: string }) {
    await this.assertCanRead(userId);
    const { from, to } = this.parseRange(filters);
    const latest = await this.prisma.analyticsDailyAggregate.findFirst({
      where: { metricKey: { in: ['dau', 'mau'] }, metricDate: { lte: to } },
      orderBy: { metricDate: 'desc' },
    });

    const registrations = await this.prisma.analyticsEvent.count({
      where: {
        eventKey: 'auth.register_completed',
        occurredAt: { gte: from, lte: to },
      },
    });

    return {
      range: { from: from.toISOString(), to: to.toISOString() },
      registrations,
      latestDaily: latest
        ? {
            metricDate: latest.metricDate.toISOString().slice(0, 10),
            metricKey: latest.metricKey,
            value: Number(latest.valueNumeric),
          }
        : null,
    };
  }

  async getEngagement(userId: string, filters: { from?: string; to?: string }) {
    await this.assertCanRead(userId);
    const { from, to } = this.parseRange(filters);
    const events = await this.prisma.analyticsEvent.groupBy({
      by: ['eventKey'],
      where: { occurredAt: { gte: from, lte: to } },
      _count: { _all: true },
    });

    return {
      range: { from: from.toISOString(), to: to.toISOString() },
      totals: events.map((row) => ({ eventKey: row.eventKey, count: row._count._all })),
    };
  }

  async getFunnel(userId: string, filters: { from?: string; to?: string }) {
    await this.assertCanRead(userId);
    const { from, to } = this.parseRange(filters);

    const steps = [];
    for (const step of FUNNEL_STEPS) {
      const identities = await this.prisma.analyticsEvent.findMany({
        where: {
          eventKey: step.key,
          occurredAt: { gte: from, lte: to },
        },
        select: { userId: true, anonymousIdHash: true },
      });

      const unique = new Set(
        identities.map((row) =>
          row.userId ? `u:${row.userId}` : row.anonymousIdHash ? `a:${Buffer.from(row.anonymousIdHash).toString('hex')}` : null,
        ).filter(Boolean) as string[],
      );

      steps.push({
        key: step.key,
        label: step.label,
        count: unique.size,
      });
    }

    return {
      name: 'activation',
      range: { from: from.toISOString(), to: to.toISOString() },
      steps,
    };
  }

  async createExport(
    userId: string,
    input: { reportType: string; filters: { from?: string; to?: string }; idempotencyKey: string },
  ) {
    await this.assertCanExport(userId);
    if (!input.idempotencyKey?.trim()) {
      throw new BadRequestException({ code: 'INVALID_INPUT', message: 'idempotencyKey is required.' });
    }

    const existing = await this.prisma.analyticsExport.findUnique({
      where: { requestedByUserId_idempotencyKey: { requestedByUserId: userId, idempotencyKey: input.idempotencyKey } },
    });
    if (existing) return this.serializeExport(existing);

    const exportId = randomUUID();
    const objectKey = `analytics/${userId}/${exportId}.json`;
    const completedAt = new Date();
    const expiresAt = new Date(completedAt.getTime() + 24 * 60 * 60 * 1000);

    const [overview, funnel] = await Promise.all([
      this.getUsersOverview(userId, input.filters),
      this.getFunnel(userId, input.filters),
    ]);

    const payload = {
      reportType: input.reportType,
      filters: input.filters,
      generatedAt: completedAt.toISOString(),
      overview,
      funnel,
    };

    const created = await this.prisma.analyticsExport.create({
      data: {
        id: exportId,
        requestedByUserId: userId,
        reportType: input.reportType,
        filters: input.filters as Prisma.InputJsonValue,
        status: 'READY',
        objectKey,
        completedAt,
        expiresAt,
        idempotencyKey: input.idempotencyKey,
      },
    });

    await this.prisma.analyticsExport.update({
      where: { id: created.id },
      data: { filters: { ...input.filters, payload } as Prisma.InputJsonValue },
    });

    return this.serializeExport({ ...created, filters: { ...input.filters, payload } });
  }

  async getExport(userId: string, exportId: string) {
    await this.assertCanRead(userId);
    const row = await this.prisma.analyticsExport.findUnique({ where: { id: exportId } });
    if (!row) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Export not found.' });
    if (row.expiresAt && row.expiresAt < new Date()) {
      throw new NotFoundException({ code: 'EXPIRED', message: 'Export has expired.' });
    }
    return this.serializeExport(row);
  }

  private serializeExport(row: {
    id: string;
    reportType: string;
    status: string;
    filters: unknown;
    objectKey: string | null;
    expiresAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
  }) {
    return {
      id: row.id,
      reportType: row.reportType,
      status: row.status,
      filters: row.filters,
      objectKey: row.objectKey,
      expiresAt: row.expiresAt?.toISOString() ?? null,
      completedAt: row.completedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
