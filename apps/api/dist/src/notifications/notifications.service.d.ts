import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';
export type CreateNotificationInput = {
    recipientUserId: string;
    eventType: string;
    titleKey: string;
    bodyKey: string;
    templateParams?: Record<string, unknown>;
    actorUserId?: string | null;
    postId?: string;
    commentId?: string;
    connectionId?: string;
    circleId?: string;
    circleInviteId?: string;
    conversationId?: string;
    eventId?: string;
    targetUserId?: string;
    sendEmail?: boolean;
};
export declare class NotificationsService {
    private readonly prisma;
    private readonly outbox;
    constructor(prisma: PrismaService, outbox: OutboxService);
    create(input: CreateNotificationInput, tx?: Prisma.TransactionClient): Promise<{
        id: string;
        eventType: string;
        titleKey: string;
        bodyKey: string;
        templateParams: unknown;
        readAt: string | null;
        createdAt: string;
        targets: {
            actorUserId: string | null;
            postId: string | null;
            commentId: string | null;
            connectionId: string | null;
            circleId: string | null;
            conversationId: string | null;
            targetUserId: string | null;
        };
    }>;
    list(userId: string, options: {
        cursor?: string;
        limit?: number;
    }): Promise<{
        unreadCount: number;
        items: {
            id: string;
            eventType: string;
            titleKey: string;
            bodyKey: string;
            templateParams: unknown;
            readAt: string | null;
            createdAt: string;
            targets: {
                actorUserId: string | null;
                postId: string | null;
                commentId: string | null;
                connectionId: string | null;
                circleId: string | null;
                conversationId: string | null;
                targetUserId: string | null;
            };
        }[];
        nextCursor: string | null;
    }>;
    markRead(notificationId: string, userId: string): Promise<{
        ok: boolean;
    }>;
    markAllRead(userId: string): Promise<{
        ok: boolean;
    }>;
    hashEmail(email: string): NonSharedBuffer;
    private serialize;
}
