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
exports.ReactionsService = exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const anonymous_quota_service_1 = require("../anonymous/anonymous-quota.service");
const anonymous_service_1 = require("../anonymous/anonymous.service");
const feed_policy_service_1 = require("./feed-policy.service");
const feed_constants_1 = require("./feed.constants");
const prisma_service_1 = require("../prisma/prisma.service");
const outbox_service_1 = require("../outbox/outbox.service");
const COMMENT_MAX = 2000;
const REACTION_KINDS = ['SUPPORT', 'HUG', 'INSIGHTFUL'];
const commentInclude = {
    author: { include: { profile: true } },
    anonymousAuthor: true,
    reactions: true,
};
let CommentsService = class CommentsService {
    prisma;
    policy;
    anonymous;
    anonymousQuota;
    outbox;
    constructor(prisma, policy, anonymous, anonymousQuota, outbox) {
        this.prisma = prisma;
        this.policy = policy;
        this.anonymous = anonymous;
        this.anonymousQuota = anonymousQuota;
        this.outbox = outbox;
    }
    async list(postId, viewerId) {
        await this.assertCanViewPost(postId, viewerId);
        const comments = await this.prisma.comment.findMany({
            where: { postId, status: 'ACTIVE' },
            include: commentInclude,
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        });
        return comments.map((comment) => this.serialize(comment, viewerId));
    }
    async create(postId, authorId, input) {
        await this.assertCanViewPost(postId, authorId);
        const body = (0, feed_constants_1.normalizeBody)(input.body);
        if (!body) {
            throw new common_1.BadRequestException({ code: 'EMPTY_COMMENT', message: 'Comment cannot be empty.' });
        }
        if (body.length > COMMENT_MAX) {
            throw new common_1.BadRequestException({ code: 'COMMENT_TOO_LONG', message: 'Comment is too long.' });
        }
        const isAnonymous = Boolean(input.isAnonymous);
        if (isAnonymous) {
            await this.anonymousQuota.consumeQuota(authorId);
        }
        let parentCommentId = null;
        if (input.parentCommentId) {
            const parent = await this.prisma.comment.findUnique({ where: { id: input.parentCommentId } });
            if (!parent || parent.postId !== postId || parent.status !== 'ACTIVE') {
                throw new common_1.BadRequestException({ code: 'INVALID_PARENT', message: 'Parent comment not found.' });
            }
            parentCommentId = parent.parentCommentId ?? parent.id;
        }
        const comment = await this.prisma.$transaction(async (tx) => {
            const created = await tx.comment.create({
                data: {
                    postId,
                    authorUserId: isAnonymous ? null : authorId,
                    parentCommentId,
                    body,
                    isAnonymous,
                },
            });
            if (isAnonymous) {
                await tx.commentAnonymousAuthor.create({
                    data: {
                        commentId: created.id,
                        userId: authorId,
                        displayLabel: this.anonymous.createDisplayLabel(),
                    },
                });
            }
            return tx.comment.findUniqueOrThrow({
                where: { id: created.id },
                include: commentInclude,
            });
        });
        await this.outbox.emitModerationEvaluate(comment.id, { commentId: comment.id });
        return this.serialize(comment, authorId);
    }
    async update(commentId, authorId, input) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: commentInclude,
        });
        if (!comment || comment.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Comment not found.' });
        }
        if (!this.policy.isCommentAuthor(comment, authorId)) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can edit this comment.' });
        }
        if (input.version !== comment.version) {
            throw new common_1.BadRequestException({ code: 'VERSION_CONFLICT', message: 'Comment was updated elsewhere.' });
        }
        if (Date.now() - comment.createdAt.getTime() > feed_constants_1.POST_EDIT_WINDOW_MS) {
            throw new common_1.BadRequestException({ code: 'EDIT_WINDOW_EXPIRED', message: 'Edit window expired.' });
        }
        const updated = await this.prisma.comment.update({
            where: { id: commentId },
            data: { body: (0, feed_constants_1.normalizeBody)(input.body), version: { increment: 1 }, editedAt: new Date() },
            include: { author: { include: { profile: true } }, reactions: true },
        });
        return this.serialize(updated, authorId);
    }
    async delete(commentId, authorId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { anonymousAuthor: true },
        });
        if (!comment || comment.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Comment not found.' });
        }
        if (!this.policy.isCommentAuthor(comment, authorId)) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can delete this comment.' });
        }
        await this.prisma.comment.update({
            where: { id: commentId },
            data: { status: 'DELETED', deletedAt: new Date(), body: '[deleted]', version: { increment: 1 } },
        });
        return { ok: true };
    }
    async assertCanViewPost(postId, viewerId) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        const context = await this.policy.getViewerContext(viewerId);
        if (!this.policy.canViewPost(viewerId, post, context)) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        }
    }
    serialize(comment, viewerId) {
        const counts = { SUPPORT: 0, HUG: 0, INSIGHTFUL: 0 };
        let viewerReaction = null;
        for (const reaction of comment.reactions) {
            counts[reaction.kind] += 1;
            if (reaction.userId === viewerId)
                viewerReaction = reaction.kind;
        }
        const isAuthor = this.policy.isCommentAuthor(comment, viewerId);
        return {
            id: comment.id,
            postId: comment.postId,
            parentCommentId: comment.parentCommentId,
            body: comment.body,
            status: comment.status,
            version: comment.version,
            isEdited: Boolean(comment.editedAt),
            createdAt: comment.createdAt.toISOString(),
            isAnonymous: comment.isAnonymous,
            author: comment.isAnonymous
                ? {
                    isAnonymous: true,
                    displayLabel: comment.anonymousAuthor?.displayLabel ?? 'Anonymous',
                }
                : {
                    isAnonymous: false,
                    id: comment.authorUserId,
                    username: comment.author?.profile?.username ?? 'member',
                    displayName: comment.author?.profile?.displayName ?? 'Member',
                },
            reactions: { counts, viewerReaction },
            viewer: {
                isAuthor,
                canEdit: isAuthor &&
                    comment.status === 'ACTIVE' &&
                    Date.now() - comment.createdAt.getTime() <= feed_constants_1.POST_EDIT_WINDOW_MS,
                canDelete: isAuthor && comment.status === 'ACTIVE',
                canConnect: !comment.isAnonymous,
                canMessage: !comment.isAnonymous,
            },
        };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        feed_policy_service_1.FeedPolicyService,
        anonymous_service_1.AnonymousService,
        anonymous_quota_service_1.AnonymousQuotaService,
        outbox_service_1.OutboxService])
], CommentsService);
let ReactionsService = class ReactionsService {
    prisma;
    policy;
    constructor(prisma, policy) {
        this.prisma = prisma;
        this.policy = policy;
    }
    assertKind(kind) {
        if (!REACTION_KINDS.includes(kind)) {
            throw new common_1.BadRequestException({ code: 'INVALID_REACTION', message: 'Invalid reaction kind.' });
        }
        return kind;
    }
    async setPostReaction(postId, userId, kind) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        }
        const context = await this.policy.getViewerContext(userId);
        if (!this.policy.canViewPost(userId, post, context)) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
        }
        await this.prisma.postReaction.upsert({
            where: { postId_userId: { postId, userId } },
            update: { kind },
            create: { postId, userId, kind },
        });
        return this.getPostReactionSummary(postId, userId);
    }
    async removePostReaction(postId, userId) {
        await this.prisma.postReaction.deleteMany({ where: { postId, userId } });
        return this.getPostReactionSummary(postId, userId);
    }
    async getPostReactionSummary(postId, viewerId) {
        const reactions = await this.prisma.postReaction.findMany({ where: { postId } });
        const counts = { SUPPORT: 0, HUG: 0, INSIGHTFUL: 0 };
        let viewerReaction = null;
        for (const reaction of reactions) {
            counts[reaction.kind] += 1;
            if (reaction.userId === viewerId)
                viewerReaction = reaction.kind;
        }
        return { counts, viewerReaction };
    }
};
exports.ReactionsService = ReactionsService;
exports.ReactionsService = ReactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        feed_policy_service_1.FeedPolicyService])
], ReactionsService);
//# sourceMappingURL=comments.service.js.map