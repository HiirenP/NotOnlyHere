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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const feed_policy_service_1 = require("./feed-policy.service");
const feed_constants_1 = require("./feed.constants");
const posts_service_1 = require("./posts.service");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    policy;
    posts;
    constructor(prisma, policy, posts) {
        this.prisma = prisma;
        this.policy = policy;
        this.posts = posts;
    }
    async searchPosts(viewerId, options) {
        const query = options.q.trim();
        const limit = Math.min(Math.max(options.limit ?? feed_constants_1.FEED_DEFAULT_LIMIT, 1), 50);
        const context = await this.policy.getViewerContext(viewerId);
        let cursor = null;
        if (options.cursor)
            cursor = (0, feed_constants_1.decodeCursor)(options.cursor);
        const candidates = await this.prisma.post.findMany({
            where: {
                status: 'ACTIVE',
                body: { contains: query, mode: 'insensitive' },
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
        const page = eligible.slice(0, limit);
        const last = page[page.length - 1];
        return {
            query,
            items: page.map((post) => this.posts.serialize(post, viewerId, context)),
            nextCursor: eligible.length > limit && last ? (0, feed_constants_1.encodeCursor)(last.createdAt, last.id) : null,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        feed_policy_service_1.FeedPolicyService,
        posts_service_1.PostsService])
], SearchService);
//# sourceMappingURL=search.service.js.map