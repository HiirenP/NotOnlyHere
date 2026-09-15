import type { AiConsentType } from '@prisma/client';
import type { Request } from 'express';
import { AiService } from './ai.service';
export declare class AiController {
    private readonly ai;
    constructor(ai: AiService);
    getConsent(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        documentVersion: string;
        consents: Record<string, boolean>;
    }>;
    updateConsent(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        consentType: AiConsentType;
        granted: boolean;
        source?: string;
    }): Promise<{
        consentType: import(".prisma/client").$Enums.AiConsentType;
        granted: boolean;
        recordedAt: string;
    }>;
    getPreferences(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        preferences: Record<string, string>;
    }>;
    updatePreferences(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        preferences: Record<string, string>;
    }): Promise<{
        preferences: Record<string, string>;
    }>;
    listConversations(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        items: {
            id: string;
            lastMessageAt: string | null;
            createdAt: string;
        }[];
    }>;
    createConversation(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        createdAt: string;
    }>;
    getConversation(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        lastMessageAt: string | null;
        createdAt: string;
    }>;
    deleteConversation(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
    listMessages(req: Request & {
        user: {
            id: string;
        };
    }, id: string, cursor?: string, limit?: string): Promise<{
        items: {
            id: string;
            role: "USER" | "ASSISTANT";
            content: string;
            createdAt: string;
        }[];
        nextCursor: string | null;
    }>;
    sendMessage(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        content: string;
    }): Promise<{
        userMessage: {
            id: string;
            role: "USER" | "ASSISTANT";
            content: string;
            createdAt: string;
        };
        assistantMessage: {
            id: string;
            role: "USER" | "ASSISTANT";
            content: string;
            createdAt: string;
        };
    }>;
    quota(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        limit: number;
        used: number;
        remaining: number;
        resetsAt: string;
    }>;
    starters(): {
        items: string[];
    };
    recommendations(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        items: {
            id: string;
            slug: string;
            name: string;
            description: string;
            memberCount: number;
            reason: string;
        }[];
    }>;
}
