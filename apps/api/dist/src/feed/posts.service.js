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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const activity_service_1 = require("../activity/activity.service");
const anonymous_quota_service_1 = require("../anonymous/anonymous-quota.service");
const anonymous_service_1 = require("../anonymous/anonymous.service");
const media_service_1 = require("../media/media.service");
const feed_policy_service_1 = require("./feed-policy.service");
const link_preview_service_1 = require("./link-preview.service");
const feed_constants_1 = require("./feed.constants");
const prisma_service_1 = require("../prisma/prisma.service");
const outbox_service_1 = require("../outbox/outbox.service");
const postInclude = {
    author: { include: { profile: true } },
    anonymousAuthor: true,
    media: { include: { media: true }, orderBy: { position: 'asc' } },
    linkPreview: true,
    reactions: true,
    _count: { select: { comments: { where: { status: 'ACTIVE' } } } },
};
let PostsService = class PostsService {
    prisma;
    policy;
    media;
    activity;
    linkPreviews;
    anonymous;
    anonymousQuota;
    outbox;
    constructor(prisma, policy, media, activity, linkPreviews, anonymous, anonymousQuota, outbox) {
        this.prisma = prisma;
        this.policy = policy;
        this.media = media;
        this.activity = activity;
        this.linkPreviews = linkPreviews;
        this.anonymous = anonymous;
        this.anonymousQuota = anonymousQuota;
        this.outbox = outbox;
    }
    async createPost(authorId, input) {
        const body = (0, feed_constants_1.normalizeBody)(input.body ?? '');
        const mediaItems = input.media ?? [];
        const hasLink = Boolean(input.linkPreviewUrl?.trim());
        if (!(0, feed_constants_1.isMeaningfulBody)(body) && mediaItems.length === 0 && !hasLink) {
            throw new common_1.BadRequestException({
                code: 'EMPTY_POST',
                message: 'Post must include text, images, or a link.',
            });
        }
        if (body.length > feed_constants_1.POST_BODY_MAX) {
            throw new common_1.BadRequestException({
                code: 'POST_TOO_LONG',
                message: `Post must be ${feed_constants_1.POST_BODY_MAX} characters or fewer.`,
            });
        }
        if (mediaItems.length > 4) {
            throw new common_1.BadRequestException({ code: 'TOO_MANY_IMAGES', message: 'Maximum 4 images per post.' });
        }
        const visibility = input.visibility ?? 'MEMBERS';
        const isAnonymous = Boolean(input.isAnonymous);
        const circleId = input.circleId?.trim() || null;
        if (circleId) {
            const membership = await this.policy.assertActiveCircleMember(circleId, authorId);
            if (!membership) {
                throw new common_1.ForbiddenException({ code: 'NOT_A_MEMBER', message: 'Circle membership required to post.' });
            }
            if (await this.policy.isCircleMuted(circleId, authorId)) {
                throw new common_1.ForbiddenException({ code: 'MUTED', message: 'You are muted in this circle.' });
            }
        }
        for (const item of mediaItems) {
            await this.media.assertOwnedReadyMedia(authorId, item.mediaId, 'POST_IMAGE');
        }
        const preview = hasLink ? await this.linkPreviews.fetchPreview(input.linkPreviewUrl.trim()) : null;
        if (isAnonymous) {
            await this.anonymousQuota.consumeQuota(authorId);
        }
        const post = await this.prisma.$transaction(async (tx) => {
            const created = await tx.post.create({
                data: {
                    authorUserId: isAnonymous ? null : authorId,
                    body: body || (hasLink ? preview.canonicalUrl : '(image)'),
                    visibility,
                    isAnonymous,
                    circleId,
                },
            });
            if (isAnonymous) {
                await tx.postAnonymousAuthor.create({
                    data: {
                        postId: created.id,
                        userId: authorId,
                        displayLabel: this.anonymous.createDisplayLabel(),
                    },
                });
            }
            if (mediaItems.length > 0) {
                await tx.postMedia.createMany({
                    data: mediaItems.map((item) => ({
                        postId: created.id,
                        mediaId: item.mediaId,
                        position: item.position,
                        altText: item.altText ?? null,
                    })),
                });
            }
            if (preview) {
                await tx.postLinkPreview.create({
                    data: {
                        postId: created.id,
                        sourceUrl: preview.sourceUrl,
                        canonicalUrl: preview.canonicalUrl,
                        title: preview.title,
                        description: preview.description,
                        siteName: preview.siteName,
                        fetchStatus: preview.fetchStatus,
                        fetchedAt: new Date(preview.fetchedAt),
                    },
                });
            }
            return tx.post.findUniqueOrThrow({
                where: { id: created.id },
                include: postInclude,
            });
        });
        await this.activity.recordPostCreated(authorId, post.id);
        await this.outbox.emitModerationEvaluate(post.id, { postId: post.id });
        const context = await this.policy.getViewerContext(authorId);
        return this.serialize(post, authorId, context);
    }
    async getPost(postId, viewerId) {
        const post = await this.prisma.post.findUnique({ where: { id: postId }, include: postInclude });
        if (!post)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        const context = await this.policy.getViewerContext(viewerId);
        if (!this.policy.canViewPost(viewerId, post, context)) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        }
        return this.serialize(post, viewerId, context);
    }
    async listByUsername(username, viewerId, limit = 20) {
        const profile = await this.prisma.profile.findUnique({ where: { username } });
        if (!profile) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Profile not found.' });
        }
        const context = await this.policy.getViewerContext(viewerId);
        const candidates = await this.prisma.post.findMany({
            where: { authorUserId: profile.userId, status: 'ACTIVE' },
            include: postInclude,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: Math.min(limit, 50),
        });
        const items = candidates
            .filter((post) => this.policy.canViewPost(viewerId, post, context))
            .map((post) => this.serialize(post, viewerId, context));
        return { items };
    }
    async updatePost(postId, authorId, input) {
        const post = await this.prisma.post.findUnique({ where: { id: postId }, include: postInclude });
        if (!post || post.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        }
        if (!this.policy.isPostAuthor(post, authorId)) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can edit this post.' });
        }
        if (input.version !== post.version) {
            throw new common_1.ConflictException({ code: 'VERSION_CONFLICT', message: 'Post was updated elsewhere.' });
        }
        if (Date.now() - post.createdAt.getTime() > feed_constants_1.POST_EDIT_WINDOW_MS) {
            throw new common_1.BadRequestException({ code: 'EDIT_WINDOW_EXPIRED', message: 'Edit window expired.' });
        }
        const body = (0, feed_constants_1.normalizeBody)(input.body);
        if (!(0, feed_constants_1.isMeaningfulBody)(body)) {
            throw new common_1.BadRequestException({ code: 'EMPTY_POST', message: 'Post must include text content.' });
        }
        const updated = await this.prisma.post.update({
            where: { id: postId },
            data: { body, version: { increment: 1 }, editedAt: new Date() },
            include: postInclude,
        });
        const context = await this.policy.getViewerContext(authorId);
        return this.serialize(updated, authorId, context);
    }
    async deletePost(postId, authorId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: { anonymousAuthor: true },
        });
        if (!post || post.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        }
        if (!this.policy.isPostAuthor(post, authorId)) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can delete this post.' });
        }
        const now = new Date();
        await this.prisma.post.update({
            where: { id: postId },
            data: { status: 'DELETED', deletedAt: now, body: '[deleted]', version: { increment: 1 } },
        });
        return { ok: true, deletedAt: now.toISOString() };
    }
    serialize(post, viewerId, _context) {
        const profile = post.author?.profile;
        const counts = { SUPPORT: 0, HUG: 0, INSIGHTFUL: 0 };
        let viewerReaction = null;
        for (const reaction of post.reactions ?? []) {
            counts[reaction.kind] += 1;
            if (reaction.userId === viewerId)
                viewerReaction = reaction.kind;
        }
        const isAuthor = this.policy.isPostAuthor(post, viewerId);
        return {
            id: post.id,
            body: post.body,
            visibility: post.visibility,
            status: post.status,
            version: post.version,
            isEdited: Boolean(post.editedAt),
            editedAt: post.editedAt?.toISOString() ?? null,
            createdAt: post.createdAt.toISOString(),
            deletedAt: post.deletedAt?.toISOString() ?? null,
            isAnonymous: post.isAnonymous,
            author: post.isAnonymous
                ? {
                    isAnonymous: true,
                    displayLabel: post.anonymousAuthor?.displayLabel ?? 'Anonymous',
                }
                : {
                    isAnonymous: false,
                    id: post.authorUserId,
                    username: profile?.username ?? 'member',
                    displayName: profile?.displayName ?? 'Member',
                    avatar: this.media.serializeMedia(profile?.avatarMediaId),
                },
            media: (post.media ?? []).map((item) => ({
                id: item.mediaId,
                position: item.position,
                altText: item.altText,
                url: this.media.mediaUrl(item.mediaId),
            })),
            linkPreview: post.linkPreview
                ? {
                    sourceUrl: post.linkPreview.sourceUrl,
                    canonicalUrl: post.linkPreview.canonicalUrl,
                    title: post.linkPreview.title,
                    description: post.linkPreview.description,
                    siteName: post.linkPreview.siteName,
                    fetchStatus: post.linkPreview.fetchStatus,
                }
                : null,
            reactions: { counts, viewerReaction },
            commentCount: post._count?.comments ?? 0,
            viewer: {
                isAuthor,
                canEdit: isAuthor &&
                    post.status === 'ACTIVE' &&
                    Date.now() - post.createdAt.getTime() <= feed_constants_1.POST_EDIT_WINDOW_MS,
                canDelete: isAuthor && post.status === 'ACTIVE',
                canConnect: !post.isAnonymous,
                canMessage: !post.isAnonymous,
            },
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        feed_policy_service_1.FeedPolicyService,
        media_service_1.MediaService,
        activity_service_1.ActivityService,
        link_preview_service_1.LinkPreviewService,
        anonymous_service_1.AnonymousService,
        anonymous_quota_service_1.AnonymousQuotaService,
        outbox_service_1.OutboxService])
], PostsService);
//# sourceMappingURL=posts.service.js.map