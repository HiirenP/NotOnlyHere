import { createHash, randomBytes } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OutboxService } from '../outbox/outbox.service';
import { CircleAdminService } from './circle-admin.service';
import { NotificationsService } from '../notifications/notifications.service';
import { INVITE_TTL_MS } from './circles.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CircleInvitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
    private readonly admin: CircleAdminService,
    private readonly notifications: NotificationsService,
  ) {}

  hashToken(token: string) {
    return createHash('sha256').update(token).digest();
  }

  async accept(rawToken: string, userId: string) {
    const invite = await this.findUsableInvite(rawToken);
    if (invite.inviteeUserId && invite.inviteeUserId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Invite is for another member.' });
    }

    const now = new Date();
    const existing = await this.prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId: invite.circleId, userId } },
    });
    if (existing?.status === 'ACTIVE') {
      throw new ConflictException({ code: 'ALREADY_MEMBER', message: 'Already a member.' });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.circleInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: now, acceptedByUserId: userId },
      });

      const wasActive = existing?.status === 'ACTIVE';
      await tx.circleMember.upsert({
        where: { circleId_userId: { circleId: invite.circleId, userId } },
        update: {
          status: 'ACTIVE',
          role: 'MEMBER',
          joinedAt: now,
          invitedByUserId: invite.inviterUserId,
          leftAt: null,
          requestedAt: null,
          decidedAt: now,
        },
        create: {
          circleId: invite.circleId,
          userId,
          role: 'MEMBER',
          status: 'ACTIVE',
          joinedAt: now,
          invitedByUserId: invite.inviterUserId,
          decidedAt: now,
        },
      });

      if (!wasActive) {
        await tx.circle.update({
          where: { id: invite.circleId },
          data: { memberCount: { increment: 1 } },
        });
      }
    });

    return { ok: true, circleId: invite.circleId };
  }

  async decline(rawToken: string, userId: string) {
    const invite = await this.findUsableInvite(rawToken);
    if (invite.inviteeUserId && invite.inviteeUserId !== userId) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Invite is for another member.' });
    }

    await this.prisma.circleInvite.update({
      where: { id: invite.id },
      data: { declinedAt: new Date() },
    });
    return { ok: true };
  }

  private async findUsableInvite(rawToken: string) {
    if (!rawToken?.trim()) {
      throw new BadRequestException({ code: 'INVALID_TOKEN', message: 'Invite token required.' });
    }
    const tokenHash = this.hashToken(rawToken.trim());
    const invite = await this.prisma.circleInvite.findFirst({
      where: { tokenHash },
      include: { circle: true },
    });
    if (!invite || invite.revokedAt) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Invite not found.' });
    }
    if (invite.acceptedAt || invite.declinedAt) {
      throw new ConflictException({ code: 'INVITE_USED', message: 'Invite already used.' });
    }
    if (invite.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException({ code: 'INVITE_EXPIRED', message: 'Invite has expired.' });
    }
    if (invite.circle.status !== 'ACTIVE') {
      throw new BadRequestException({ code: 'CIRCLE_INACTIVE', message: 'Circle is not active.' });
    }
    return invite;
  }

  async createInvite(circleId: string, adminId: string, inviteeUserId: string) {
    await this.admin.assertCircleAdmin(circleId, adminId);
    const rawToken = randomBytes(24).toString('hex');
    const invite = await this.createInviteForUser(circleId, adminId, inviteeUserId, rawToken);
    await this.notifications.create({
      recipientUserId: inviteeUserId,
      eventType: 'circle.invite_received',
      titleKey: 'notification.circle_invite.title',
      bodyKey: 'notification.circle_invite.body',
      circleId,
      circleInviteId: invite.id,
      actorUserId: adminId,
    });
    await this.outbox.emitCircleInviteReceived(circleId, invite.id, inviteeUserId);
    return {
      id: invite.id,
      token: rawToken,
      expiresAt: invite.expiresAt.toISOString(),
      inviteUrl: `${process.env.WEB_URL ?? 'http://localhost:3000'}/app/circles/invites/${rawToken}`,
    };
  }

  async listInvites(circleId: string, adminId: string) {
    await this.admin.assertCircleAdmin(circleId, adminId);
    const invites = await this.prisma.circleInvite.findMany({
      where: { circleId, revokedAt: null, acceptedAt: null, declinedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { invitee: { include: { profile: true } } },
    });
    return invites.map((invite) => ({
      id: invite.id,
      inviteeUserId: invite.inviteeUserId,
      inviteeUsername: invite.invitee?.profile?.username ?? null,
      expiresAt: invite.expiresAt.toISOString(),
      createdAt: invite.createdAt.toISOString(),
    }));
  }

  async revokeInvite(circleId: string, adminId: string, inviteId: string) {
    await this.admin.assertCircleAdmin(circleId, adminId);
    const invite = await this.prisma.circleInvite.findFirst({ where: { id: inviteId, circleId } });
    if (!invite) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Invite not found.' });
    await this.prisma.circleInvite.update({
      where: { id: inviteId },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  }

  async revokeInviteById(inviteId: string, actorId: string) {
    const invite = await this.prisma.circleInvite.findUnique({ where: { id: inviteId } });
    if (!invite) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Invite not found.' });
    return this.revokeInvite(invite.circleId, actorId, inviteId);
  }

  async createInviteForUser(circleId: string, inviterUserId: string, inviteeUserId: string, rawToken: string) {
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);
    return this.prisma.circleInvite.create({
      data: {
        circleId,
        inviterUserId,
        inviteeUserId,
        tokenHash: this.hashToken(rawToken),
        expiresAt,
      },
    });
  }
}
