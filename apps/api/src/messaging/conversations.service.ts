import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MessagingPolicyService } from './messaging-policy.service';
import { buildPairKey } from './messaging.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: MessagingPolicyService,
  ) {}

  async list(userId: string) {
    const rows = await this.prisma.conversationParticipant.findMany({
      where: { userId, leftAt: null },
      include: {
        conversation: {
          include: {
            lastMessage: true,
            participants: { include: { user: { include: { profile: true } } } },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: 'desc' } },
    });

    return rows.map((row) => {
      const other = row.conversation.participants.find((p) => p.userId !== userId);
      return {
        id: row.conversationId,
        otherUser: other
          ? {
              id: other.userId,
              username: other.user.profile?.username ?? 'member',
              displayName: other.user.profile?.displayName ?? 'Member',
            }
          : null,
        lastMessage: row.conversation.lastMessage
          ? {
              id: row.conversation.lastMessage.id,
              body: row.conversation.lastMessage.body,
              createdAt: row.conversation.lastMessage.createdAt.toISOString(),
            }
          : null,
        updatedAt: row.conversation.lastMessageAt?.toISOString() ?? row.conversation.createdAt.toISOString(),
      };
    });
  }

  async createOrGet(userId: string, otherUserId: string) {
    await this.policy.assertCanMessage(userId, otherUserId);
    const pairKey = buildPairKey(userId, otherUserId);
    const existing = await this.prisma.conversation.findUnique({ where: { pairKey } });
    if (existing) {
      await this.policy.assertParticipant(existing.id, userId);
      return { id: existing.id, created: false };
    }

    const conversation = await this.prisma.$transaction(async (tx) => {
      const created = await tx.conversation.create({
        data: { pairKey, kind: 'DIRECT' },
      });
      await tx.conversationParticipant.createMany({
        data: [
          { conversationId: created.id, userId },
          { conversationId: created.id, userId: otherUserId },
        ],
      });
      return created;
    });

    return { id: conversation.id, created: true };
  }

  async get(conversationId: string, userId: string) {
    await this.policy.assertParticipant(conversationId, userId);
    const conversation = await this.prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: { participants: { include: { user: { include: { profile: true } } } } },
    });
    const other = conversation.participants.find((p) => p.userId !== userId);
    return {
      id: conversation.id,
      otherUser: other
        ? {
            id: other.userId,
            username: other.user.profile?.username ?? 'member',
            displayName: other.user.profile?.displayName ?? 'Member',
          }
        : null,
      lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
    };
  }
}
