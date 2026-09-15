import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly permissions;
    constructor(prisma: PrismaService, permissions: AdminPermissionsService);
    ingestEvent(input: {
        dedupId: string;
        eventKey: string;
        eventVersion: number;
        occurredAt: string;
        properties?: Record<string, unknown>;
        source: string;
        userId?: string | null;
        anonymousId?: string | null;
        sessionId?: string | null;
        requestId?: string | null;
    }): Promise<{
        ok: boolean;
        duplicate: boolean;
    }>;
    computeDailyAggregates(metricDate?: Date): Promise<{
        dau: number;
        mau: number;
    }>;
    private parseRange;
    private assertCanRead;
    private assertCanExport;
    getUsersOverview(userId: string, filters: {
        from?: string;
        to?: string;
    }): Promise<{
        range: {
            from: string;
            to: string;
        };
        registrations: number;
        latestDaily: {
            metricDate: string;
            metricKey: string;
            value: number;
        } | null;
    }>;
    getEngagement(userId: string, filters: {
        from?: string;
        to?: string;
    }): Promise<{
        range: {
            from: string;
            to: string;
        };
        totals: {
            eventKey: string;
            count: number;
        }[];
    }>;
    getFunnel(userId: string, filters: {
        from?: string;
        to?: string;
    }): Promise<{
        name: string;
        range: {
            from: string;
            to: string;
        };
        steps: {
            key: "page.view" | "auth.register_completed" | "feed.first_post_created" | "circle.first_joined";
            label: "Visit" | "Register" | "First post" | "Join circle";
            count: number;
        }[];
    }>;
    createExport(userId: string, input: {
        reportType: string;
        filters: {
            from?: string;
            to?: string;
        };
        idempotencyKey: string;
    }): Promise<{
        id: string;
        reportType: string;
        status: string;
        filters: unknown;
        objectKey: string | null;
        expiresAt: string | null;
        completedAt: string | null;
        createdAt: string;
    }>;
    getExport(userId: string, exportId: string): Promise<{
        id: string;
        reportType: string;
        status: string;
        filters: unknown;
        objectKey: string | null;
        expiresAt: string | null;
        completedAt: string | null;
        createdAt: string;
    }>;
    private serializeExport;
}
