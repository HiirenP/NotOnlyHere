import type { CircleJoinPolicy, CircleVisibility } from '@prisma/client';
import type { Request } from 'express';
import { CircleAdminService } from './circle-admin.service';
import { CircleInvitesService } from './circle-invites.service';
import { CircleMembershipService } from './circle-membership.service';
import { CirclesService } from './circles.service';
import { FeedService } from '../feed/feed.service';
export declare class CirclesController {
    private readonly circles;
    private readonly membership;
    private readonly admin;
    private readonly invites;
    private readonly feed;
    constructor(circles: CirclesService, membership: CircleMembershipService, admin: CircleAdminService, invites: CircleInvitesService, feed: FeedService);
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        name: string;
        description: string;
        guidelines: string;
        visibility: CircleVisibility;
        joinPolicy: CircleJoinPolicy;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CircleStatus;
        version: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        avatarMediaId: string | null;
        visibility: import(".prisma/client").$Enums.CircleVisibility;
        description: string;
        slug: string;
        guidelines: string;
        joinPolicy: import(".prisma/client").$Enums.CircleJoinPolicy;
        createdByUserId: string | null;
        adminFeatured: boolean;
        memberCount: number;
    }>;
    list(req: Request & {
        user: {
            id: string;
        };
    }, q?: string, cursor?: string, limit?: string): Promise<{
        query: string;
        items: {
            id: string;
            slug: string;
            name: string;
            description: string;
            visibility: string;
            joinPolicy: string;
            memberCount: number;
            createdAt: string;
            viewer: {
                membershipStatus: import(".prisma/client").$Enums.MembershipStatus | null;
                role: string | null;
                isMember: boolean;
                canJoin: boolean;
            };
        }[];
        nextCursor: string | null;
    }>;
    get(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string;
        guidelines: string | null;
        visibility: string;
        joinPolicy: string;
        memberCount: number;
        version: number;
        createdAt: string;
        viewer: {
            membershipStatus: import(".prisma/client").$Enums.MembershipStatus | null;
            role: string | null;
            isMember: boolean;
            isAdmin: boolean;
            canJoin: boolean;
            canLeave: boolean;
            canViewMembers: boolean;
            canManage: boolean;
        };
    }>;
    update(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        name?: string;
        description?: string;
        guidelines?: string;
        visibility?: CircleVisibility;
        joinPolicy?: CircleJoinPolicy;
        version: number;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CircleStatus;
        version: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        avatarMediaId: string | null;
        visibility: import(".prisma/client").$Enums.CircleVisibility;
        description: string;
        slug: string;
        guidelines: string;
        joinPolicy: import(".prisma/client").$Enums.CircleJoinPolicy;
        createdByUserId: string | null;
        adminFeatured: boolean;
        memberCount: number;
    }>;
    archive(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
    circleFeed(req: Request & {
        user: {
            id: string;
        };
    }, id: string, cursor?: string, limit?: string): Promise<{
        circleId: string;
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
    listMembers(req: Request & {
        user: {
            id: string;
        };
    }, id: string, cursor?: string, limit?: string): Promise<{
        items: {
            userId: string;
            username: string;
            displayName: string;
            role: import(".prisma/client").$Enums.CircleRole;
            joinedAt: string | null;
        }[];
        nextCursor: string | null;
    }>;
    listRequests(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        userId: string;
        username: string;
        displayName: string;
        requestedAt: string | null;
    }[]>;
    approve(req: Request & {
        user: {
            id: string;
        };
    }, id: string, userId: string): Promise<{
        ok: boolean;
        status: string;
    }>;
    declineRequest(req: Request & {
        user: {
            id: string;
        };
    }, id: string, userId: string): Promise<{
        ok: boolean;
        status: string;
    }>;
    removeMember(req: Request & {
        user: {
            id: string;
        };
    }, id: string, userId: string): Promise<{
        ok: boolean;
    }>;
    join(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        status: "ACTIVE";
        message: string;
    } | {
        status: "PENDING";
        message: string;
    }>;
    leave(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
        leftAt: string;
    }>;
    createInvite(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        inviteeUserId: string;
    }): Promise<{
        id: string;
        token: string;
        expiresAt: string;
        inviteUrl: string;
    }>;
    listInvites(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        inviteeUserId: string | null;
        inviteeUsername: string | null;
        expiresAt: string;
        createdAt: string;
    }[]>;
    revokeInvite(req: Request & {
        user: {
            id: string;
        };
    }, id: string, inviteId: string): Promise<{
        ok: boolean;
    }>;
    mute(req: Request & {
        user: {
            id: string;
        };
    }, id: string, userId: string, body: {
        reason?: string;
    }): Promise<{
        ok: boolean;
    }>;
    unmute(req: Request & {
        user: {
            id: string;
        };
    }, id: string, userId: string): Promise<{
        ok: boolean;
    }>;
    removePost(req: Request & {
        user: {
            id: string;
        };
    }, id: string, postId: string, body: {
        reason: string;
    }): Promise<{
        ok: boolean;
        deletedAt: string;
    }>;
}
export declare class CircleInvitesController {
    private readonly invites;
    constructor(invites: CircleInvitesService);
    accept(req: Request & {
        user: {
            id: string;
        };
    }, token: string): Promise<{
        ok: boolean;
        circleId: string;
    }>;
    decline(req: Request & {
        user: {
            id: string;
        };
    }, token: string): Promise<{
        ok: boolean;
    }>;
    revoke(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
}
