import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async isBlockedEitherWay(userA: string, userB: string) {
    if (userA === userB) return false;
    const block = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: userA, blockedId: userB },
          { blockerId: userB, blockedId: userA },
        ],
      },
    });
    return Boolean(block);
  }

  async hasBlocked(blockerId: string, blockedId: string) {
    const block = await this.prisma.userBlock.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });
    return Boolean(block);
  }

  async listBlocks(userId: string) {
    return this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      include: {
        blocked: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      throw new Error('Cannot block yourself');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.userBlock.upsert({
        where: { blockerId_blockedId: { blockerId, blockedId } },
        update: {},
        create: { blockerId, blockedId },
      });

      await tx.connection.deleteMany({
        where: {
          OR: [
            { requesterId: blockerId, addresseeId: blockedId },
            { requesterId: blockedId, addresseeId: blockerId },
          ],
        },
      });
    });
  }

  async unblockUser(blockerId: string, blockedId: string) {
    await this.prisma.userBlock.deleteMany({
      where: { blockerId, blockedId },
    });
  }

  async resolveTargetUser(input: { userId?: string; username?: string }) {
    if (input.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: input.userId },
        include: { profile: true },
      });
      if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'Member not found.' });
      return user;
    }
    if (input.username) {
      const user = await this.prisma.user.findFirst({
        where: { profile: { username: input.username.toLowerCase() } },
        include: { profile: true },
      });
      if (!user) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'Member not found.' });
      return user;
    }
    throw new BadRequestException({ code: 'TARGET_REQUIRED', message: 'userId or username is required.' });
  }
}
