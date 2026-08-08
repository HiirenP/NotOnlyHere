import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class BroadcastsService {
    private readonly prisma;
    private readonly permissions;
    private readonly notifications;
    constructor(prisma: PrismaService, permissions: AdminPermissionsService, notifications: NotificationsService);
    create(adminId: string, input: {
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
    get(broadcastId: string, adminId: string): Promise<{
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
    private getSummary;
    private serializeSummary;
}
