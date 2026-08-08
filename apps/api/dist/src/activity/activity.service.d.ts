import { PrismaService } from '../prisma/prisma.service';
export declare class ActivityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    recordProfileUpdated(userId: string): Promise<void>;
    recordConnectionAccepted(userId: string, otherDisplayName: string): Promise<void>;
    recordPostCreated(userId: string, postId: string): Promise<void>;
    listForUser(userId: string, viewerId: string, limit?: number): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.ActivityType;
        summary: string;
        occurredAt: string;
    }[]>;
}
