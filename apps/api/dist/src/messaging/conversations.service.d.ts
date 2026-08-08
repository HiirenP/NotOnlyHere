import { MessagingPolicyService } from './messaging-policy.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class ConversationsService {
    private readonly prisma;
    private readonly policy;
    constructor(prisma: PrismaService, policy: MessagingPolicyService);
    list(userId: string): Promise<{
        id: string;
        otherUser: {
            id: string;
            username: string;
            displayName: string;
        } | null;
        lastMessage: {
            id: string;
            body: string | null;
            createdAt: string;
        } | null;
        updatedAt: string;
    }[]>;
    createOrGet(userId: string, otherUserId: string): Promise<{
        id: string;
        created: boolean;
    }>;
    get(conversationId: string, userId: string): Promise<{
        id: string;
        otherUser: {
            id: string;
            username: string;
            displayName: string;
        } | null;
        lastMessageAt: string | null;
    }>;
}
