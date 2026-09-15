import type { FeedMode, PostVisibility, ReactionKind } from '@notonlyhere/contracts';
import type { Request } from 'express';
import { CommentsService, ReactionsService } from './comments.service';
import { FeedService } from './feed.service';
import { LinkPreviewService } from './link-preview.service';
import { PostsService } from './posts.service';
import { SearchService } from './search.service';
export declare class FeedController {
    private readonly feed;
    private readonly search;
    constructor(feed: FeedService, search: SearchService);
    list(req: Request & {
        user: {
            id: string;
        };
    }, mode?: FeedMode, cursor?: string, limit?: string): Promise<{
        mode: FeedMode;
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
        nextCursor: string | null;
    }>;
    searchPosts(req: Request & {
        user: {
            id: string;
        };
    }, q: string, cursor?: string, limit?: string): Promise<{
        query: string;
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
        nextCursor: string | null;
    }>;
}
export declare class PostsController {
    private readonly posts;
    private readonly comments;
    private readonly reactions;
    constructor(posts: PostsService, comments: CommentsService, reactions: ReactionsService);
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
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
    get(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
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
    update(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
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
    remove(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
        deletedAt: string;
    }>;
    listComments(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
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
    createComment(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
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
    setReaction(req: Request & {
        user: {
            id: string;
        };
    }, id: string, kind: ReactionKind): Promise<{
        counts: {
            SUPPORT: number;
            HUG: number;
            INSIGHTFUL: number;
        };
        viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
    }>;
    removeReaction(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        counts: {
            SUPPORT: number;
            HUG: number;
            INSIGHTFUL: number;
        };
        viewerReaction: import(".prisma/client").$Enums.ReactionKind | null;
    }>;
}
export declare class CommentsController {
    private readonly comments;
    constructor(comments: CommentsService);
    update(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
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
    remove(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
}
export declare class LinkPreviewsController {
    private readonly linkPreviews;
    constructor(linkPreviews: LinkPreviewService);
    preview(body: {
        url: string;
    }): Promise<{
        sourceUrl: string;
        canonicalUrl: string;
        title: string;
        description: string;
        siteName: string;
        fetchStatus: string;
        fetchedAt: string;
    }>;
}
