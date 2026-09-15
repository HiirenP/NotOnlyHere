import type { BlogStatus } from '@prisma/client';
import type { Request } from 'express';
import { BlogService } from './blog.service';
export declare class AdminBlogController {
    private readonly blog;
    constructor(blog: BlogService);
    list(req: Request & {
        user: {
            id: string;
        };
    }, cursor?: string, limit?: string, status?: BlogStatus): Promise<{
        items: {
            status: import(".prisma/client").$Enums.BlogStatus;
            scheduledAt: string | null;
            version: number;
            createdAt: string;
            updatedAt: string;
            bodyPlain: string;
            bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
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
        bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
    get(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
    update(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
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
        bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
    publish(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
    schedule(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        scheduledAt: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
    unpublish(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
    archive(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        status: import(".prisma/client").$Enums.BlogStatus;
        scheduledAt: string | null;
        version: number;
        createdAt: string;
        updatedAt: string;
        bodyPlain: string;
        bodyRich: import("@prisma/client/runtime/library").JsonValue;
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
}
