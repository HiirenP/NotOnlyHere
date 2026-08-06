import { createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OutboxService {
  constructor(private readonly prisma: PrismaService) {}

  private client(tx?: Prisma.TransactionClient) {
    return tx ?? this.prisma;
  }

  async emitNoop(aggregateId: string, message: string) {
    return this.prisma.outboxEvent.create({
      data: {
        aggregateType: 'platform',
        aggregateId,
        eventType: 'platform.noop',
        payload: {
          message,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitEmailVerification(
    userId: string,
    email: string,
    rawToken: string,
    tx?: Prisma.TransactionClient,
  ) {
    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: 'user',
        aggregateId: userId,
        eventType: 'email.verification',
        payload: {
          email,
          verifyUrl: `${webUrl}/verify-email?token=${rawToken}`,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitPasswordReset(
    userId: string,
    email: string,
    rawToken: string,
    tx?: Prisma.TransactionClient,
  ) {
    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: 'user',
        aggregateId: userId,
        eventType: 'email.password_reset',
        payload: {
          email,
          resetUrl: `${webUrl}/reset-password?token=${rawToken}`,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitAccountExport(userId: string, exportId: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: 'user',
        aggregateId: userId,
        eventType: 'account.export',
        payload: {
          exportId,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitAccountDeletion(userId: string, dueAt: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: 'user',
        aggregateId: userId,
        eventType: 'account.deletion',
        payload: {
          dueAt,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitCircleMembershipRequested(circleId: string, userId: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: 'circle',
        aggregateId: circleId,
        eventType: 'circle.membership_requested',
        payload: {
          circleId,
          userId,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitCircleInviteReceived(
    circleId: string,
    inviteId: string,
    inviteeUserId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: 'circle',
        aggregateId: circleId,
        eventType: 'circle.invite_received',
        payload: {
          circleId,
          inviteId,
          inviteeUserId,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitNotificationEmail(
    notificationId: string,
    recipientUserId: string,
    eventType: string,
    tx?: Prisma.TransactionClient,
  ) {
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: 'notification',
        aggregateId: notificationId,
        eventType: 'notification.email',
        payload: {
          notificationId,
          recipientUserId,
          eventType,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async emitModerationEvaluate(
    aggregateId: string,
    payload: { postId?: string; commentId?: string },
    tx?: Prisma.TransactionClient,
  ) {
    return this.client(tx).outboxEvent.create({
      data: {
        aggregateType: payload.postId ? 'post' : 'comment',
        aggregateId,
        eventType: 'moderation.evaluate',
        payload: {
          ...payload,
          emittedAt: new Date().toISOString(),
        },
      },
    });
  }

  async claimNextBatch(workerId: string, limit = 10) {
    return this.prisma.$transaction(async (tx) => {
      const events = await tx.$queryRaw<
        { id: string }[]
      >`SELECT id FROM outbox_events WHERE status = 'PENDING' AND available_at <= NOW() ORDER BY available_at, id FOR UPDATE SKIP LOCKED LIMIT ${limit}`;

      const ids = events.map((e) => e.id);
      if (ids.length === 0) return [];

      await tx.outboxEvent.updateMany({
        where: { id: { in: ids } },
        data: {
          status: 'PROCESSING',
          lockedAt: new Date(),
          lockedBy: workerId,
        },
      });

      return tx.outboxEvent.findMany({ where: { id: { in: ids } } });
    });
  }

  async markDelivered(eventId: string, consumer: string) {
    await this.prisma.$transaction([
      this.prisma.outboxEvent.update({
        where: { id: eventId },
        data: { status: 'DELIVERED', deliveredAt: new Date(), lockedAt: null, lockedBy: null },
      }),
      this.prisma.outboxConsumption.create({
        data: {
          consumer,
          eventId,
          processedAt: new Date(),
          result: 'ok',
        },
      }),
    ]);
  }
}
