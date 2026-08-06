import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';

export type CreateNotificationInput = {
  recipientUserId: string;
  eventType: string;
  titleKey: string;
  bodyKey: string;
  templateParams?: Record<string, unknown>;
  actorUserId?: string | null;
  postId?: string;
  commentId?: string;
  connectionId?: string;
  circleId?: string;
  circleInviteId?: string;
  conversationId?: string;
  eventId?: string;
  targetUserId?: string;
  sendEmail?: boolean;
};

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
  ) {}

  async create(input: CreateNotificationInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    const notification = await client.notification.create({
      data: {
        id: randomUUID(),
        recipientUserId: input.recipientUserId,
        eventType: input.eventType,
        actorUserId: input.actorUserId ?? null,
        postId: input.postId ?? null,
        commentId: input.commentId ?? null,
        connectionId: input.connectionId ?? null,
        circleId: input.circleId ?? null,
        circleInviteId: input.circleInviteId ?? null,
        conversationId: input.conversationId ?? null,
        eventId: input.eventId ?? null,
        targetUserId: input.targetUserId ?? null,
        titleKey: input.titleKey,
        bodyKey: input.bodyKey,
        templateParams: (input.templateParams ?? {}) as Prisma.InputJsonValue,
      },
    });

    if (input.sendEmail !== false) {
      await this.outbox.emitNotificationEmail(notification.id, input.recipientUserId, input.eventType, tx);
    }

    return this.serialize(notification);
  }

  async list(userId: string, options: { cursor?: string; limit?: number }) {
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
    let cursorDate: Date | undefined;
    let cursorId: string | undefined;
    if (options.cursor) {
      const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
      cursorDate = new Date(createdAt);
      cursorId = id;
    }

    const rows = await this.prisma.notification.findMany({
      where: {
        recipientUserId: userId,
        ...(cursorDate && cursorId
          ? {
              OR: [
                { createdAt: { lt: cursorDate } },
                { createdAt: cursorDate, id: { lt: cursorId } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const page = rows.slice(0, limit);
    const last = page[page.length - 1];
    const unreadCount = await this.prisma.notification.count({
      where: { recipientUserId: userId, readAt: null },
    });

    return {
      unreadCount,
      items: page.map((row) => this.serialize(row)),
      nextCursor:
        rows.length > limit && last
          ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
          : null,
    };
  }

  async markRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, recipientUserId: userId },
    });
    if (!notification) return { ok: false };
    if (!notification.readAt) {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      });
    }
    return { ok: true };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { recipientUserId: userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  hashEmail(email: string) {
    return createHash('sha256').update(email.toLowerCase()).digest();
  }

  private serialize(notification: {
    id: string;
    eventType: string;
    titleKey: string;
    bodyKey: string;
    templateParams: unknown;
    readAt: Date | null;
    createdAt: Date;
    actorUserId: string | null;
    postId: string | null;
    commentId: string | null;
    connectionId: string | null;
    circleId: string | null;
    conversationId: string | null;
    targetUserId: string | null;
  }) {
    return {
      id: notification.id,
      eventType: notification.eventType,
      titleKey: notification.titleKey,
      bodyKey: notification.bodyKey,
      templateParams: notification.templateParams,
      readAt: notification.readAt?.toISOString() ?? null,
      createdAt: notification.createdAt.toISOString(),
      targets: {
        actorUserId: notification.actorUserId,
        postId: notification.postId,
        commentId: notification.commentId,
        connectionId: notification.connectionId,
        circleId: notification.circleId,
        conversationId: notification.conversationId,
        targetUserId: notification.targetUserId,
      },
    };
  }
}
