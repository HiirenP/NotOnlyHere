import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
export declare class AdminAnalyticsController {
    private readonly analytics;
    constructor(analytics: AnalyticsService);
    users(req: Request & {
        user: {
            id: string;
        };
    }, from?: string, to?: string): Promise<{
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
    engagement(req: Request & {
        user: {
            id: string;
        };
    }, from?: string, to?: string): Promise<{
        range: {
            from: string;
            to: string;
        };
        totals: {
            eventKey: string;
            count: number;
        }[];
    }>;
    funnel(req: Request & {
        user: {
            id: string;
        };
    }, from?: string, to?: string): Promise<{
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
    createExport(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        reportType: string;
        filters?: {
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
    getExport(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        reportType: string;
        status: string;
        filters: unknown;
        objectKey: string | null;
        expiresAt: string | null;
        completedAt: string | null;
        createdAt: string;
    }>;
}
