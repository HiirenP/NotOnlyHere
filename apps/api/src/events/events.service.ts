import { randomBytes, randomUUID } from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { EventReminderKind, EventStatus, Prisma, RsvpStatus } from '@prisma/client';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';

const REMINDER_OFFSET_MS: Record<EventReminderKind, number> = {
  HOURS_24: 24 * 60 * 60 * 1000,
  HOURS_1: 60 * 60 * 1000,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function assertValidSchedule(startsAt: Date, endsAt: Date, timeZone: string) {
  if (!(startsAt instanceof Date) || Number.isNaN(startsAt.getTime())) {
    throw new BadRequestException({ code: 'INVALID_START', message: 'Invalid start time.' });
  }
  if (!(endsAt instanceof Date) || Number.isNaN(endsAt.getTime())) {
    throw new BadRequestException({ code: 'INVALID_END', message: 'Invalid end time.' });
  }
  if (endsAt <= startsAt) {
    throw new BadRequestException({ code: 'INVALID_RANGE', message: 'End must be after start.' });
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
  } catch {
    throw new BadRequestException({ code: 'INVALID_TIMEZONE', message: 'Invalid timezone.' });
  }
}

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: AdminPermissionsService,
    private readonly notifications: NotificationsService,
  ) {}

  private async assertCanWrite(userId: string) {
    const allowed = await this.permissions.hasPermission(userId, 'event.write');
    if (!allowed) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Event creation requires staff access.' });
    }
  }

  async createEvent(
    userId: string,
    input: {
      title: string;
      description: string;
      startsAt: string;
      endsAt: string;
      timeZone: string;
      locationName?: string | null;
      status?: EventStatus;
    },
  ) {
    await this.assertCanWrite(userId);
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);
    const timeZone = input.timeZone.trim() || 'UTC';
    assertValidSchedule(startsAt, endsAt, timeZone);

    const title = input.title.trim();
    const description = input.description.trim();
    if (!title || !description) {
      throw new BadRequestException({ code: 'INVALID_INPUT', message: 'Title and description are required.' });
    }

    const baseSlug = slugify(title) || 'event';
    const slug = `${baseSlug}-${randomBytes(3).toString('hex')}`;
    const status = input.status ?? 'PUBLISHED';

    const event = await this.prisma.$transaction(async (tx) => {
      const created = await tx.event.create({
        data: {
          id: randomUUID(),
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

  async updateEvent(
    userId: string,
    eventId: string,
    input: {
      title?: string;
      description?: string;
      startsAt?: string;
      endsAt?: string;
      timeZone?: string;
      locationName?: string | null;
      status?: EventStatus;
      version: number;
    },
  ) {
    await this.assertCanWrite(userId);
    const existing = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { rsvps: true },
    });
    if (!existing) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
    if (existing.version !== input.version) {
      throw new BadRequestException({ code: 'VERSION_CONFLICT', message: 'Event was updated elsewhere.' });
    }

    const startsAt = input.startsAt ? new Date(input.startsAt) : existing.startsAt;
    const endsAt = input.endsAt ? new Date(input.endsAt) : existing.endsAt;
    const timeZone = input.timeZone?.trim() || existing.timeZone;
    assertValidSchedule(startsAt, endsAt, timeZone);

    const scheduleChanged =
      startsAt.getTime() !== existing.startsAt.getTime() ||
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

  async cancelEvent(userId: string, eventId: string, version: number) {
    return this.updateEvent(userId, eventId, { status: 'CANCELLED', version });
  }

  async deleteEvent(userId: string, eventId: string) {
    await this.assertCanWrite(userId);
    const existing = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
    await this.prisma.event.delete({ where: { id: eventId } });
    return { ok: true };
  }

  async listEvents(
    userId: string,
    options: {
      from?: string;
      to?: string;
      q?: string;
      view?: 'month' | 'list';
      cursor?: string;
      limit?: number;
    },
  ) {
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
    const from = options.from ? new Date(options.from.replace(/\+00:00$/, 'Z')) : new Date();
    const to = options.to ? new Date(options.to.replace(/\+00:00$/, 'Z')) : new Date(from.getTime() + 31 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException({ code: 'INVALID_DATE', message: 'Invalid date range.' });
    }

    let cursorStartsAt: Date | undefined;
    let cursorId: string | undefined;
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
    const items = await Promise.all(
      page.map((event) =>
        this.serializeEvent(
          event,
          userId,
          event.rsvps[0]?.status ?? null,
          event._count.rsvps,
        ),
      ),
    );

    return {
      view: options.view ?? 'list',
      from: from.toISOString(),
      to: to.toISOString(),
      items,
      nextCursor:
        rows.length > limit && last
          ? Buffer.from(`${last.startsAt.toISOString()}|${last.id}`).toString('base64url')
          : null,
    };
  }

  async getEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        rsvps: { where: { userId } },
        _count: { select: { rsvps: { where: { status: 'GOING' } } } },
      },
    });
    if (!event || event.status === 'DRAFT') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
    }
    return this.serializeEvent(event, userId, event.rsvps[0]?.status ?? null, event._count.rsvps);
  }

  async upsertRsvp(eventId: string, userId: string, status: RsvpStatus) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.status !== 'PUBLISHED') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
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

  async deleteRsvp(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });

    await this.prisma.$transaction(async (tx) => {
      await tx.eventRsvp.deleteMany({ where: { eventId, userId } });
      await tx.eventReminder.updateMany({
        where: { eventId, userId, sentAt: null, cancelledAt: null },
        data: { cancelledAt: new Date() },
      });
    });

    return { ok: true };
  }

  async listAttendees(
    eventId: string,
    viewerId: string,
    options: { status?: RsvpStatus; cursor?: string; limit?: number },
  ) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.status === 'DRAFT') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Event not found.' });
    }

    const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
    let cursorCreatedAt: Date | undefined;
    let cursorUserId: string | undefined;
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
      nextCursor:
        rows.length > limit && last
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
      if (claimed.count === 0) continue;

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

  private async refreshRemindersForEvent(
    tx: Prisma.TransactionClient,
    event: { id: string; startsAt: Date; scheduleVersion: number },
  ) {
    const rsvps = await tx.eventRsvp.findMany({
      where: { eventId: event.id, status: { in: ['GOING', 'MAYBE'] } },
    });
    for (const rsvp of rsvps) {
      await this.syncRemindersForUser(tx, event, rsvp.userId, rsvp.status);
    }
  }

  private async syncRemindersForUser(
    tx: Prisma.TransactionClient,
    event: { id: string; startsAt: Date; scheduleVersion: number },
    userId: string,
    status: RsvpStatus,
  ) {
    await tx.eventReminder.updateMany({
      where: { eventId: event.id, userId, sentAt: null, cancelledAt: null },
      data: { cancelledAt: new Date() },
    });

    if (status !== 'GOING' && status !== 'MAYBE') return;

    for (const kind of ['HOURS_24', 'HOURS_1'] as EventReminderKind[]) {
      const remindAt = new Date(event.startsAt.getTime() - REMINDER_OFFSET_MS[kind]);
      if (remindAt <= new Date()) continue;

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
          id: randomUUID(),
          eventId: event.id,
          userId,
          kind,
          scheduleVersion: event.scheduleVersion,
          remindAt,
        },
      });
    }
  }

  private serializeEvent(
    event: {
      id: string;
      slug: string;
      title: string;
      description: string;
      startsAt: Date;
      endsAt: Date;
      timeZone: string;
      locationName: string | null;
      status: EventStatus;
      scheduleVersion: number;
      version: number;
      createdAt: Date;
    },
    viewerId: string,
    viewerRsvp: RsvpStatus | null,
    goingCount = 0,
  ) {
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
}
