import type { Request } from 'express';
import { AnonymousQuotaService } from './anonymous-quota.service';
export declare class AnonymousController {
    private readonly quota;
    constructor(quota: AnonymousQuotaService);
    getQuota(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        limit: number;
        used: number;
        remaining: number;
        resetsAt: string;
    }>;
}
