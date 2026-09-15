import type { BlogStatus, Prisma } from '@prisma/client';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private readonly prisma;
    private readonly permissions;
    constructor(prisma: PrismaService, permissions: AdminPermissionsService);
    publishDueScheduled(): Promise<{
        published: number;
    }>;
    listPublished(options: {
        q?: string;
        category?: string;
        tag?: string;
        cursor?: string;
        limit?: number;
    }): Promise<{
        query: string;
        items: {
            id: string;
            slug: string;
            title: string;
            excerpt: string;
            publishedAt: string | null;
            categories: {
                slug: string;
                name: string;
            }[];
            tags: {
                slug: string;
                name: string;
            }[];
        }[];
        nextCursor: string | null;
    }>;
    getPublishedBySlug(slug: string): Promise<{
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    getRelated(slug: string): Promise<{
        items: {
            id: string;
            slug: string;
            title: string;
            excerpt: string;
            publishedAt: string | null;
            categories: {
                slug: string;
                name: string;
            }[];
            tags: {
                slug: string;
                name: string;
            }[];
        }[];
    }>;
    buildRssFeed(): Promise<string>;
    private assertCanWrite;
    private assertCanPublish;
    listAdmin(userId: string, options: {
        cursor?: string;
        limit?: number;
        status?: BlogStatus;
    }): Promise<{
        items: {
            status: import(".prisma/client").$Enums.BlogStatus;
            scheduledAt: string | null;
            version: number;
            createdAt: string;
            updatedAt: string;
            bodyPlain: string;
            bodyRich: Prisma.JsonValue;
            id: string;
            slug: string;
            title: string;
            excerpt: string;
            publishedAt: string | null;
            categories: {
                slug: string;
                name: string;
            }[];
            tags: {
                slug: string;
                name: string;
            }[];
        }[];
        nextCursor: string | null;
    }>;
    createPost(userId: string, input: {
        title: string;
        excerpt: string;
        bodyPlain: string;
        bodyRich?: object;
        categorySlugs?: string[];
        tagSlugs?: string[];
    }): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    updatePost(userId: string, postId: string, input: {
        title?: string;
        excerpt?: string;
        bodyPlain?: string;
        bodyRich?: object;
        version: number;
        categorySlugs?: string[];
        tagSlugs?: string[];
    }): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    getAdminPost(userId: string, postId: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    publishPost(userId: string, postId: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    schedulePost(userId: string, postId: string, scheduledAtIso: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    unpublishPost(userId: string, postId: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    archivePost(userId: string, postId: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: Prisma.JsonValue;
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        publishedAt: string | null;
        categories: {
            slug: string;
            name: string;
        }[];
        tags: {
            slug: string;
            name: string;
        }[];
    }>;
    private resolveCategoryLinks;
    private resolveTagLinks;
    private serializeSummary;
    private serializeDetail;
    private serializeAdmin;
}
