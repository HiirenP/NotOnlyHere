"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const admin_permissions_service_1 = require("../admin/admin-permissions.service");
const prisma_service_1 = require("../prisma/prisma.service");
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}
function sanitizePlainText(value) {
    return value.replace(/<[^>]*>/g, '').trim();
}
function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
const postInclude = {
    categories: { include: { category: true } },
    tags: { include: { tag: true } },
};
let BlogService = class BlogService {
    prisma;
    permissions;
    constructor(prisma, permissions) {
        this.prisma = prisma;
        this.permissions = permissions;
    }
    async publishDueScheduled() {
        const due = await this.prisma.blogPost.findMany({
            where: { status: 'SCHEDULED', scheduledAt: { lte: new Date() } },
            select: { id: true },
        });
        if (due.length === 0)
            return { published: 0 };
        const result = await this.prisma.blogPost.updateMany({
            where: { id: { in: due.map((row) => row.id) }, status: 'SCHEDULED' },
            data: { status: 'PUBLISHED', publishedAt: new Date() },
        });
        return { published: result.count };
    }
    async listPublished(options) {
        const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
        let cursorDate;
        let cursorId;
        if (options.cursor) {
            const [publishedAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
            cursorDate = new Date(publishedAt);
            cursorId = id;
        }
        const rows = await this.prisma.blogPost.findMany({
            where: {
                status: 'PUBLISHED',
                ...(options.q?.trim()
                    ? {
                        OR: [
                            { title: { contains: options.q.trim(), mode: 'insensitive' } },
                            { excerpt: { contains: options.q.trim(), mode: 'insensitive' } },
                        ],
                    }
                    : {}),
                ...(options.category
                    ? { categories: { some: { category: { slug: options.category } } } }
                    : {}),
                ...(options.tag ? { tags: { some: { tag: { slug: options.tag } } } } : {}),
                ...(cursorDate && cursorId
                    ? {
                        OR: [
                            { publishedAt: { lt: cursorDate } },
                            { publishedAt: cursorDate, id: { lt: cursorId } },
                        ],
                    }
                    : {}),
            },
            orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            include: postInclude,
        });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        return {
            query: options.q ?? '',
            items: page.map((row) => this.serializeSummary(row)),
            nextCursor: rows.length > limit && last?.publishedAt
                ? Buffer.from(`${last.publishedAt.toISOString()}|${last.id}`).toString('base64url')
                : null,
        };
    }
    async getPublishedBySlug(slug) {
        const row = await this.prisma.blogPost.findFirst({
            where: { slug, status: 'PUBLISHED' },
            include: postInclude,
        });
        if (!row)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Blog post not found.' });
        return this.serializeDetail(row);
    }
    async getRelated(slug) {
        const post = await this.prisma.blogPost.findFirst({
            where: { slug, status: 'PUBLISHED' },
            include: {
                categories: { select: { categoryId: true } },
                tags: { select: { tagId: true } },
            },
        });
        if (!post)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Blog post not found.' });
        const categoryIds = post.categories.map((row) => row.categoryId);
        const tagIds = post.tags.map((row) => row.tagId);
        if (categoryIds.length === 0 && tagIds.length === 0)
            return { items: [] };
        const related = await this.prisma.blogPost.findMany({
            where: {
                status: 'PUBLISHED',
                id: { not: post.id },
                OR: [
                    ...(categoryIds.length ? [{ categories: { some: { categoryId: { in: categoryIds } } } }] : []),
                    ...(tagIds.length ? [{ tags: { some: { tagId: { in: tagIds } } } }] : []),
                ],
            },
            orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
            take: 4,
            include: postInclude,
        });
        return { items: related.map((row) => this.serializeSummary(row)) };
    }
    async buildRssFeed() {
        const posts = await this.prisma.blogPost.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
            take: 50,
        });
        const siteUrl = process.env.WEB_URL ?? 'http://localhost:3000';
        const items = posts
            .map((post) => {
            const link = `${siteUrl}/blog/${post.slug}`;
            return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid>${escapeXml(link)}</guid>
  <description>${escapeXml(post.excerpt)}</description>
  <pubDate>${post.publishedAt?.toUTCString() ?? new Date().toUTCString()}</pubDate>
</item>`;
        })
            .join('\n');
        return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>NotOnlyHere Blog</title>
  <link>${escapeXml(siteUrl)}/blog</link>
  <description>Community stories and resources</description>
${items}
</channel>
</rss>`;
    }
    async assertCanWrite(userId) {
        const allowed = await this.permissions.hasPermission(userId, 'blog.write');
        if (!allowed) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Blog editing requires content editor access.' });
        }
    }
    async assertCanPublish(userId) {
        const allowed = await this.permissions.hasPermission(userId, 'blog.publish');
        if (!allowed) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Publishing requires blog.publish permission.' });
        }
    }
    async listAdmin(userId, options) {
        await this.assertCanWrite(userId);
        const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
        let cursorDate;
        let cursorId;
        if (options.cursor) {
            const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
            cursorDate = new Date(createdAt);
            cursorId = id;
        }
        const rows = await this.prisma.blogPost.findMany({
            where: {
                ...(options.status ? { status: options.status } : {}),
                ...(cursorDate && cursorId
                    ? {
                        OR: [
                            { createdAt: { lt: cursorDate } },
                            { createdAt: cursorDate, id: { lt: cursorId } },
                        ],
                    }
                    : {}),
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            include: postInclude,
        });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        return {
            items: page.map((row) => this.serializeAdmin(row)),
            nextCursor: rows.length > limit && last
                ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
                : null,
        };
    }
    async createPost(userId, input) {
        await this.assertCanWrite(userId);
        const title = input.title.trim();
        const excerpt = input.excerpt.trim();
        const bodyPlain = sanitizePlainText(input.bodyPlain);
        if (!title || !excerpt || !bodyPlain) {
            throw new common_1.BadRequestException({ code: 'INVALID_INPUT', message: 'Title, excerpt, and body are required.' });
        }
        const baseSlug = slugify(title) || 'post';
        const slug = `${baseSlug}-${(0, crypto_1.randomBytes)(3).toString('hex')}`;
        const bodyRich = input.bodyRich ?? { type: 'doc', content: [{ type: 'paragraph', text: bodyPlain }] };
        const post = await this.prisma.blogPost.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                slug,
                title,
                excerpt,
                bodyRich,
                bodyPlain,
                status: 'DRAFT',
                createdByUserId: userId,
                updatedByUserId: userId,
                categories: input.categorySlugs?.length
                    ? {
                        create: await this.resolveCategoryLinks(input.categorySlugs),
                    }
                    : undefined,
                tags: input.tagSlugs?.length
                    ? {
                        create: await this.resolveTagLinks(input.tagSlugs),
                    }
                    : undefined,
            },
            include: postInclude,
        });
        return this.serializeAdmin(post);
    }
    async updatePost(userId, postId, input) {
        await this.assertCanWrite(userId);
        const existing = await this.prisma.blogPost.findUnique({ where: { id: postId }, include: postInclude });
        if (!existing)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Blog post not found.' });
        if (existing.version !== input.version) {
            throw new common_1.ConflictException({ code: 'VERSION_CONFLICT', message: 'Blog post was updated elsewhere.' });
        }
        const post = await this.prisma.$transaction(async (tx) => {
            if (input.categorySlugs) {
                await tx.blogPostCategory.deleteMany({ where: { blogPostId: postId } });
                const links = await this.resolveCategoryLinks(input.categorySlugs, tx);
                if (links.length) {
                    await tx.blogPostCategory.createMany({ data: links.map((row) => ({ blogPostId: postId, ...row })) });
                }
            }
            if (input.tagSlugs) {
                await tx.blogPostTag.deleteMany({ where: { blogPostId: postId } });
                const links = await this.resolveTagLinks(input.tagSlugs, tx);
                if (links.length) {
                    await tx.blogPostTag.createMany({ data: links.map((row) => ({ blogPostId: postId, ...row })) });
                }
            }
            return tx.blogPost.update({
                where: { id: postId },
                data: {
                    title: input.title?.trim() ?? undefined,
                    excerpt: input.excerpt?.trim() ?? undefined,
                    bodyPlain: input.bodyPlain ? sanitizePlainText(input.bodyPlain) : undefined,
                    bodyRich: input.bodyRich ?? undefined,
                    updatedByUserId: userId,
                    version: { increment: 1 },
                },
                include: postInclude,
            });
        });
        return this.serializeAdmin(post);
    }
    async getAdminPost(userId, postId) {
        await this.assertCanWrite(userId);
        const post = await this.prisma.blogPost.findUnique({ where: { id: postId }, include: postInclude });
        if (!post)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Blog post not found.' });
        return this.serializeAdmin(post);
    }
    async publishPost(userId, postId) {
        await this.assertCanPublish(userId);
        const post = await this.prisma.blogPost.update({
            where: { id: postId },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
                scheduledAt: null,
                updatedByUserId: userId,
                version: { increment: 1 },
            },
            include: postInclude,
        });
        return this.serializeAdmin(post);
    }
    async schedulePost(userId, postId, scheduledAtIso) {
        await this.assertCanPublish(userId);
        const scheduledAt = new Date(scheduledAtIso);
        if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
            throw new common_1.BadRequestException({ code: 'INVALID_SCHEDULE', message: 'Schedule time must be in the future.' });
        }
        const post = await this.prisma.blogPost.update({
            where: { id: postId },
            data: {
                status: 'SCHEDULED',
                scheduledAt,
                publishedAt: null,
                updatedByUserId: userId,
                version: { increment: 1 },
            },
            include: postInclude,
        });
        return this.serializeAdmin(post);
    }
    async unpublishPost(userId, postId) {
        await this.assertCanPublish(userId);
        const post = await this.prisma.blogPost.update({
            where: { id: postId },
            data: {
                status: 'DRAFT',
                publishedAt: null,
                scheduledAt: null,
                updatedByUserId: userId,
                version: { increment: 1 },
            },
            include: postInclude,
        });
        return this.serializeAdmin(post);
    }
    async archivePost(userId, postId) {
        await this.assertCanWrite(userId);
        const post = await this.prisma.blogPost.update({
            where: { id: postId },
            data: {
                status: 'ARCHIVED',
                updatedByUserId: userId,
                version: { increment: 1 },
            },
            include: postInclude,
        });
        return this.serializeAdmin(post);
    }
    async resolveCategoryLinks(slugs, tx = this.prisma) {
        const links = [];
        for (const slug of slugs) {
            const category = await tx.blogCategory.findUnique({ where: { slug } });
            if (category)
                links.push({ categoryId: category.id });
        }
        return links;
    }
    async resolveTagLinks(slugs, tx = this.prisma) {
        const links = [];
        for (const slug of slugs) {
            const tag = await tx.blogTag.findUnique({ where: { slug } });
            if (tag)
                links.push({ tagId: tag.id });
        }
        return links;
    }
    serializeSummary(row) {
        return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt,
            publishedAt: row.publishedAt?.toISOString() ?? null,
            categories: row.categories.map((entry) => ({
                slug: entry.category.slug,
                name: entry.category.name,
            })),
            tags: row.tags.map((entry) => ({
                slug: entry.tag.slug,
                name: entry.tag.name,
            })),
        };
    }
    serializeDetail(row) {
        return {
            ...this.serializeSummary(row),
            bodyPlain: row.bodyPlain,
            bodyRich: row.bodyRich,
        };
    }
    serializeAdmin(row) {
        return {
            ...this.serializeDetail(row),
            status: row.status,
            scheduledAt: row.scheduledAt?.toISOString() ?? null,
            version: row.version,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
        };
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        admin_permissions_service_1.AdminPermissionsService])
], BlogService);
//# sourceMappingURL=blog.service.js.map