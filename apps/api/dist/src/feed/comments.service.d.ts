import type { ReactionKind } from '@prisma/client';
import { AnonymousQuotaService } from '../anonymous/anonymous-quota.service';
import { AnonymousService } from '../anonymous/anonymous.service';
import { FeedPolicyService } from './feed-policy.service';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';
export declare class CommentsService {
    private readonly prisma;
    private readonly policy;
    private readonly anonymous;
    private readonly anonymousQuota;
    private readonly outbox;
    constructor(prisma: PrismaService, policy: FeedPolicyService, anonymous: AnonymousService, anonymousQuota: AnonymousQuotaService, outbox: OutboxService);
    list(postId: string, viewerId: string): Promise<{
        id: string;
        postId: string;
        parentCommentId: string | null;
        body: string;
        status: string;
        version: number;
        isEdited: boolean;
        createdAt: string;
        isAnonymous: boolean;
        author: {
            isAnonymous: true;
            displayLabel: string;
            id?: undefined;
            username?: undefined;
            displayName?: undefined;
        } | {
            isAnonymous: false;
            id: string;
            username: string;
            displayName: string;
            displayLabel?: undefined;
        };
        reactions: {
            counts: {
                SUPPORT: number;
                HUG: number;
                INSIGHTFUL: number;
            };
            viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
        };
        viewer: {
            isAuthor: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canConnect: boolean;
            canMessage: boolean;
        };
    }[]>;
    create(postId: string, authorId: string, input: {
        body: string;
        parentCommentId?: string;
        isAnonymous?: boolean;
    }): Promise<{
        id: string;
        postId: string;
        parentCommentId: string | null;
        body: string;
        status: string;
        version: number;
        isEdited: boolean;
        createdAt: string;
        isAnonymous: boolean;
        author: {
            isAnonymous: true;
            displayLabel: string;
            id?: undefined;
            username?: undefined;
            displayName?: undefined;
        } | {
            isAnonymous: false;
            id: string;
            username: string;
            displayName: string;
            displayLabel?: undefined;
        };
        reactions: {
            counts: {
                SUPPORT: number;
                HUG: number;
                INSIGHTFUL: number;
            };
            viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
        };
        viewer: {
            isAuthor: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canConnect: boolean;
            canMessage: boolean;
        };
    }>;
    update(commentId: string, authorId: string, input: {
        body: string;
        version: number;
    }): Promise<{
        id: string;
        postId: string;
        parentCommentId: string | null;
        body: string;
        status: string;
        version: number;
        isEdited: boolean;
        createdAt: string;
        isAnonymous: boolean;
        author: {
            isAnonymous: true;
            displayLabel: string;
            id?: undefined;
            username?: undefined;
            displayName?: undefined;
        } | {
            isAnonymous: false;
            id: string;
            username: string;
            displayName: string;
            displayLabel?: undefined;
        };
        reactions: {
            counts: {
                SUPPORT: number;
                HUG: number;
                INSIGHTFUL: number;
            };
            viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
        };
        viewer: {
            isAuthor: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canConnect: boolean;
            canMessage: boolean;
        };
    }>;
    delete(commentId: string, authorId: string): Promise<{
        ok: boolean;
    }>;
    private assertCanViewPost;
    private serialize;
}
export declare class ReactionsService {
    private readonly prisma;
    private readonly policy;
    constructor(prisma: PrismaService, policy: FeedPolicyService);
    assertKind(kind: string): ReactionKind;
    setPostReaction(postId: string, userId: string, kind: ReactionKind): Promise<{
        counts: {
            SUPPORT: number;
            HUG: number;
            INSIGHTFUL: number;
        };
        viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
    }>;
    removePostReaction(postId: string, userId: string): Promise<{
        counts: {
            SUPPORT: number;
            HUG: number;
            INSIGHTFUL: number;
        };
        viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
    }>;
    getPostReactionSummary(postId: string, viewerId: string): Promise<{
        counts: {
            SUPPORT: number;
            HUG: number;
            INSIGHTFUL: number;
        };
        viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
    }>;
}
