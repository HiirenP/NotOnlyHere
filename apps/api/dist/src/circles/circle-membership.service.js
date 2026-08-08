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
exports.CircleMembershipService = void 0;
const common_1 = require("@nestjs/common");
const outbox_service_1 = require("../outbox/outbox.service");
const circle_policy_service_1 = require("./circle-policy.service");
const prisma_service_1 = require("../prisma/prisma.service");
let CircleMembershipService = class CircleMembershipService {
    prisma;
    policy;
    outbox;
    constructor(prisma, policy, outbox) {
        this.prisma = prisma;
        this.policy = policy;
        this.outbox = outbox;
    }
    async join(circleId, userId) {
        const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
        if (!circle)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
        const existing = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
        if (!this.policy.canJoin(circle, existing)) {
            if (circle.joinPolicy === 'PRIVATE') {
                throw new common_1.ForbiddenException({
                    code: 'INVITE_REQUIRED',
                    message: 'This circle requires an invite to join.',
                });
            }
            if (existing?.status === 'PENDING') {
                throw new common_1.ConflictException({ code: 'ALREADY_PENDING', message: 'Join request already pending.' });
            }
            if (existing?.status === 'ACTIVE') {
                throw new common_1.ConflictException({ code: 'ALREADY_MEMBER', message: 'Already a member.' });
            }
            throw new common_1.ForbiddenException({ code: 'CANNOT_JOIN', message: 'Cannot join this circle.' });
        }
        const now = new Date();
        if (circle.joinPolicy === 'OPEN') {
            await this.prisma.$transaction(async (tx) => {
                await tx.circleMember.upsert({
                    where: { circleId_userId: { circleId, userId } },
                    update: {
                        status: 'ACTIVE',
                        role: 'MEMBER',
                        joinedAt: now,
                        leftAt: null,
                        requestedAt: null,
                        decidedAt: null,
                    },
                    create: {
                        circleId,
                        userId,
                        role: 'MEMBER',
                        status: 'ACTIVE',
                        joinedAt: now,
                    },
                });
                await tx.circle.update({
                    where: { id: circleId },
                    data: { memberCount: { increment: 1 } },
                });
            });
            return { status: 'ACTIVE', message: 'Joined circle.' };
        }
        await this.prisma.circleMember.upsert({
            where: { circleId_userId: { circleId, userId } },
            update: {
                status: 'PENDING',
                requestedAt: now,
                leftAt: null,
                joinedAt: null,
                decidedAt: null,
            },
            create: {
                circleId,
                userId,
                status: 'PENDING',
                requestedAt: now,
            },
        });
        await this.outbox.emitCircleMembershipRequested(circleId, userId);
        return { status: 'PENDING', message: 'Join request submitted.' };
    }
    async leave(circleId, userId) {
        const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
        if (!circle)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
        if (!this.policy.canLeave(membership)) {
            throw new common_1.BadRequestException({ code: 'NOT_A_MEMBER', message: 'Not an active member.' });
        }
        if (membership.role === 'ADMIN') {
            const adminCount = await this.prisma.circleMember.count({
                where: { circleId, status: 'ACTIVE', role: 'ADMIN' },
            });
            if (adminCount <= 1) {
                throw new common_1.ForbiddenException({
                    code: 'LAST_ADMIN',
                    message: 'Cannot leave as the only Circle Admin. Transfer admin role first.',
                });
            }
        }
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            await tx.circleMember.update({
                where: { circleId_userId: { circleId, userId } },
                data: { status: 'LEFT', leftAt: now },
            });
            await tx.circle.update({
                where: { id: circleId },
                data: { memberCount: { decrement: 1 } },
            });
        });
        return { ok: true, leftAt: now.toISOString() };
    }
};
exports.CircleMembershipService = CircleMembershipService;
exports.CircleMembershipService = CircleMembershipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        circle_policy_service_1.CirclePolicyService,
        outbox_service_1.OutboxService])
], CircleMembershipService);
//# sourceMappingURL=circle-membership.service.js.map