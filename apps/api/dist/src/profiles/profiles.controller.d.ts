import type { Request, Response } from 'express';
import { ActivityService } from '../activity/activity.service';
import { MediaService } from '../media/media.service';
import { ProfilesService } from './profiles.service';
import { BlockService } from '../social/block.service';
import { ConnectionService } from '../social/connection.service';
import { PostsService } from '../feed/posts.service';
export declare class ProfilesController {
    private readonly profiles;
    private readonly activity;
    private readonly posts;
    constructor(profiles: ProfilesService, activity: ActivityService, posts: PostsService);
    getMe(req: Request & {
        user: {
            id: string;
        };
    }): Promise<import("@notonlyhere/contracts").ProfileResponse>;
    updateMe(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        displayName?: string;
        username?: string;
        bio?: string | null;
        avatarMediaId?: string | null;
        coverMediaId?: string | null;
        version: number;
    }): Promise<import("@notonlyhere/contracts").ProfileResponse>;
    listPosts(req: Request & {
        user: {
            id: string;
        };
    }, username: string): Promise<{
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
    getByUsername(req: Request & {
        user: {
            id: string;
        };
    }, username: string): Promise<import("@notonlyhere/contracts").ProfileResponse>;
    getActivity(req: Request & {
        user: {
            id: string;
        };
    }, username: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.ActivityType;
        summary: string;
        occurredAt: string;
    }[]>;
}
export declare class ConnectionsController {
    private readonly connections;
    constructor(connections: ConnectionService);
    list(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        status: import("@notonlyhere/contracts").ConnectionStatus;
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        addressee: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        createdAt: string;
        respondedAt: string | null;
        direction: "connected" | "outgoing" | "incoming";
    }[]>;
    createRequest(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        username: string;
    }): Promise<{
        id: string;
        status: import("@notonlyhere/contracts").ConnectionStatus;
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        addressee: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        createdAt: string;
        respondedAt: string | null;
        direction: "connected" | "outgoing" | "incoming";
    }>;
    accept(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        status: import("@notonlyhere/contracts").ConnectionStatus;
        requester: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        addressee: {
            id: string;
            username: string;
            displayName: string;
            avatar: null;
        };
        createdAt: string;
        respondedAt: string | null;
        direction: "connected" | "outgoing" | "incoming";
    }>;
    remove(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
}
export declare class BlocksController {
    private readonly blocks;
    constructor(blocks: BlockService);
    list(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        userId: string;
        username: string;
        displayName: string;
        blockedAt: string;
    }[]>;
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        userId?: string;
        username?: string;
    }): Promise<{
        ok: boolean;
    }>;
    remove(req: Request & {
        user: {
            id: string;
        };
    }, userId: string): Promise<{
        ok: boolean;
    }>;
}
export declare class MediaController {
    private readonly media;
    constructor(media: MediaService);
    createUpload(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        purpose: 'AVATAR' | 'PROFILE_COVER';
        declaredMime: string;
        byteSize: number;
    }): Promise<{
        id: string;
        uploadToken: string;
        maxBytes: number;
        allowedMimeTypes: string[];
    }>;
    completeUpload(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        uploadToken: string;
        width?: number;
        height?: number;
        detectedMime?: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.MediaStatus;
    }>;
    serveFile(req: Request & {
        user: {
            id: string;
        };
    }, id: string, res: Response): Promise<void>;
}
