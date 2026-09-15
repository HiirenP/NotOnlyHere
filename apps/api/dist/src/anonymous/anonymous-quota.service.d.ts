import { PrismaService } from '../prisma/prisma.service';
export declare class AnonymousQuotaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getQuota(userId: string): Promise<{
        limit: number;
        used: number;
        remaining: number;
        resetsAt: string;
    }>;
    consumeQuota(userId: string): Promise<void>;
}
