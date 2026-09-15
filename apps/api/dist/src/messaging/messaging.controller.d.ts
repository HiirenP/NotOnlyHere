import type { Request } from 'express';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
export declare class ConversationsController {
    private readonly conversations;
    private readonly messages;
    constructor(conversations: ConversationsService, messages: MessagesService);
    list(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
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
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        userId: string;
    }): Promise<{
        id: string;
        created: boolean;
    }>;
    get(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        otherUser: {
            id: string;
            username: string;
            displayName: string;
        } | null;
        lastMessageAt: string | null;
    }>;
    listMessages(req: Request & {
        user: {
            id: string;
        };
    }, id: string, cursor?: string, limit?: string): Promise<{
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
    send(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
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
}
export declare class MessagesController {
    private readonly messages;
    constructor(messages: MessagesService);
    react(req: Request & {
        user: {
            id: string;
        };
    }, id: string, emoji: string): Promise<{
        counts: Record<string, number>;
        viewerReactions: string[];
    }>;
    unreact(req: Request & {
        user: {
            id: string;
        };
    }, id: string, emoji: string): Promise<{
        counts: Record<string, number>;
        viewerReactions: string[];
    }>;
}
