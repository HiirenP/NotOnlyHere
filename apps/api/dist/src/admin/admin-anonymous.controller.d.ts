import type { Request } from 'express';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdminAnonymousController {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    reveal(req: Request & {
        user: {
            id: string;
        };
        requestId?: string;
    }, type: string, id: string, body: {
        reason?: string;
    }): Promise<{
        type: string;
        targetId: string;
        userId: string;
        email: string;
        username: string | null;
        displayName: string | null;
    }>;
}
