import type { Request } from 'express';
import { BroadcastsService } from './broadcasts.service';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    list(req: Request & {
        user: {
            id: string;
        };
    }, cursor?: string, limit?: string): Promise<{
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
    markRead(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
    markAllRead(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        ok: boolean;
    }>;
}
export declare class BroadcastsController {
    private readonly broadcasts;
    constructor(broadcasts: BroadcastsService);
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        title: string;
        body: string;
        audienceType: 'ALL_ACTIVE';
        idempotencyKey: string;
    }): Promise<{
        id: string;
        title: string;
        body: string;
        status: string;
        recipientCount: number;
        sentCount: number;
        failedCount: number;
        createdAt: string;
        completedAt: string | null;
    }>;
    get(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        title: string;
        body: string;
        status: string;
        recipientCount: number;
        sentCount: number;
        failedCount: number;
        createdAt: string;
        completedAt: string | null;
    }>;
}
