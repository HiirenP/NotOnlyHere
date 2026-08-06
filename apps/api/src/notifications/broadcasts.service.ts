import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BroadcastsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: AdminPermissionsService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(
    adminId: string,
    input: {
      title: string;
      body: string;
      audienceType: 'ALL_ACTIVE';
      idempotencyKey: string;
    },
  ) {
    const allowed = await this.permissions.hasPermission(adminId, 'broadcast.create');
    if (!allowed) {
      throw new BadRequestException({ code: 'FORBIDDEN', message: 'broadcast.create permission required.' });
    }

    const existing = await this.prisma.adminBroadcast.findFirst({
      where: { createdByUserId: adminId, idempotencyKey: input.idempotencyKey },
    });
    if (existing) return this.getSummary(existing.id, adminId);

    const recipients = await this.prisma.user.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });

    const broadcast = await this.prisma.$transaction(async (tx) => {
      const created = await tx.adminBroadcast.create({
        data: {
          id: randomUUID(),
          createdByUserId: adminId,
          title: input.title.trim(),
          body: input.body.trim(),
          audienceType: input.audienceType,
          audienceFilter: {},
          status: 'PROCESSING',
          idempotencyKey: input.idempotencyKey,
          startedAt: new Date(),
          recipientCount: recipients.length,
        },
      });

      if (recipients.length > 0) {
        await tx.broadcastRecipient.createMany({
          data: recipients.map((user) => ({
            broadcastId: created.id,
            userId: user.id,
            status: 'PENDING',
          })),
        });
      }

      return created;
    });

    let sent = 0;
    for (const recipient of recipients) {
      const notification = await this.notifications.create({
        recipientUserId: recipient.id,
        eventType: 'broadcast.sent',
        titleKey: 'notification.broadcast.title',
        bodyKey: 'notification.broadcast.body',
        templateParams: { title: broadcast.title, body: broadcast.body },
        sendEmail: false,
      });

      await this.prisma.broadcastRecipient.update({
        where: { broadcastId_userId: { broadcastId: broadcast.id, userId: recipient.id } },
        data: { notificationId: notification.id, status: 'SENT' },
      });
      sent += 1;
    }

    const completed = await this.prisma.adminBroadcast.update({
      where: { id: broadcast.id },
      data: { status: 'COMPLETED', completedAt: new Date(), sentCount: sent },
    });

    return this.serializeSummary(completed);
  }

  async get(broadcastId: string, adminId: string) {
    const allowed = await this.permissions.hasPermission(adminId, 'broadcast.read');
    if (!allowed) {
      throw new BadRequestException({ code: 'FORBIDDEN', message: 'broadcast.read permission required.' });
    }
    const broadcast = await this.prisma.adminBroadcast.findUnique({ where: { id: broadcastId } });
    if (!broadcast) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Broadcast not found.' });
    return this.serializeSummary(broadcast);
  }

  private async getSummary(broadcastId: string, adminId: string) {
    const broadcast = await this.prisma.adminBroadcast.findUnique({ where: { id: broadcastId } });
    if (!broadcast) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Broadcast not found.' });
    return this.serializeSummary(broadcast);
  }

  private serializeSummary(broadcast: {
    id: string;
    title: string;
    body: string;
    status: string;
    recipientCount: number;
    sentCount: number;
    failedCount: number;
    createdAt: Date;
    completedAt: Date | null;
  }) {
    return {
      id: broadcast.id,
      title: broadcast.title,
      body: broadcast.body,
      status: broadcast.status,
      recipientCount: broadcast.recipientCount,
      sentCount: broadcast.sentCount,
      failedCount: broadcast.failedCount,
      createdAt: broadcast.createdAt.toISOString(),
      completedAt: broadcast.completedAt?.toISOString() ?? null,
    };
  }
}
