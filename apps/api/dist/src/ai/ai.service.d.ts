import type { AiConsentType } from '@prisma/client';
import { AiProviderService } from './ai-provider.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private readonly prisma;
    private readonly provider;
    constructor(prisma: PrismaService, provider: AiProviderService);
    getConsentStatus(userId: string): Promise<{
        documentVersion: string;
        consents: Record<string, boolean>;
    }>;
    updateConsent(userId: string, input: {
        consentType: AiConsentType;
        granted: boolean;
        source?: string;
    }): Promise<{
        consentType: import(".prisma/client").$Enums.AiConsentType;
        granted: boolean;
        recordedAt: string;
    }>;
    getPreferences(userId: string): Promise<{
        preferences: Record<string, string>;
    }>;
    updatePreferences(userId: string, preferences: Record<string, string>): Promise<{
        preferences: Record<string, string>;
    }>;
    listConversations(userId: string): Promise<{
        items: {
            id: string;
            lastMessageAt: string | null;
            createdAt: string;
        }[];
    }>;
    createConversation(userId: string): Promise<{
        id: string;
        createdAt: string;
    }>;
    getConversation(conversationId: string, userId: string): Promise<{
        id: string;
        lastMessageAt: string | null;
        createdAt: string;
    }>;
    deleteConversation(conversationId: string, userId: string): Promise<{
        ok: boolean;
    }>;
    listMessages(conversationId: string, userId: string, options: {
        cursor?: string;
        limit?: number;
    }): Promise<{
        items: {
            id: string;
            role: "USER" | "ASSISTANT";
            content: string;
            createdAt: string;
        }[];
        nextCursor: string | null;
    }>;
    sendMessage(conversationId: string, userId: string, content: string): Promise<{
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
    getQuota(userId: string): Promise<{
        limit: number;
        used: number;
        remaining: number;
        resetsAt: string;
    }>;
    getStarters(): {
        items: string[];
    };
    getCircleRecommendations(userId: string): Promise<{
        items: {
            id: string;
            slug: string;
            name: string;
            description: string;
            memberCount: number;
            reason: string;
        }[];
    }>;
    private consumeQuota;
    private utcDate;
    private hasConsent;
    private latestConsentRow;
    private requireConsent;
    private requireConsentRow;
    private assertConversationOwner;
    private serializeMessage;
}
