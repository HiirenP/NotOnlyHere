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
exports.EventsService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const admin_permissions_service_1 = require("../admin/admin-permissions.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const REMINDER_OFFSET_MS = {
    HOURS_24: 24 * 60 * 60 * 1000,
    HOURS_1: 60 * 60 * 1000,
};
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}
function assertValidSchedule(startsAt, endsAt, timeZone) {
    if (!(startsAt instanceof Date) || Number.isNaN(startsAt.getTime())) {
        throw new common_1.BadRequestException({ code: 'INVALID_START', message: 'Invalid start time.' });
    }
    if (!(endsAt instanceof Date) || Number.isNaN(endsAt.getTime())) {
        throw new common_1.BadRequestException({ code: 'INVALID_END', message: 'Invalid end time.' });
    }
    if (endsAt <= startsAt) {
        throw new common_1.BadRequestException({ code: 'INVALID_RANGE', message: 'End must be after start.' });
    }
    try {
        Intl.DateTimeFormat(undefined, { timeZone });
    }
    catch {
        throw new common_1.BadRequestException({ code: 'INVALID_TIMEZONE', message: 'Invalid timezone.' });
    }
}
let EventsService = class EventsService {
    prisma;
    permissions;
    notifications;
    constructor(prisma, permissions, notifications) {
        this.prisma = prisma;
        this.permissions = permissions;
        this.notifications = notifications;
    }
    async assertCanWrite(userId) {
        const allowed = await this.permissions.hasPermission(userId, 'event.write');
        if (!allowed) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Event creation requires staff access.' });
        }
    }
    async createEvent(userId, input) {
        await this.assertCanWrite(userId);
        const startsAt = new Date(input.startsAt);
        const endsAt = new Date(input.endsAt);
        const timeZone = input.timeZone.trim() || 'UTC';
        assertValidSchedule(startsAt, endsAt, timeZone);
        const title = input.title.trim();
        const description = input.description.trim();
        if (!title || !description) {
            throw new common_1.BadRequestException({ code: 'INVALID_INPUT', message: 'Title and description are required.' });
        }
        const baseSlug = slugify(title) || 'event';
        const slug = `${baseSlug}-${(0, crypto_1.randomBytes)(3).toString('hex')}`;
        const status = input.status ?? 'PUBLISHED';
        const event = await this.prisma.$transaction(async (tx) => {
            const created = await tx.event.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    creatorUserId: userId,
                    slug,
                    title,
                    description,
                    startsAt,
                    endsAt,
                    timeZone,
                    locationName: input.locationName?.trim() || null,
                    status,
                    scheduleVersion: 1,
                    scheduleVersions: {
                        create: {
                            scheduleVersion: 1,
                            startsAt,
                            endsAt,
                            timeZone,
                        },
                    },
                },
                include: { rsvps: true },
            });
            return created;
        });
        return this.serializeEvent(event, userId, null);
    }
    async updateEvent(userId, eventId, input) {
        await this.assertCanWrite(userId);
        const existing = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { rsvps: true },
        });
        if (!existing)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
        if (existing.version !== input.version) {
            throw new common_1.BadRequestException({ code: 'VERSION_CONFLICT', message: 'Event was updated elsewhere.' });
        }
        const startsAt = input.startsAt ? new Date(input.startsAt) : existing.startsAt;
        const endsAt = input.endsAt ? new Date(input.endsAt) : existing.endsAt;
        const timeZone = input.timeZone?.trim() || existing.timeZone;
        assertValidSchedule(startsAt, endsAt, timeZone);
        const scheduleChanged = startsAt.getTime() !== existing.startsAt.getTime() ||
            endsAt.getTime() !== existing.endsAt.getTime() ||
            timeZone !== existing.timeZone;
        const updated = await this.prisma.$transaction(async (tx) => {
            const nextScheduleVersion = scheduleChanged ? existing.scheduleVersion + 1 : existing.scheduleVersion;
            if (scheduleChanged) {
                await tx.eventScheduleVersion.create({
                    data: {
                        eventId,
                        scheduleVersion: nextScheduleVersion,
                        startsAt,
                        endsAt,
                        timeZone,
                    },
                });
                await tx.eventReminder.updateMany({
                    where: { eventId, sentAt: null, cancelledAt: null },
                    data: { cancelledAt: new Date() },
                });
            }
            const event = await tx.event.update({
                where: { id: eventId },
                data: {
                    title: input.title?.trim() ?? existing.title,
                    description: input.description?.trim() ?? existing.description,
                    startsAt,
                    endsAt,
                    timeZone,
                    locationName: input.locationName === undefined ? existing.locationName : input.locationName?.trim() || null,
                    status: input.status ?? existing.status,
                    scheduleVersion: nextScheduleVersion,
                    version: { increment: 1 },
                },
                include: { rsvps: true },
            });
            if (scheduleChanged) {
                await this.refreshRemindersForEvent(tx, event);
            }
            return event;
        });
        const viewerRsvp = updated.rsvps.find((row) => row.userId === userId) ?? null;
        return this.serializeEvent(updated, userId, viewerRsvp?.status ?? null);
    }
    async cancelEvent(userId, eventId, version) {
        return this.updateEvent(userId, eventId, { status: 'CANCELLED', version });
    }
    async deleteEvent(userId, eventId) {
        await this.assertCanWrite(userId);
        const existing = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!existing)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
        await this.prisma.event.delete({ where: { id: eventId } });
        return { ok: true };
    }
    async listEvents(userId, options) {
        const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
        const from = options.from ? new Date(options.from.replace(/\+00:00$/, 'Z')) : new Date();
        const to = options.to ? new Date(options.to.replace(/\+00:00$/, 'Z')) : new Date(from.getTime() + 31 * 24 * 60 * 60 * 1000);
        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
            throw new common_1.BadRequestException({ code: 'INVALID_DATE', message: 'Invalid date range.' });
        }
        let cursorStartsAt;
        let cursorId;
        if (options.cursor) {
            const [startsAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
            cursorStartsAt = new Date(startsAt);
            cursorId = id;
        }
        const query = options.q?.trim();
        const rows = await this.prisma.event.findMany({
            where: {
                status: { in: ['PUBLISHED', 'CANCELLED'] },
                startsAt: { gte: from, lte: to },
                ...(query
                    ? {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
                ...(cursorStartsAt && cursorId
                    ? {
                        OR: [
                            { startsAt: { gt: cursorStartsAt } },
                            { startsAt: cursorStartsAt, id: { gt: cursorId } },
                        ],
                    }
                    : {}),
            },
            orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
            take: limit + 1,
            include: {
                rsvps: { where: { userId } },
                _count: { select: { rsvps: { where: { status: 'GOING' } } } },
            },
        });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        const items = await Promise.all(page.map((event) => this.serializeEvent(event, userId, event.rsvps[0]?.status ?? null, event._count.rsvps)));
        return {
            view: options.view ?? 'list',
            from: from.toISOString(),
            to: to.toISOString(),
            items,
            nextCursor: rows.length > limit && last
                ? Buffer.from(`${last.startsAt.toISOString()}|${last.id}`).toString('base64url')
                : null,
        };
    }
    async getEvent(eventId, userId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                rsvps: { where: { userId } },
                _count: { select: { rsvps: { where: { status: 'GOING' } } } },
            },
        });
        if (!event || event.status === 'DRAFT') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
        }
        return this.serializeEvent(event, userId, event.rsvps[0]?.status ?? null, event._count.rsvps);
    }
    async upsertRsvp(eventId, userId, status) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event || event.status !== 'PUBLISHED') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const rsvp = await tx.eventRsvp.upsert({
                where: { eventId_userId: { eventId, userId } },
                update: { status },
                create: { eventId, userId, status },
            });
            await this.syncRemindersForUser(tx, event, userId, status);
            return rsvp;
        });
        return { eventId, status: row.status, updatedAt: row.updatedAt.toISOString() };
    }
    async deleteRsvp(eventId, userId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
        await this.prisma.$transaction(async (tx) => {
            await tx.eventRsvp.deleteMany({ where: { eventId, userId } });
            await tx.eventReminder.updateMany({
                where: { eventId, userId, sentAt: null, cancelledAt: null },
                data: { cancelledAt: new Date() },
            });
        });
        return { ok: true };
    }
    async listAttendees(eventId, viewerId, options) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event || event.status === 'DRAFT') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
        }
        const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
        let cursorCreatedAt;
        let cursorUserId;
        if (options.cursor) {
            const [createdAt, userId] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
            cursorCreatedAt = new Date(createdAt);
            cursorUserId = userId;
        }
        const rows = await this.prisma.eventRsvp.findMany({
            where: {
                eventId,
                status: options.status ?? 'GOING',
                ...(cursorCreatedAt && cursorUserId
                    ? {
                        OR: [
                            { createdAt: { gt: cursorCreatedAt } },
                            { createdAt: cursorCreatedAt, userId: { gt: cursorUserId } },
                        ],
                    }
                    : {}),
            },
            orderBy: [{ createdAt: 'asc' }, { userId: 'asc' }],
            take: limit + 1,
            include: { user: { include: { profile: true } } },
        });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        return {
            items: page.map((row) => ({
                userId: row.userId,
                username: row.user.profile?.username ?? 'member',
                displayName: row.user.profile?.displayName ?? 'Member',
                status: row.status,
                respondedAt: row.updatedAt.toISOString(),
            })),
            nextCursor: rows.length > limit && last
                ? Buffer.from(`${last.createdAt.toISOString()}|${last.userId}`).toString('base64url')
                : null,
        };
    }
    async processDueReminders(limit = 20) {
        const due = await this.prisma.eventReminder.findMany({
            where: {
                remindAt: { lte: new Date() },
                sentAt: null,
                cancelledAt: null,
                event: { status: 'PUBLISHED' },
            },
            orderBy: { remindAt: 'asc' },
            take: limit,
            include: { event: true, user: true },
        });
        let sent = 0;
        for (const reminder of due) {
            const claimed = await this.prisma.eventReminder.updateMany({
                where: { id: reminder.id, sentAt: null, cancelledAt: null },
                data: { sentAt: new Date() },
            });
            if (claimed.count === 0)
                continue;
            await this.notifications.create({
                recipientUserId: reminder.userId,
                eventType: 'event.reminder',
                titleKey: 'notifications.event.reminder.title',
                bodyKey: 'notifications.event.reminder.body',
                templateParams: {
                    eventId: reminder.eventId,
                    eventTitle: reminder.event.title,
                    kind: reminder.kind,
                    startsAt: reminder.event.startsAt.toISOString(),
                },
                eventId: reminder.eventId,
            });
            sent += 1;
        }
        return { processed: due.length, sent };
    }
    async refreshRemindersForEvent(tx, event) {
        const rsvps = await tx.eventRsvp.findMany({
            where: { eventId: event.id, status: { in: ['GOING', 'MAYBE'] } },
        });
        for (const rsvp of rsvps) {
            await this.syncRemindersForUser(tx, event, rsvp.userId, rsvp.status);
        }
    }
    async syncRemindersForUser(tx, event, userId, status) {
        await tx.eventReminder.updateMany({
            where: { eventId: event.id, userId, sentAt: null, cancelledAt: null },
            data: { cancelledAt: new Date() },
        });
        if (status !== 'GOING' && status !== 'MAYBE')
            return;
        for (const kind of ['HOURS_24', 'HOURS_1']) {
            const remindAt = new Date(event.startsAt.getTime() - REMINDER_OFFSET_MS[kind]);
            if (remindAt <= new Date())
                continue;
            await tx.eventReminder.upsert({
                where: {
                    eventId_userId_kind_scheduleVersion: {
                        eventId: event.id,
                        userId,
                        kind,
                        scheduleVersion: event.scheduleVersion,
                    },
                },
                update: { remindAt, cancelledAt: null },
                create: {
                    id: (0, crypto_1.randomUUID)(),
                    eventId: event.id,
                    userId,
                    kind,
                    scheduleVersion: event.scheduleVersion,
                    remindAt,
                },
            });
        }
    }
    serializeEvent(event, viewerId, viewerRsvp, goingCount = 0) {
        return {
            id: event.id,
            slug: event.slug,
            title: event.title,
            description: event.description,
            startsAt: event.startsAt.toISOString(),
            endsAt: event.endsAt.toISOString(),
            timeZone: event.timeZone,
            locationName: event.locationName,
            status: event.status,
            scheduleVersion: event.scheduleVersion,
            version: event.version,
            createdAt: event.createdAt.toISOString(),
            counts: { going: goingCount },
            viewer: {
                rsvpStatus: viewerRsvp,
                canRsvp: event.status === 'PUBLISHED',
            },
        };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        admin_permissions_service_1.AdminPermissionsService,
        notifications_service_1.NotificationsService])
], EventsService);
//# sourceMappingURL=events.service.js.map