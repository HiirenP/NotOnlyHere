"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleInvitesService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const outbox_service_1 = require("../outbox/outbox.service");
const circle_admin_service_1 = require("./circle-admin.service");
const notifications_service_1 = require("../notifications/notifications.service");
const circles_constants_1 = require("./circles.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let CircleInvitesService = class CircleInvitesService {
    prisma;
    outbox;
    admin;
    notifications;
    constructor(prisma, outbox, admin, notifications) {
        this.prisma = prisma;
        this.outbox = outbox;
        this.admin = admin;
        this.notifications = notifications;
    }
    hashToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest();
    }
    async accept(rawToken, userId) {
        const invite = await this.findUsableInvite(rawToken);
        if (invite.inviteeUserId && invite.inviteeUserId !== userId) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Invite is for another member.' });
        }
        const now = new Date();
        const existing = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId: invite.circleId, userId } },
        });
        if (existing?.status === 'ACTIVE') {
            throw new common_1.ConflictException({ code: 'ALREADY_MEMBER', message: 'Already a member.' });
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
    async decline(rawToken, userId) {
        const invite = await this.findUsableInvite(rawToken);
        if (invite.inviteeUserId && invite.inviteeUserId !== userId) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Invite is for another member.' });
        }
        await this.prisma.circleInvite.update({
            where: { id: invite.id },
            data: { declinedAt: new Date() },
        });
        return { ok: true };
    }
    async findUsableInvite(rawToken) {
        if (!rawToken?.trim()) {
            throw new common_1.BadRequestException({ code: 'INVALID_TOKEN', message: 'Invite token required.' });
        }
        const tokenHash = this.hashToken(rawToken.trim());
        const invite = await this.prisma.circleInvite.findFirst({
            where: { tokenHash },
            include: { circle: true },
        });
        if (!invite || invite.revokedAt) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Invite not found.' });
        }
        if (invite.acceptedAt || invite.declinedAt) {
            throw new common_1.ConflictException({ code: 'INVITE_USED', message: 'Invite already used.' });
        }
        if (invite.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException({ code: 'INVITE_EXPIRED', message: 'Invite has expired.' });
        }
        if (invite.circle.status !== 'ACTIVE') {
            throw new common_1.BadRequestException({ code: 'CIRCLE_INACTIVE', message: 'Circle is not active.' });
        }
        return invite;
    }
    async createInvite(circleId, adminId, inviteeUserId) {
        await this.admin.assertCircleAdmin(circleId, adminId);
        const rawToken = (0, crypto_1.randomBytes)(24).toString('hex');
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
    async listInvites(circleId, adminId) {
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
    async revokeInvite(circleId, adminId, inviteId) {
        await this.admin.assertCircleAdmin(circleId, adminId);
        const invite = await this.prisma.circleInvite.findFirst({ where: { id: inviteId, circleId } });
        if (!invite)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Invite not found.' });
        await this.prisma.circleInvite.update({
            where: { id: inviteId },
            data: { revokedAt: new Date() },
        });
        return { ok: true };
    }
    async revokeInviteById(inviteId, actorId) {
        const invite = await this.prisma.circleInvite.findUnique({ where: { id: inviteId } });
        if (!invite)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Invite not found.' });
        return this.revokeInvite(invite.circleId, actorId, inviteId);
    }
    async createInviteForUser(circleId, inviterUserId, inviteeUserId, rawToken) {
        const expiresAt = new Date(Date.now() + circles_constants_1.INVITE_TTL_MS);
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
};
exports.CircleInvitesService = CircleInvitesService;
exports.CircleInvitesService = CircleInvitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbox_service_1.OutboxService,
        circle_admin_service_1.CircleAdminService,
        notifications_service_1.NotificationsService])
], CircleInvitesService);
//# sourceMappingURL=circle-invites.service.js.map