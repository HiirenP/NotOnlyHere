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
exports.FeedPolicyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FeedPolicyService = class FeedPolicyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getViewerContext(viewerId) {
        const [blocks, connections] = await Promise.all([
            this.prisma.userBlock.findMany({
                where: {
                    OR: [{ blockerId: viewerId }, { blockedId: viewerId }],
                },
            }),
            this.prisma.connection.findMany({
                where: {
                    status: 'ACCEPTED',
                    OR: [{ requesterId: viewerId }, { addresseeId: viewerId }],
                },
            }),
        ]);
        const blockedUserIds = new Set();
        for (const block of blocks) {
            blockedUserIds.add(block.blockerId === viewerId ? block.blockedId : block.blockerId);
        }
        const connectedUserIds = new Set();
        for (const connection of connections) {
            connectedUserIds.add(connection.requesterId === viewerId ? connection.addresseeId : connection.requesterId);
        }
        return { blockedUserIds, connectedUserIds };
    }
    resolveAuthorUserId(post) {
        if (!post.isAnonymous) {
            return post.authorUserId;
        }
        return post.anonymousAuthor?.userId ?? null;
    }
    canViewPost(viewerId, post, context) {
        if (post.status !== 'ACTIVE') {
            return false;
        }
        const authorId = this.resolveAuthorUserId(post);
        if (authorId && context.blockedUserIds.has(authorId)) {
            return false;
        }
        if (post.visibility === 'ONLY_ME') {
            return authorId === viewerId;
        }
        if (post.visibility === 'CONNECTIONS') {
            return authorId === viewerId || (authorId ? context.connectedUserIds.has(authorId) : false);
        }
        return true;
    }
    isPostAuthor(post, viewerId) {
        const authorId = this.resolveAuthorUserId(post);
        return authorId === viewerId;
    }
    isCommentAuthor(comment, viewerId) {
        if (!comment.isAnonymous) {
            return comment.authorUserId === viewerId;
        }
        return comment.anonymousAuthor?.userId === viewerId;
    }
    async getActiveCircleMembership(circleId, userId) {
        return this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
    }
    async assertActiveCircleMember(circleId, userId) {
        const membership = await this.getActiveCircleMembership(circleId, userId);
        if (!membership || membership.status !== 'ACTIVE') {
            return null;
        }
        return membership;
    }
    async isCircleMuted(circleId, userId) {
        const mute = await this.prisma.circleMute.findUnique({
            where: { circleId_mutedUserId: { circleId, mutedUserId: userId } },
        });
        if (!mute)
            return false;
        if (mute.expiresAt && mute.expiresAt.getTime() < Date.now())
            return false;
        return true;
    }
    canViewCirclePost(viewerId, post, context, isCircleMember) {
        if (post.circleId && !isCircleMember)
            return false;
        return this.canViewPost(viewerId, post, context);
    }
};
exports.FeedPolicyService = FeedPolicyService;
exports.FeedPolicyService = FeedPolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedPolicyService);
//# sourceMappingURL=feed-policy.service.js.map