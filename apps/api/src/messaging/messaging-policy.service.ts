import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagingPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async canMessage(userId: string, otherUserId: string) {
    if (userId === otherUserId) return false;
    const block = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: otherUserId },
          { blockerId: otherUserId, blockedId: userId },
        ],
      },
    });
    if (block) return false;

    const connection = await this.prisma.connection.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: userId },
        ],
      },
    });
    return Boolean(connection);
  }

  async assertParticipant(conversationId: string, userId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant || participant.leftAt) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Conversation not found.' });
    }
    return participant;
  }

  async assertCanMessage(userId: string, otherUserId: string) {
    const allowed = await this.canMessage(userId, otherUserId);
    if (!allowed) {
      throw new ForbiddenException({
        code: 'NOT_CONNECTED',
        message: 'Direct messages require an accepted connection and no block.',
      });
    }
  }
}
