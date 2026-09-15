import type { PostVisibility } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
type PostLike = {
    id: string;
    authorUserId: string | null;
    isAnonymous: boolean;
    visibility: PostVisibility;
    status: string;
    circleId?: string | null;
    anonymousAuthor?: {
        userId: string | null;
    } | null;
};
export declare class FeedPolicyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getViewerContext(viewerId: string): Promise<{
        blockedUserIds: Set<string>;
        connectedUserIds: Set<string>;
    }>;
    resolveAuthorUserId(post: PostLike): string | null;
    canViewPost(viewerId: string, post: PostLike, context: {
        blockedUserIds: Set<string>;
        connectedUserIds: Set<string>;
    }): boolean;
    isPostAuthor(post: PostLike & {
        anonymousAuthor?: {
            userId: string | null;
        } | null;
    }, viewerId: string): boolean;
    isCommentAuthor(comment: {
        authorUserId: string | null;
        isAnonymous: boolean;
        anonymousAuthor?: {
            userId: string | null;
        } | null;
    }, viewerId: string): boolean;
    getActiveCircleMembership(circleId: string, userId: string): Promise<{
        userId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MembershipStatus;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.CircleRole;
        circleId: string;
        requestedAt: Date | null;
        joinedAt: Date | null;
        decidedAt: Date | null;
        leftAt: Date | null;
        invitedByUserId: string | null;
        decidedByUserId: string | null;
    } | null>;
    assertActiveCircleMember(circleId: string, userId: string): Promise<{
        userId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MembershipStatus;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.CircleRole;
        circleId: string;
        requestedAt: Date | null;
        joinedAt: Date | null;
        decidedAt: Date | null;
        leftAt: Date | null;
        invitedByUserId: string | null;
        decidedByUserId: string | null;
    } | null>;
    isCircleMuted(circleId: string, userId: string): Promise<boolean>;
    canViewCirclePost(viewerId: string, post: PostLike, context: {
        blockedUserIds: Set<string>;
        connectedUserIds: Set<string>;
    }, isCircleMember: boolean): boolean;
}
export {};
