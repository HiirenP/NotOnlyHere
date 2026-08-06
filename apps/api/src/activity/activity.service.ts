import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async recordProfileUpdated(userId: string) {
    await this.prisma.activityEvent.create({
      data: {
        userId,
        type: 'PROFILE_UPDATED',
        summary: 'Updated profile',
        occurredAt: new Date(),
      },
    });
  }

  async recordConnectionAccepted(userId: string, otherDisplayName: string) {
    await this.prisma.activityEvent.create({
      data: {
        userId,
        type: 'CONNECTION_ACCEPTED',
        summary: `Connected with ${otherDisplayName}`,
        metadata: { otherDisplayName },
        occurredAt: new Date(),
      },
    });
  }

  async recordPostCreated(userId: string, postId: string) {
    await this.prisma.activityEvent.create({
      data: {
        userId,
        type: 'POST_CREATED',
        summary: 'Published a post',
        metadata: { postId },
        occurredAt: new Date(),
      },
    });
  }

  async listForUser(userId: string, viewerId: string, limit = 20) {
    if (userId !== viewerId) {
      return [];
    }

    const events = await this.prisma.activityEvent.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });

    return events.map((event) => ({
      id: event.id,
      type: event.type,
      summary: event.summary,
      occurredAt: event.occurredAt.toISOString(),
    }));
  }
}
