import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(input: {
        actorUserId: string;
        action: string;
        targetType: string;
        targetId: string;
        result: 'SUCCESS' | 'DENIED' | 'FAILED';
        requestId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<void>;
}
