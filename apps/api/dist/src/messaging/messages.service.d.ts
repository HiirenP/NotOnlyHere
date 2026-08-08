import { MessagingPolicyService } from './messaging-policy.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private readonly prisma;
    private readonly policy;
    private readonly notifications;
    constructor(prisma: PrismaService, policy: MessagingPolicyService, notifications: NotificationsService);
    list(conversationId: string, userId: string, options: {
        cursor?: string;
        limit?: number;
    }): Promise<{
        items: {
            id: string;
            conversationId: string;
            senderUserId: string | null;
            clientMessageId: string;
            body: string | null;
            createdAt: string;
            reactions: {
                counts: Record<string, number>;
                viewerReactions: string[];
            };
            viewer: {
                isSender: boolean;
            };
        }[];
        nextCursor: string | null;
    }>;
    send(conversationId: string, senderId: string, input: {
        body: string;
        clientMessageId: string;
    }): Promise<{
        id: string;
        conversationId: string;
        senderUserId: string | null;
        clientMessageId: string;
        body: string | null;
        createdAt: string;
        reactions: {
            counts: Record<string, number>;
            viewerReactions: string[];
        };
        viewer: {
            isSender: boolean;
        };
    }>;
    assertEmoji(emoji: string): string;
    setReaction(messageId: string, userId: string, emoji: string): Promise<{
        counts: Record<string, number>;
        viewerReactions: string[];
    }>;
    removeReaction(messageId: string, userId: string, emoji: string): Promise<{
        counts: Record<string, number>;
        viewerReactions: string[];
    }>;
    private getReactionSummary;
    private serialize;
}
