import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { MembershipStatus } from '@prisma/client';
import { CirclePolicyService } from './circle-policy.service';
import { CIRCLE_DEFAULT_LIMIT, decodeCursor, encodeCursor } from './circles.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CirclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: CirclePolicyService,
  ) {}

  async listCircles(
    viewerId: string,
    options: { q?: string; cursor?: string; limit?: number },
  ) {
    const limit = Math.min(Math.max(options.limit ?? CIRCLE_DEFAULT_LIMIT, 1), 50);
    let cursor: { createdAt: Date; id: string } | null = null;
    if (options.cursor) {
      try {
        cursor = decodeCursor(options.cursor);
      } catch {
        throw new BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid cursor.' });
      }
    }

    const query = options.q?.trim();
    const memberships = await this.prisma.circleMember.findMany({
      where: { userId: viewerId, status: 'ACTIVE' },
      select: { circleId: true },
    });
    const memberCircleIds = memberships.map((m) => m.circleId);

    const candidates = await this.prisma.circle.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { visibility: { in: ['PUBLIC', 'PRIVATE'] } },
          ...(memberCircleIds.length > 0 ? [{ id: { in: memberCircleIds }, visibility: 'HIDDEN' as const }] : []),
        ],
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { description: { contains: query, mode: 'insensitive' as const } },
              ],
            }
          : {}),
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const page = candidates.slice(0, limit);
    const last = page[page.length - 1];
    const membershipMap = await this.loadMembershipMap(
      viewerId,
      page.map((c) => c.id),
    );

    return {
      query: query ?? '',
      items: page.map((circle) => this.serializeSummary(circle, membershipMap.get(circle.id) ?? null)),
      nextCursor: candidates.length > limit && last ? encodeCursor(last.createdAt, last.id) : null,
    };
  }

  async getCircle(circleId: string, viewerId: string) {
    const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
    if (!circle) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });

    const membership = await this.prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId: viewerId } },
    });

    if (!this.policy.canViewDetail(circle, membership)) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
    }

    const isMember = this.policy.isActiveMember(membership);
    return this.serializeDetail(circle, membership, isMember);
  }

  async listMembers(circleId: string, viewerId: string, options: { cursor?: string; limit?: number }) {
    const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
    if (!circle) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });

    const membership = await this.prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId: viewerId } },
    });
    if (!this.policy.canViewMemberList(membership)) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
    }

    const limit = Math.min(Math.max(options.limit ?? CIRCLE_DEFAULT_LIMIT, 1), 50);
    let cursor: { joinedAt: Date; userId: string } | null = null;
    if (options.cursor) {
      try {
        const decoded = decodeCursor(options.cursor);
        cursor = { joinedAt: decoded.createdAt, userId: decoded.id };
      } catch {
        throw new BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid cursor.' });
      }
    }

    const members = await this.prisma.circleMember.findMany({
      where: {
        circleId,
        status: 'ACTIVE',
        ...(cursor
          ? {
              OR: [
                { joinedAt: { lt: cursor.joinedAt } },
                { joinedAt: cursor.joinedAt, userId: { lt: cursor.userId } },
              ],
            }
          : {}),
      },
      include: { user: { include: { profile: true } } },
      orderBy: [{ joinedAt: 'desc' }, { userId: 'desc' }],
      take: limit + 1,
    });

    const page = members.slice(0, limit);
    const last = page[page.length - 1];

    return {
      items: page.map((member) => ({
        userId: member.userId,
        username: member.user.profile?.username ?? 'member',
        displayName: member.user.profile?.displayName ?? 'Member',
        role: member.role,
        joinedAt: member.joinedAt?.toISOString() ?? null,
      })),
      nextCursor:
        members.length > limit && last?.joinedAt
          ? encodeCursor(last.joinedAt, last.userId)
          : null,
    };
  }

  private async loadMembershipMap(viewerId: string, circleIds: string[]) {
    if (circleIds.length === 0) return new Map();
    const rows = await this.prisma.circleMember.findMany({
      where: { userId: viewerId, circleId: { in: circleIds } },
    });
    return new Map(rows.map((row) => [row.circleId, row]));
  }

  serializeSummary(
    circle: {
      id: string;
      slug: string;
      name: string;
      description: string;
      visibility: string;
      joinPolicy: string;
      memberCount: number;
      createdAt: Date;
    },
    membership: { status: MembershipStatus; role: string } | null,
  ) {
    return {
      id: circle.id,
      slug: circle.slug,
      name: circle.name,
      description: circle.description,
      visibility: circle.visibility,
      joinPolicy: circle.joinPolicy,
      memberCount: circle.memberCount,
      createdAt: circle.createdAt.toISOString(),
      viewer: {
        membershipStatus: membership?.status ?? null,
        role: membership?.role ?? null,
        isMember: membership?.status === 'ACTIVE',
        canJoin: this.policy.canJoin(
          { joinPolicy: circle.joinPolicy as never, status: 'ACTIVE' },
          membership,
        ),
      },
    };
  }

  serializeDetail(
    circle: {
      id: string;
      slug: string;
      name: string;
      description: string;
      guidelines: string;
      visibility: string;
      joinPolicy: string;
      memberCount: number;
      version: number;
      createdAt: Date;
    },
    membership: { status: MembershipStatus; role: string } | null,
    isMember: boolean,
  ) {
    return {
      id: circle.id,
      slug: circle.slug,
      name: circle.name,
      description: circle.description,
      guidelines: isMember ? circle.guidelines : null,
      visibility: circle.visibility,
      joinPolicy: circle.joinPolicy,
      memberCount: circle.memberCount,
      version: circle.version,
      createdAt: circle.createdAt.toISOString(),
      viewer: {
        membershipStatus: membership?.status ?? null,
        role: membership?.role ?? null,
        isMember,
        isAdmin: membership?.status === 'ACTIVE' && membership.role === 'ADMIN',
        canJoin: this.policy.canJoin(
          { joinPolicy: circle.joinPolicy as never, status: 'ACTIVE' },
          membership,
        ),
        canLeave: this.policy.canLeave(membership),
        canViewMembers: isMember,
        canManage: membership?.status === 'ACTIVE' && membership.role === 'ADMIN',
      },
    };
  }
}
