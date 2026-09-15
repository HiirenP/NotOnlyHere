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
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const media_service_1 = require("../media/media.service");
const posts_service_1 = require("./posts.service");
const feed_policy_service_1 = require("./feed-policy.service");
const feed_constants_1 = require("./feed.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let FeedService = class FeedService {
    prisma;
    policy;
    posts;
    media;
    constructor(prisma, policy, posts, media) {
        this.prisma = prisma;
        this.policy = policy;
        this.posts = posts;
        this.media = media;
    }
    async listFeed(viewerId, options) {
        const mode = options.mode ?? 'CHRONOLOGICAL';
        if (!['RELEVANT', 'CHRONOLOGICAL'].includes(mode)) {
            throw new common_1.BadRequestException({ code: 'INVALID_MODE', message: 'Feed mode must be RELEVANT or CHRONOLOGICAL.' });
        }
        const limit = Math.min(Math.max(options.limit ?? feed_constants_1.FEED_DEFAULT_LIMIT, 1), 50);
        const context = await this.policy.getViewerContext(viewerId);
        let cursor = null;
        if (options.cursor) {
            try {
                cursor = (0, feed_constants_1.decodeCursor)(options.cursor);
            }
            catch {
                throw new common_1.BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid feed cursor.' });
            }
        }
        const candidates = await this.prisma.post.findMany({
            where: {
                status: 'ACTIVE',
                circleId: null,
                ...(cursor
                    ? {
                        OR: [
                            { createdAt: { lt: cursor.createdAt } },
                            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
                        ],
                    }
                    : {}),
            },
            include: {
                author: { include: { profile: true } },
                anonymousAuthor: true,
                media: { include: { media: true }, orderBy: { position: 'asc' } },
                linkPreview: true,
                reactions: true,
                _count: { select: { comments: { where: { status: 'ACTIVE' } } } },
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit * 4,
        });
        const eligible = candidates.filter((post) => this.policy.canViewPost(viewerId, post, context));
        const sorted = mode === 'CHRONOLOGICAL'
            ? eligible
            : [...eligible].sort((a, b) => {
                const aAuthor = this.policy.resolveAuthorUserId(a);
                const bAuthor = this.policy.resolveAuthorUserId(b);
                const aConnected = aAuthor && context.connectedUserIds.has(aAuthor) ? 1 : 0;
                const bConnected = bAuthor && context.connectedUserIds.has(bAuthor) ? 1 : 0;
                if (aConnected !== bConnected)
                    return bConnected - aConnected;
                const timeDiff = b.createdAt.getTime() - a.createdAt.getTime();
                if (timeDiff !== 0)
                    return timeDiff;
                return b.id.localeCompare(a.id);
            });
        const page = sorted.slice(0, limit);
        const hasMore = sorted.length > limit;
        const last = page[page.length - 1];
        return {
            mode,
            items: page.map((post) => this.posts.serialize(post, viewerId, context)),
            nextCursor: hasMore && last ? (0, feed_constants_1.encodeCursor)(last.createdAt, last.id) : null,
        };
    }
    async listCircleFeed(circleId, viewerId, options) {
        const membership = await this.policy.assertActiveCircleMember(circleId, viewerId);
        if (!membership) {
            throw new common_1.BadRequestException({ code: 'NOT_A_MEMBER', message: 'Circle membership required.' });
        }
        const limit = Math.min(Math.max(options.limit ?? feed_constants_1.FEED_DEFAULT_LIMIT, 1), 50);
        const context = await this.policy.getViewerContext(viewerId);
        let cursor = null;
        if (options.cursor) {
            try {
                cursor = (0, feed_constants_1.decodeCursor)(options.cursor);
            }
            catch {
                throw new common_1.BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid feed cursor.' });
            }
        }
        const candidates = await this.prisma.post.findMany({
            where: {
                status: 'ACTIVE',
                circleId,
                ...(cursor
                    ? {
                        OR: [
                            { createdAt: { lt: cursor.createdAt } },
                            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
                        ],
                    }
                    : {}),
            },
            include: {
                author: { include: { profile: true } },
                anonymousAuthor: true,
                media: { include: { media: true }, orderBy: { position: 'asc' } },
                linkPreview: true,
                reactions: true,
                _count: { select: { comments: { where: { status: 'ACTIVE' } } } },
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
        });
        const eligible = candidates.filter((post) => this.policy.canViewCirclePost(viewerId, post, context, true));
        const page = eligible.slice(0, limit);
        const last = page[page.length - 1];
        return {
            circleId,
            items: page.map((post) => this.posts.serialize(post, viewerId, context)),
            nextCursor: eligible.length > limit && last ? (0, feed_constants_1.encodeCursor)(last.createdAt, last.id) : null,
        };
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        feed_policy_service_1.FeedPolicyService,
        posts_service_1.PostsService,
        media_service_1.MediaService])
], FeedService);
//# sourceMappingURL=feed.service.js.map