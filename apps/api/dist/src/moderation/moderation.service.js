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
exports.ModerationService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const MODEL_VERSION = 'dev-mod-v1';
const FLAG_PATTERNS = [
    { pattern: /\b(kill|hurt)\s+you\b/i, category: 'THREATS', rationaleCode: 'THREAT_LANGUAGE', confidence: 0.82 },
    { pattern: /\bharass\b/i, category: 'HARASSMENT', rationaleCode: 'HARASSMENT_LANGUAGE', confidence: 0.71 },
];
let ModerationService = class ModerationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async evaluatePost(postId) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.status !== 'ACTIVE')
            return null;
        return this.createFlagIfNeeded({ postId, body: post.body });
    }
    async evaluateComment(commentId) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment || comment.status !== 'ACTIVE')
            return null;
        return this.createFlagIfNeeded({ commentId, body: comment.body });
    }
    async listFlags(options) {
        const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
        let cursorDate;
        let cursorId;
        if (options.cursor) {
            const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
            cursorDate = new Date(createdAt);
            cursorId = id;
        }
        const rows = await this.prisma.aiModFlag.findMany({
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
            include: {
                post: { select: { id: true, body: true, status: true } },
                comment: { select: { id: true, body: true, status: true, postId: true } },
            },
        });
        const page = rows.slice(0, limit);
        const last = page[limit - 1];
        return {
            items: page.map((row) => this.serialize(row)),
            nextCursor: rows.length > limit && last
                ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
                : null,
        };
    }
    async getFlag(flagId) {
        const row = await this.prisma.aiModFlag.findUnique({
            where: { id: flagId },
            include: {
                post: { select: { id: true, body: true, status: true } },
                comment: { select: { id: true, body: true, status: true, postId: true } },
            },
        });
        if (!row)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Flag not found.' });
        return this.serialize(row);
    }
    async updateFlag(flagId, reviewerId, input) {
        if (!['REVIEWED', 'DISMISSED', 'ACTIONED'].includes(input.status)) {
            throw new common_1.BadRequestException({ code: 'INVALID_STATUS', message: 'Invalid disposition status.' });
        }
        const row = await this.prisma.aiModFlag.update({
            where: { id: flagId },
            data: {
                status: input.status,
                reviewedByUserId: reviewerId,
                reviewedAt: new Date(),
                resolutionNote: input.resolutionNote?.trim() || null,
            },
            include: {
                post: { select: { id: true, body: true, status: true } },
                comment: { select: { id: true, body: true, status: true, postId: true } },
            },
        });
        return this.serialize(row);
    }
    async createFlagIfNeeded(input) {
        const match = FLAG_PATTERNS.find((entry) => entry.pattern.test(input.body));
        if (!match)
            return null;
        const existing = await this.prisma.aiModFlag.findFirst({
            where: {
                postId: input.postId ?? null,
                commentId: input.commentId ?? null,
                status: 'OPEN',
                category: match.category,
            },
        });
        if (existing)
            return existing;
        return this.prisma.aiModFlag.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                postId: input.postId ?? null,
                commentId: input.commentId ?? null,
                category: match.category,
                confidence: match.confidence,
                modelVersion: MODEL_VERSION,
                rationaleCode: match.rationaleCode,
            },
        });
    }
    serialize(row) {
        return {
            id: row.id,
            category: row.category,
            confidence: row.confidence ? Number(row.confidence) : null,
            status: row.status,
            modelVersion: row.modelVersion,
            rationaleCode: row.rationaleCode,
            reviewedAt: row.reviewedAt?.toISOString() ?? null,
            resolutionNote: row.resolutionNote,
            createdAt: row.createdAt.toISOString(),
            target: row.post
                ? { type: 'POST', id: row.post.id, body: row.post.body, status: row.post.status }
                : row.comment
                    ? {
                        type: 'COMMENT',
                        id: row.comment.id,
                        postId: row.comment.postId,
                        body: row.comment.body,
                        status: row.comment.status,
                    }
                    : null,
        };
    }
};
exports.ModerationService = ModerationService;
exports.ModerationService = ModerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModerationService);
//# sourceMappingURL=moderation.service.js.map