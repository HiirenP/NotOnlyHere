import { FeedPolicyService } from './feed-policy.service';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private readonly prisma;
    private readonly policy;
    private readonly posts;
    constructor(prisma: PrismaService, policy: FeedPolicyService, posts: PostsService);
    searchPosts(viewerId: string, options: {
        q: string;
        cursor?: string;
        limit?: number;
    }): Promise<{
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
