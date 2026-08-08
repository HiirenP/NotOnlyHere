import type { PostVisibility, ReactionKind } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';
import { AnonymousQuotaService } from '../anonymous/anonymous-quota.service';
import { AnonymousService } from '../anonymous/anonymous.service';
import { MediaService } from '../media/media.service';
import { FeedPolicyService } from './feed-policy.service';
import { LinkPreviewService } from './link-preview.service';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';
export declare class PostsService {
    private readonly prisma;
    private readonly policy;
    private readonly media;
    private readonly activity;
    private readonly linkPreviews;
    private readonly anonymous;
    private readonly anonymousQuota;
    private readonly outbox;
    constructor(prisma: PrismaService, policy: FeedPolicyService, media: MediaService, activity: ActivityService, linkPreviews: LinkPreviewService, anonymous: AnonymousService, anonymousQuota: AnonymousQuotaService, outbox: OutboxService);
    createPost(authorId: string, input: {
        body: string;
        visibility: PostVisibility;
        isAnonymous?: boolean;
        circleId?: string;
        idempotencyKey?: string;
        media?: {
            mediaId: string;
            position: number;
            altText?: string;
        }[];
        linkPreviewUrl?: string;
    }): Promise<{
        id: string;
        body: string;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        status: string;
        version: number;
        isEdited: boolean;
        editedAt: string | null;
        createdAt: string;
        deletedAt: string | null;
        isAnonymous: boolean;
        author: {
            isAnonymous: true;
            displayLabel: string;
            id?: undefined;
            username?: undefined;
            displayName?: undefined;
            avatar?: undefined;
        } | {
            isAnonymous: false;
            id: string;
            username: string;
            displayName: string;
            avatar: {
                id: string;
                url: string;
            } | null;
            displayLabel?: undefined;
        };
        media: {
            id: string;
            position: number;
            altText: string | null;
            url: string | null;
        }[];
        linkPreview: {
            sourceUrl: string;
            canonicalUrl: string;
            title: string | null;
            description: string | null;
            siteName: string | null;
            fetchStatus: string;
        } | null;
        reactions: {
            counts: {
                SUPPORT: number;
                HUG: number;
                INSIGHTFUL: number;
            };
            viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
        };
        commentCount: number;
        viewer: {
            isAuthor: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canConnect: boolean;
            canMessage: boolean;
        };
    }>;
    getPost(postId: string, viewerId: string): Promise<{
        id: string;
        body: string;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        status: string;
        version: number;
        isEdited: boolean;
        editedAt: string | null;
        createdAt: string;
        deletedAt: string | null;
        isAnonymous: boolean;
        author: {
            isAnonymous: true;
            displayLabel: string;
            id?: undefined;
            username?: undefined;
            displayName?: undefined;
            avatar?: undefined;
        } | {
            isAnonymous: false;
            id: string;
            username: string;
            displayName: string;
            avatar: {
                id: string;
                url: string;
            } | null;
            displayLabel?: undefined;
        };
        media: {
            id: string;
            position: number;
            altText: string | null;
            url: string | null;
        }[];
        linkPreview: {
            sourceUrl: string;
            canonicalUrl: string;
            title: string | null;
            description: string | null;
            siteName: string | null;
            fetchStatus: string;
        } | null;
        reactions: {
            counts: {
                SUPPORT: number;
                HUG: number;
                INSIGHTFUL: number;
            };
            viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
        };
        commentCount: number;
        viewer: {
            isAuthor: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canConnect: boolean;
            canMessage: boolean;
        };
    }>;
    listByUsername(username: string, viewerId: string, limit?: number): Promise<{
        items: {
            id: string;
            body: string;
            visibility: import(".prisma/client").$Enums.PostVisibility;
            status: string;
            version: number;
            isEdited: boolean;
            editedAt: string | null;
            createdAt: string;
            deletedAt: string | null;
            isAnonymous: boolean;
            author: {
                isAnonymous: true;
                displayLabel: string;
                id?: undefined;
                username?: undefined;
                displayName?: undefined;
                avatar?: undefined;
            } | {
                isAnonymous: false;
                id: string;
                username: string;
                displayName: string;
                avatar: {
                    id: string;
                    url: string;
                } | null;
                displayLabel?: undefined;
            };
            media: {
                id: string;
                position: number;
                altText: string | null;
                url: string | null;
            }[];
            linkPreview: {
                sourceUrl: string;
                canonicalUrl: string;
                title: string | null;
                description: string | null;
                siteName: string | null;
                fetchStatus: string;
            } | null;
            reactions: {
                counts: {
                    SUPPORT: number;
                    HUG: number;
                    INSIGHTFUL: number;
                };
                viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
            };
            commentCount: number;
            viewer: {
                isAuthor: boolean;
                canEdit: boolean;
                canDelete: boolean;
                canConnect: boolean;
                canMessage: boolean;
            };
        }[];
    }>;
    updatePost(postId: string, authorId: string, input: {
        body: string;
        version: number;
    }): Promise<{
        id: string;
        body: string;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        status: string;
        version: number;
        isEdited: boolean;
        editedAt: string | null;
        createdAt: string;
        deletedAt: string | null;
        isAnonymous: boolean;
        author: {
            isAnonymous: true;
            displayLabel: string;
            id?: undefined;
            username?: undefined;
            displayName?: undefined;
            avatar?: undefined;
        } | {
            isAnonymous: false;
            id: string;
            username: string;
            displayName: string;
            avatar: {
                id: string;
                url: string;
            } | null;
            displayLabel?: undefined;
        };
        media: {
            id: string;
            position: number;
            altText: string | null;
            url: string | null;
        }[];
        linkPreview: {
            sourceUrl: string;
            canonicalUrl: string;
            title: string | null;
            description: string | null;
            siteName: string | null;
            fetchStatus: string;
        } | null;
        reactions: {
            counts: {
                SUPPORT: number;
                HUG: number;
                INSIGHTFUL: number;
            };
            viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
        };
        commentCount: number;
        viewer: {
            isAuthor: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canConnect: boolean;
            canMessage: boolean;
        };
    }>;
    deletePost(postId: string, authorId: string): Promise<{
        ok: boolean;
        deletedAt: string;
    }>;
    serialize(post: {
        id: string;
        authorUserId: string | null;
        isAnonymous: boolean;
        body: string;
        visibility: PostVisibility;
        status: string;
        version: number;
        editedAt: Date | null;
        deletedAt: Date | null;
        createdAt: Date;
        author: {
            profile: {
                username: string;
                displayName: string;
                avatarMediaId: string | null;
            } | null;
        } | null;
        anonymousAuthor?: {
            displayLabel: string;
            userId: string | null;
        } | null;
        media?: {
            position: number;
            altText: string | null;
            mediaId: string;
            media: {
                id: string;
            };
        }[];
        linkPreview?: {
            sourceUrl: string;
            canonicalUrl: string;
            title: string | null;
            description: string | null;
            siteName: string | null;
            fetchStatus: string;
        } | null;
        reactions?: {
            kind: ReactionKind;
            userId: string;
        }[];
    }, viewerId: string, _context: {
        blockedUserIds: Set<string>;
        connectedUserIds: Set<string>;
    }): {
        id: string;
        body: string;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        status: string;
        version: number;
        isEdited: boolean;
        editedAt: string | null;
        createdAt: string;
        deletedAt: string | null;
        isAnonymous: boolean;
        author: {
            isAnonymous: true;
            displayLabel: string;
            id?: undefined;
            username?: undefined;
            displayName?: undefined;
            avatar?: undefined;
        } | {
            isAnonymous: false;
            id: string;
            username: string;
            displayName: string;
            avatar: {
                id: string;
                url: string;
            } | null;
            displayLabel?: undefined;
        };
        media: {
            id: string;
            position: number;
            altText: string | null;
            url: string | null;
        }[];
        linkPreview: {
            sourceUrl: string;
            canonicalUrl: string;
            title: string | null;
            description: string | null;
            siteName: string | null;
            fetchStatus: string;
        } | null;
        reactions: {
            counts: {
                SUPPORT: number;
                HUG: number;
                INSIGHTFUL: number;
            };
            viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
        };
        commentCount: number;
        viewer: {
            isAuthor: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canConnect: boolean;
            canMessage: boolean;
        };
    };
}
