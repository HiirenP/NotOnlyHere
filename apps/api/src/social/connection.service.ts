import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ConnectionStatus } from '@notonlyhere/contracts';
import { BlockService } from './block.service';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blocks: BlockService,
    private readonly activity: ActivityService,
  ) {}

  private async findPairConnection(userA: string, userB: string) {
    return this.prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: userA, addresseeId: userB },
          { requesterId: userB, addresseeId: userA },
        ],
      },
      include: {
        requester: { include: { profile: true } },
        addressee: { include: { profile: true } },
      },
    });
  }

  async listConnections(userId: string, status?: ConnectionStatus) {
    const connections = await this.prisma.connection.findMany({
      where: {
        ...(status ? { status } : {}),
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { include: { profile: true } },
        addressee: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return connections.map((connection) => this.serialize(connection, userId));
  }

  async getConnectionContext(viewerId: string, targetUserId: string) {
    if (viewerId === targetUserId) {
      return {
        connectionStatus: null as ConnectionStatus | null,
        connectionId: null as string | null,
        isBlocked: false,
        isBlockedBy: false,
        canConnect: false,
        canMessage: false,
      };
    }

    const [connection, isBlockedEitherWay, hasBlocked, isBlockedBy] = await Promise.all([
      this.findPairConnection(viewerId, targetUserId),
      this.blocks.isBlockedEitherWay(viewerId, targetUserId),
      this.blocks.hasBlocked(viewerId, targetUserId),
      this.blocks.hasBlocked(targetUserId, viewerId),
    ]);

    const connectionStatus = connection?.status ?? null;
    const accepted = connectionStatus === 'ACCEPTED';

    return {
      connectionStatus,
      connectionId: connection?.id ?? null,
      isBlocked: isBlockedEitherWay,
      isBlockedBy,
      canConnect: !isBlockedEitherWay && !accepted && connectionStatus !== 'PENDING',
      canMessage: accepted && !isBlockedEitherWay,
    };
  }

  async sendRequest(requesterId: string, addresseeUsername: string) {
    const addressee = await this.prisma.user.findFirst({
      where: {
        status: 'ACTIVE',
        profile: { username: addresseeUsername.toLowerCase() },
      },
      include: { profile: true },
    });

    if (!addressee?.profile) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'Member not found.' });
    }

    if (addressee.id === requesterId) {
      throw new BadRequestException({
        code: 'SELF_CONNECTION',
        message: 'You cannot connect with yourself.',
      });
    }

    if (await this.blocks.isBlockedEitherWay(requesterId, addressee.id)) {
      throw new ForbiddenException({
        code: 'BLOCKED',
        message: 'Connection is not available.',
      });
    }

    const existing = await this.findPairConnection(requesterId, addressee.id);
    if (existing) {
      if (existing.status === 'ACCEPTED') {
        return this.serialize(existing, requesterId);
      }
      if (existing.status === 'PENDING') {
        if (existing.requesterId === addressee.id && existing.addresseeId === requesterId) {
          return this.acceptConnection(existing.id, requesterId);
        }
        return this.serialize(existing, requesterId);
      }
    }

    const created = await this.prisma.connection.create({
      data: {
        requesterId,
        addresseeId: addressee.id,
        status: 'PENDING',
      },
      include: {
        requester: { include: { profile: true } },
        addressee: { include: { profile: true } },
      },
    });

    return this.serialize(created, requesterId);
  }

  async acceptConnection(connectionId: string, userId: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
      include: {
        requester: { include: { profile: true } },
        addressee: { include: { profile: true } },
      },
    });

    if (!connection) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Connection not found.' });
    }
    if (connection.addresseeId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only the recipient can accept.' });
    }
    if (connection.status === 'ACCEPTED') {
      return this.serialize(connection, userId);
    }
    if (connection.status !== 'PENDING') {
      throw new BadRequestException({ code: 'INVALID_STATE', message: 'Connection cannot be accepted.' });
    }

    if (await this.blocks.isBlockedEitherWay(connection.requesterId, connection.addresseeId)) {
      throw new ForbiddenException({ code: 'BLOCKED', message: 'Connection is not available.' });
    }

    const now = new Date();
    const updated = await this.prisma.connection.update({
      where: { id: connection.id },
      data: { status: 'ACCEPTED', respondedAt: now },
      include: {
        requester: { include: { profile: true } },
        addressee: { include: { profile: true } },
      },
    });

    await Promise.all([
      this.activity.recordConnectionAccepted(updated.requesterId, updated.addressee.profile!.displayName),
      this.activity.recordConnectionAccepted(updated.addresseeId, updated.requester.profile!.displayName),
    ]);

    return this.serialize(updated, userId);
  }

  async removeConnection(connectionId: string, userId: string) {
    const connection = await this.prisma.connection.findUnique({ where: { id: connectionId } });
    if (!connection) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Connection not found.' });
    }
    if (connection.requesterId !== userId && connection.addresseeId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Not allowed.' });
    }

    await this.prisma.connection.delete({ where: { id: connectionId } });
    return { ok: true };
  }

  countAcceptedConnections(userId: string) {
    return this.prisma.connection.count({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
    });
  }

  private serialize(
    connection: {
      id: string;
      status: ConnectionStatus;
      requesterId: string;
      addresseeId: string;
      createdAt: Date;
      respondedAt: Date | null;
      requester: { id: string; profile: { username: string; displayName: string } | null };
      addressee: { id: string; profile: { username: string; displayName: string } | null };
    },
    viewerId: string,
  ) {
    const direction =
      connection.status === 'ACCEPTED'
        ? ('connected' as const)
        : connection.requesterId === viewerId
          ? ('outgoing' as const)
          : ('incoming' as const);

    return {
      id: connection.id,
      status: connection.status,
      requester: {
        id: connection.requester.id,
        username: connection.requester.profile?.username ?? 'member',
        displayName: connection.requester.profile?.displayName ?? 'Member',
        avatar: null,
      },
      addressee: {
        id: connection.addressee.id,
        username: connection.addressee.profile?.username ?? 'member',
        displayName: connection.addressee.profile?.displayName ?? 'Member',
        avatar: null,
      },
      createdAt: connection.createdAt.toISOString(),
      respondedAt: connection.respondedAt?.toISOString() ?? null,
      direction,
    };
  }
}
