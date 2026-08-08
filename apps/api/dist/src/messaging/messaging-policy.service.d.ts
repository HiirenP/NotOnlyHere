import { PrismaService } from '../prisma/prisma.service';
export declare class MessagingPolicyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canMessage(userId: string, otherUserId: string): Promise<boolean>;
    assertParticipant(conversationId: string, userId: string): Promise<{
        userId: string;
        joinedAt: Date;
        leftAt: Date | null;
        conversationId: string;
    }>;
    assertCanMessage(userId: string, otherUserId: string): Promise<void>;
}
