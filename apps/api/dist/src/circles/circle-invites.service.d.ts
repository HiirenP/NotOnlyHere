import { OutboxService } from '../outbox/outbox.service';
import { CircleAdminService } from './circle-admin.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class CircleInvitesService {
    private readonly prisma;
    private readonly outbox;
    private readonly admin;
    private readonly notifications;
    constructor(prisma: PrismaService, outbox: OutboxService, admin: CircleAdminService, notifications: NotificationsService);
    hashToken(token: string): NonSharedBuffer;
    accept(rawToken: string, userId: string): Promise<{
        ok: boolean;
        circleId: string;
    }>;
    decline(rawToken: string, userId: string): Promise<{
        ok: boolean;
    }>;
    private findUsableInvite;
    createInvite(circleId: string, adminId: string, inviteeUserId: string): Promise<{
        id: string;
        token: string;
        expiresAt: string;
        inviteUrl: string;
    }>;
    listInvites(circleId: string, adminId: string): Promise<{
        id: string;
        inviteeUserId: string | null;
        inviteeUsername: string | null;
        expiresAt: string;
        createdAt: string;
    }[]>;
    revokeInvite(circleId: string, adminId: string, inviteId: string): Promise<{
        ok: boolean;
    }>;
    revokeInviteById(inviteId: string, actorId: string): Promise<{
        ok: boolean;
    }>;
    createInviteForUser(circleId: string, inviterUserId: string, inviteeUserId: string, rawToken: string): Promise<{
        id: string;
        revokedAt: Date | null;
        createdAt: Date;
        expiresAt: Date;
        updatedAt: Date;
        tokenHash: import("@prisma/client/runtime/library").Bytes;
        circleId: string;
        inviteeUserId: string | null;
        inviterUserId: string | null;
        inviteeEmail: string | null;
        acceptedAt: Date | null;
        declinedAt: Date | null;
        acceptedByUserId: string | null;
    }>;
}
