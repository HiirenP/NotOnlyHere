import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OutboxService } from '../outbox/outbox.service';
import { CirclePolicyService } from './circle-policy.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CircleMembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: CirclePolicyService,
    private readonly outbox: OutboxService,
  ) {}

  async join(circleId: string, userId: string) {
    const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
    if (!circle) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });

    const existing = await this.prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId } },
    });

    if (!this.policy.canJoin(circle, existing)) {
      if (circle.joinPolicy === 'PRIVATE') {
        throw new ForbiddenException({
          code: 'INVITE_REQUIRED',
          message: 'This circle requires an invite to join.',
        });
      }
      if (existing?.status === 'PENDING') {
        throw new ConflictException({ code: 'ALREADY_PENDING', message: 'Join request already pending.' });
      }
      if (existing?.status === 'ACTIVE') {
        throw new ConflictException({ code: 'ALREADY_MEMBER', message: 'Already a member.' });
      }
      throw new ForbiddenException({ code: 'CANNOT_JOIN', message: 'Cannot join this circle.' });
    }

    const now = new Date();

    if (circle.joinPolicy === 'OPEN') {
      await this.prisma.$transaction(async (tx) => {
        await tx.circleMember.upsert({
          where: { circleId_userId: { circleId, userId } },
          update: {
            status: 'ACTIVE',
            role: 'MEMBER',
            joinedAt: now,
            leftAt: null,
            requestedAt: null,
            decidedAt: null,
          },
          create: {
            circleId,
            userId,
            role: 'MEMBER',
            status: 'ACTIVE',
            joinedAt: now,
          },
        });
        await tx.circle.update({
          where: { id: circleId },
          data: { memberCount: { increment: 1 } },
        });
      });
      return { status: 'ACTIVE' as const, message: 'Joined circle.' };
    }

    await this.prisma.circleMember.upsert({
      where: { circleId_userId: { circleId, userId } },
      update: {
        status: 'PENDING',
        requestedAt: now,
        leftAt: null,
        joinedAt: null,
        decidedAt: null,
      },
      create: {
        circleId,
        userId,
        status: 'PENDING',
        requestedAt: now,
      },
    });

    await this.outbox.emitCircleMembershipRequested(circleId, userId);
    return { status: 'PENDING' as const, message: 'Join request submitted.' };
  }

  async leave(circleId: string, userId: string) {
    const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
    if (!circle) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });

    const membership = await this.prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId } },
    });
    if (!this.policy.canLeave(membership)) {
      throw new BadRequestException({ code: 'NOT_A_MEMBER', message: 'Not an active member.' });
    }

    if (membership!.role === 'ADMIN') {
      const adminCount = await this.prisma.circleMember.count({
        where: { circleId, status: 'ACTIVE', role: 'ADMIN' },
      });
      if (adminCount <= 1) {
        throw new ForbiddenException({
          code: 'LAST_ADMIN',
          message: 'Cannot leave as the only Circle Admin. Transfer admin role first.',
        });
      }
    }

    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      await tx.circleMember.update({
        where: { circleId_userId: { circleId, userId } },
        data: { status: 'LEFT', leftAt: now },
      });
      await tx.circle.update({
        where: { id: circleId },
        data: { memberCount: { decrement: 1 } },
      });
    });

    return { ok: true, leftAt: now.toISOString() };
  }
}
