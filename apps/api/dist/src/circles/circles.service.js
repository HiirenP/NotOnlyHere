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
exports.CirclesService = void 0;
const common_1 = require("@nestjs/common");
const circle_policy_service_1 = require("./circle-policy.service");
const circles_constants_1 = require("./circles.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let CirclesService = class CirclesService {
    prisma;
    policy;
    constructor(prisma, policy) {
        this.prisma = prisma;
        this.policy = policy;
    }
    async listCircles(viewerId, options) {
        const limit = Math.min(Math.max(options.limit ?? circles_constants_1.CIRCLE_DEFAULT_LIMIT, 1), 50);
        let cursor = null;
        if (options.cursor) {
            try {
                cursor = (0, circles_constants_1.decodeCursor)(options.cursor);
            }
            catch {
                throw new common_1.BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid cursor.' });
            }
        }
        const query = options.q?.trim();
        const memberships = await this.prisma.circleMember.findMany({
            where: { userId: viewerId, status: 'ACTIVE' },
            select: { circleId: true },
        });
        const memberCircleIds = memberships.map((m) => m.circleId);
        const candidates = await this.prisma.circle.findMany({
            where: {
                status: 'ACTIVE',
                OR: [
                    { visibility: { in: ['PUBLIC', 'PRIVATE'] } },
                    ...(memberCircleIds.length > 0 ? [{ id: { in: memberCircleIds }, visibility: 'HIDDEN' }] : []),
                ],
                ...(query
                    ? {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
                ...(cursor
                    ? {
                        OR: [
                            { createdAt: { lt: cursor.createdAt } },
                            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
                        ],
                    }
                    : {}),
            },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
        });
        const page = candidates.slice(0, limit);
        const last = page[page.length - 1];
        const membershipMap = await this.loadMembershipMap(viewerId, page.map((c) => c.id));
        return {
            query: query ?? '',
            items: page.map((circle) => this.serializeSummary(circle, membershipMap.get(circle.id) ?? null)),
            nextCursor: candidates.length > limit && last ? (0, circles_constants_1.encodeCursor)(last.createdAt, last.id) : null,
        };
    }
    async getCircle(circleId, viewerId) {
        const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
        if (!circle)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId: viewerId } },
        });
        if (!this.policy.canViewDetail(circle, membership)) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
        }
        const isMember = this.policy.isActiveMember(membership);
        return this.serializeDetail(circle, membership, isMember);
    }
    async listMembers(circleId, viewerId, options) {
        const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
        if (!circle)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId: viewerId } },
        });
        if (!this.policy.canViewMemberList(membership)) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
        }
        const limit = Math.min(Math.max(options.limit ?? circles_constants_1.CIRCLE_DEFAULT_LIMIT, 1), 50);
        let cursor = null;
        if (options.cursor) {
            try {
                const decoded = (0, circles_constants_1.decodeCursor)(options.cursor);
                cursor = { joinedAt: decoded.createdAt, userId: decoded.id };
            }
            catch {
                throw new common_1.BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid cursor.' });
            }
        }
        const members = await this.prisma.circleMember.findMany({
            where: {
                circleId,
                status: 'ACTIVE',
                ...(cursor
                    ? {
                        OR: [
                            { joinedAt: { lt: cursor.joinedAt } },
                            { joinedAt: cursor.joinedAt, userId: { lt: cursor.userId } },
                        ],
                    }
                    : {}),
            },
            include: { user: { include: { profile: true } } },
            orderBy: [{ joinedAt: 'desc' }, { userId: 'desc' }],
            take: limit + 1,
        });
        const page = members.slice(0, limit);
        const last = page[page.length - 1];
        return {
            items: page.map((member) => ({
                userId: member.userId,
                username: member.user.profile?.username ?? 'member',
                displayName: member.user.profile?.displayName ?? 'Member',
                role: member.role,
                joinedAt: member.joinedAt?.toISOString() ?? null,
            })),
            nextCursor: members.length > limit && last?.joinedAt
                ? (0, circles_constants_1.encodeCursor)(last.joinedAt, last.userId)
                : null,
        };
    }
    async loadMembershipMap(viewerId, circleIds) {
        if (circleIds.length === 0)
            return new Map();
        const rows = await this.prisma.circleMember.findMany({
            where: { userId: viewerId, circleId: { in: circleIds } },
        });
        return new Map(rows.map((row) => [row.circleId, row]));
    }
    serializeSummary(circle, membership) {
        return {
            id: circle.id,
            slug: circle.slug,
            name: circle.name,
            description: circle.description,
            visibility: circle.visibility,
            joinPolicy: circle.joinPolicy,
            memberCount: circle.memberCount,
            createdAt: circle.createdAt.toISOString(),
            viewer: {
                membershipStatus: membership?.status ?? null,
                role: membership?.role ?? null,
                isMember: membership?.status === 'ACTIVE',
                canJoin: this.policy.canJoin({ joinPolicy: circle.joinPolicy, status: 'ACTIVE' }, membership),
            },
        };
    }
    serializeDetail(circle, membership, isMember) {
        return {
            id: circle.id,
            slug: circle.slug,
            name: circle.name,
            description: circle.description,
            guidelines: isMember ? circle.guidelines : null,
            visibility: circle.visibility,
            joinPolicy: circle.joinPolicy,
            memberCount: circle.memberCount,
            version: circle.version,
            createdAt: circle.createdAt.toISOString(),
            viewer: {
                membershipStatus: membership?.status ?? null,
                role: membership?.role ?? null,
                isMember,
                isAdmin: membership?.status === 'ACTIVE' && membership.role === 'ADMIN',
                canJoin: this.policy.canJoin({ joinPolicy: circle.joinPolicy, status: 'ACTIVE' }, membership),
                canLeave: this.policy.canLeave(membership),
                canViewMembers: isMember,
                canManage: membership?.status === 'ACTIVE' && membership.role === 'ADMIN',
            },
        };
    }
};
exports.CirclesService = CirclesService;
exports.CirclesService = CirclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        circle_policy_service_1.CirclePolicyService])
], CirclesService);
//# sourceMappingURL=circles.service.js.map