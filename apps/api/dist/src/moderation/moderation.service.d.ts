import type { AiFlagStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class ModerationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    evaluatePost(postId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AiFlagStatus;
        updatedAt: Date;
        postId: string | null;
        commentId: string | null;
        category: string;
        confidence: Prisma.Decimal | null;
        modelVersion: string;
        rationaleCode: string | null;
        reviewedByUserId: string | null;
        reviewedAt: Date | null;
        resolutionNote: string | null;
    } | null>;
    evaluateComment(commentId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AiFlagStatus;
        updatedAt: Date;
        postId: string | null;
        commentId: string | null;
        category: string;
        confidence: Prisma.Decimal | null;
        modelVersion: string;
        rationaleCode: string | null;
        reviewedByUserId: string | null;
        reviewedAt: Date | null;
        resolutionNote: string | null;
    } | null>;
    listFlags(options: {
        status?: AiFlagStatus;
        cursor?: string;
        limit?: number;
    }): Promise<{
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
    getFlag(flagId: string): Promise<{
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
    updateFlag(flagId: string, reviewerId: string, input: {
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
    private createFlagIfNeeded;
    private serialize;
}
