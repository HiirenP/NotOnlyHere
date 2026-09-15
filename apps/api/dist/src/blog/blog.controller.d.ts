import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blog;
    constructor(blog: BlogService);
    list(q?: string, category?: string, tag?: string, cursor?: string, limit?: string): Promise<{
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
    rss(): Promise<string>;
    related(slug: string): Promise<{
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
    get(slug: string): Promise<{
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
