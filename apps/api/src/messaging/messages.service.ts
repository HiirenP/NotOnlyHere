import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MessagingPolicyService } from './messaging-policy.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  ALLOWED_MESSAGE_EMOJI,
  MESSAGE_BODY_MAX,
  decodeMessageCursor,
  encodeMessageCursor,
} from './messaging.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: MessagingPolicyService,
    private readonly notifications: NotificationsService,
  ) {}

  async list(conversationId: string, userId: string, options: { cursor?: string; limit?: number }) {
    await this.policy.assertParticipant(conversationId, userId);
    const limit = Math.min(Math.max(options.limit ?? 30, 1), 100);
    let cursor: { createdAt: Date; id: string } | null = null;
    if (options.cursor) {
      try {
        cursor = decodeMessageCursor(options.cursor);
      } catch {
        throw new BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid cursor.' });
      }
    }

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        status: 'ACTIVE',
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      include: { reactions: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const page = messages.slice(0, limit).reverse();
    const oldest = page[0];

    return {
      items: page.map((message) => this.serialize(message, userId)),
      nextCursor:
        messages.length > limit && oldest
          ? encodeMessageCursor(oldest.createdAt, oldest.id)
          : null,
    };
  }

  async send(conversationId: string, senderId: string, input: { body: string; clientMessageId: string }) {
    await this.policy.assertParticipant(conversationId, senderId);
    const body = input.body.trim();
    if (!body) throw new BadRequestException({ code: 'EMPTY_MESSAGE', message: 'Message cannot be empty.' });
    if (body.length > MESSAGE_BODY_MAX) {
      throw new BadRequestException({ code: 'MESSAGE_TOO_LONG', message: 'Message is too long.' });
    }

    const clientMessageId = input.clientMessageId || randomUUID();
    const existing = await this.prisma.message.findFirst({
      where: { senderUserId: senderId, clientMessageId },
      include: { reactions: true },
    });
    if (existing) return this.serialize(existing, senderId);

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: {
          conversationId,
          senderUserId: senderId,
          clientMessageId,
          body,
        },
        include: { reactions: true },
      });
      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageId: created.id, lastMessageAt: created.createdAt },
      });
      return created;
    });

    const participants = await this.prisma.conversationParticipant.findMany({
      where: { conversationId, leftAt: null },
    });
    const recipient = participants.find((p) => p.userId !== senderId);
    if (recipient) {
      await this.notifications.create({
        recipientUserId: recipient.userId,
        eventType: 'message.received',
        titleKey: 'notification.message.title',
        bodyKey: 'notification.message.body',
        conversationId,
        actorUserId: senderId,
        templateParams: { preview: body.slice(0, 80) },
      });
    }

    return this.serialize(message, senderId);
  }

  assertEmoji(emoji: string) {
    if (!ALLOWED_MESSAGE_EMOJI.includes(emoji as (typeof ALLOWED_MESSAGE_EMOJI)[number])) {
      throw new BadRequestException({ code: 'INVALID_EMOJI', message: 'Emoji not allowed.' });
    }
    return emoji;
  }

  async setReaction(messageId: string, userId: string, emoji: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.status !== 'ACTIVE') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Message not found.' });
    }
    await this.policy.assertParticipant(message.conversationId, userId);
    this.assertEmoji(emoji);

    await this.prisma.messageReaction.upsert({
      where: { messageId_userId_emoji: { messageId, userId, emoji } },
      update: {},
      create: { messageId, userId, emoji },
    });
    return this.getReactionSummary(messageId, userId);
  }

  async removeReaction(messageId: string, userId: string, emoji: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Message not found.' });
    await this.policy.assertParticipant(message.conversationId, userId);
    await this.prisma.messageReaction.deleteMany({ where: { messageId, userId, emoji } });
    return this.getReactionSummary(messageId, userId);
  }

  private async getReactionSummary(messageId: string, viewerId: string) {
    const reactions = await this.prisma.messageReaction.findMany({ where: { messageId } });
    const counts: Record<string, number> = {};
    const viewer: string[] = [];
    for (const reaction of reactions) {
      counts[reaction.emoji] = (counts[reaction.emoji] ?? 0) + 1;
      if (reaction.userId === viewerId) viewer.push(reaction.emoji);
    }
    return { counts, viewerReactions: viewer };
  }

  private serialize(
    message: {
      id: string;
      conversationId: string;
      senderUserId: string | null;
      clientMessageId: string;
      body: string | null;
      createdAt: Date;
      reactions: { emoji: string; userId: string }[];
    },
    viewerId: string,
  ) {
    const counts: Record<string, number> = {};
    const viewerReactions: string[] = [];
    for (const reaction of message.reactions) {
      counts[reaction.emoji] = (counts[reaction.emoji] ?? 0) + 1;
      if (reaction.userId === viewerId) viewerReactions.push(reaction.emoji);
    }
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderUserId: message.senderUserId,
      clientMessageId: message.clientMessageId,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      reactions: { counts, viewerReactions },
      viewer: { isSender: message.senderUserId === viewerId },
    };
  }
}
