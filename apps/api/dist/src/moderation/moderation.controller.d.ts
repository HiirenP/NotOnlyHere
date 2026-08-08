import type { AiFlagStatus } from '@prisma/client';
import type { Request } from 'express';
import { ModerationService } from './moderation.service';
export declare class ModerationController {
    private readonly moderation;
    constructor(moderation: ModerationService);
    list(status?: AiFlagStatus, cursor?: string, limit?: string): Promise<{
        items: {
            id: string;
            category: string;
            confidence: number | null;
            status: import(".prisma/client").$Enums.AiFlagStatus;
            modelVersion: string;
            rationaleCode: string | null;
            reviewedAt: string | null;
            resolutionNote: string | null;
            createdAt: string;
            target: {
                type: "POST";
                id: string;
                body: string;
                status: import(".prisma/client").$Enums.ContentStatus;
                postId?: undefined;
            } | {
                type: "COMMENT";
                id: string;
                postId: string;
                body: string;
                status: import(".prisma/client").$Enums.ContentStatus;
            } | null;
        }[];
        nextCursor: string | null;
    }>;
    get(id: string): Promise<{
        id: string;
        category: string;
        confidence: number | null;
        status: import(".prisma/client").$Enums.AiFlagStatus;
        modelVersion: string;
        rationaleCode: string | null;
        reviewedAt: string | null;
        resolutionNote: string | null;
        createdAt: string;
        target: {
            type: "POST";
            id: string;
            body: string;
            status: import(".prisma/client").$Enums.ContentStatus;
            postId?: undefined;
        } | {
            type: "COMMENT";
            id: string;
            postId: string;
            body: string;
            status: import(".prisma/client").$Enums.ContentStatus;
        } | null;
    }>;
    update(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        status: AiFlagStatus;
        resolutionNote?: string | null;
    }): Promise<{
        id: string;
        category: string;
        confidence: number | null;
        status: import(".prisma/client").$Enums.AiFlagStatus;
        modelVersion: string;
        rationaleCode: string | null;
        reviewedAt: string | null;
        resolutionNote: string | null;
        createdAt: string;
        target: {
            type: "POST";
            id: string;
            body: string;
            status: import(".prisma/client").$Enums.ContentStatus;
            postId?: undefined;
        } | {
            type: "COMMENT";
            id: string;
            postId: string;
            body: string;
            status: import(".prisma/client").$Enums.ContentStatus;
        } | null;
    }>;
}
