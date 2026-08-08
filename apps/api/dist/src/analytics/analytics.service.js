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
exports.AnalyticsService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const admin_permissions_service_1 = require("../admin/admin-permissions.service");
const prisma_service_1 = require("../prisma/prisma.service");
const FUNNEL_STEPS = [
    { key: 'page.view', label: 'Visit' },
    { key: 'auth.register_completed', label: 'Register' },
    { key: 'feed.first_post_created', label: 'First post' },
    { key: 'circle.first_joined', label: 'Join circle' },
];
function hashIdentifier(value) {
    return (0, crypto_1.createHash)('sha256').update(value).digest();
}
function startOfUtcDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function validateProperties(properties, allowed) {
    for (const key of Object.keys(properties)) {
        if (!(key in allowed)) {
            throw new common_1.BadRequestException({
                code: 'INVALID_PROPERTY',
                message: `Property "${key}" is not allowed for this event.`,
            });
        }
        const expected = allowed[key];
        const actual = typeof properties[key];
        if (expected === 'string' && actual !== 'string') {
            throw new common_1.BadRequestException({ code: 'INVALID_PROPERTY', message: `Property "${key}" must be a string.` });
        }
        if (expected === 'number' && actual !== 'number') {
            throw new common_1.BadRequestException({ code: 'INVALID_PROPERTY', message: `Property "${key}" must be a number.` });
        }
        if (expected === 'boolean' && actual !== 'boolean') {
            throw new common_1.BadRequestException({ code: 'INVALID_PROPERTY', message: `Property "${key}" must be a boolean.` });
        }
    }
}
let AnalyticsService = class AnalyticsService {
    prisma;
    permissions;
    constructor(prisma, permissions) {
        this.prisma = prisma;
        this.permissions = permissions;
    }
    async ingestEvent(input) {
        const definition = await this.prisma.analyticsEventDefinition.findUnique({
            where: { key: input.eventKey },
        });
        if (!definition || !definition.active || definition.version !== input.eventVersion) {
            throw new common_1.BadRequestException({ code: 'UNKNOWN_EVENT', message: 'Event is not allowlisted.' });
        }
        const properties = input.properties ?? {};
        validateProperties(properties, definition.allowedProperties);
        const occurredAt = new Date(input.occurredAt);
        if (Number.isNaN(occurredAt.getTime())) {
            throw new common_1.BadRequestException({ code: 'INVALID_TIME', message: 'Invalid occurredAt timestamp.' });
        }
        const hasUser = Boolean(input.userId);
        const hasAnonymous = Boolean(input.anonymousId);
        if (hasUser && hasAnonymous) {
            throw new common_1.BadRequestException({
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
                        id: (0, crypto_1.randomUUID)(),
                        occurredAt,
                        eventKey: input.eventKey,
                        eventVersion: input.eventVersion,
                        userId: input.userId ?? null,
                        anonymousIdHash: input.anonymousId ? hashIdentifier(input.anonymousId) : null,
                        sessionIdHash: input.sessionId ? hashIdentifier(input.sessionId) : null,
                        properties: properties,
                        source: input.source,
                        requestId: input.requestId ?? null,
                    },
                });
            });
            return { ok: true, duplicate: false };
        }
        catch (error) {
            const existing = await this.prisma.analyticsEventDedup.findUnique({ where: { id: input.dedupId } });
            if (existing)
                return { ok: true, duplicate: true };
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
    parseRange(filters) {
        const to = filters.to ? new Date(filters.to) : new Date();
        const from = filters.from
            ? new Date(filters.from)
            : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) {
            throw new common_1.BadRequestException({ code: 'INVALID_RANGE', message: 'Invalid analytics date range.' });
        }
        return { from, to };
    }
    async assertCanRead(userId) {
        const allowed = await this.permissions.hasPermission(userId, 'analytics.read');
        if (!allowed) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Analytics access required.' });
        }
    }
    async assertCanExport(userId) {
        const allowed = await this.permissions.hasPermission(userId, 'analytics.export');
        if (!allowed) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Analytics export permission required.' });
        }
    }
    async getUsersOverview(userId, filters) {
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
    async getEngagement(userId, filters) {
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
    async getFunnel(userId, filters) {
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
            const unique = new Set(identities.map((row) => row.userId ? `u:${row.userId}` : row.anonymousIdHash ? `a:${Buffer.from(row.anonymousIdHash).toString('hex')}` : null).filter(Boolean));
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
    async createExport(userId, input) {
        await this.assertCanExport(userId);
        if (!input.idempotencyKey?.trim()) {
            throw new common_1.BadRequestException({ code: 'INVALID_INPUT', message: 'idempotencyKey is required.' });
        }
        const existing = await this.prisma.analyticsExport.findUnique({
            where: { requestedByUserId_idempotencyKey: { requestedByUserId: userId, idempotencyKey: input.idempotencyKey } },
        });
        if (existing)
            return this.serializeExport(existing);
        const exportId = (0, crypto_1.randomUUID)();
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
                filters: input.filters,
                status: 'READY',
                objectKey,
                completedAt,
                expiresAt,
                idempotencyKey: input.idempotencyKey,
            },
        });
        await this.prisma.analyticsExport.update({
            where: { id: created.id },
            data: { filters: { ...input.filters, payload } },
        });
        return this.serializeExport({ ...created, filters: { ...input.filters, payload } });
    }
    async getExport(userId, exportId) {
        await this.assertCanRead(userId);
        const row = await this.prisma.analyticsExport.findUnique({ where: { id: exportId } });
        if (!row)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Export not found.' });
        if (row.expiresAt && row.expiresAt < new Date()) {
            throw new common_1.NotFoundException({ code: 'EXPIRED', message: 'Export has expired.' });
        }
        return this.serializeExport(row);
    }
    serializeExport(row) {
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        admin_permissions_service_1.AdminPermissionsService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map