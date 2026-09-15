import type { Request } from 'express';
import { SessionService } from '../auth/session.service';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analytics;
    private readonly sessions;
    constructor(analytics: AnalyticsService, sessions: SessionService);
    ingest(req: Request, body: {
        dedupId: string;
        eventKey: string;
        eventVersion: number;
        occurredAt: string;
        properties?: Record<string, unknown>;
        source: string;
        anonymousId?: string;
        sessionId?: string;
    }): Promise<{
        ok: boolean;
        duplicate: boolean;
    }>;
}
