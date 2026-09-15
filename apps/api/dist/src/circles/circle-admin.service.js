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
exports.CircleAdminService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const audit_service_1 = require("../audit/audit.service");
const outbox_service_1 = require("../outbox/outbox.service");
const prisma_service_1 = require("../prisma/prisma.service");
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);
}
let CircleAdminService = class CircleAdminService {
    prisma;
    outbox;
    audit;
    constructor(prisma, outbox, audit) {
        this.prisma = prisma;
        this.outbox = outbox;
        this.audit = audit;
    }
    async assertCircleAdmin(circleId, userId) {
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
        if (!membership || membership.status !== 'ACTIVE' || membership.role !== 'ADMIN') {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Circle admin access required.' });
        }
        return membership;
    }
    async createCircle(userId, input) {
        const name = input.name.trim();
        if (!name)
            throw new common_1.BadRequestException({ code: 'INVALID_NAME', message: 'Name is required.' });
        const baseSlug = slugify(name) || 'circle';
        const slug = `${baseSlug}-${(0, crypto_1.randomBytes)(3).toString('hex')}`;
        const now = new Date();
        const circle = await this.prisma.$transaction(async (tx) => {
            const created = await tx.circle.create({
                data: {
                    slug,
                    name,
                    description: input.description.trim(),
                    guidelines: input.guidelines.trim(),
                    visibility: input.visibility,
                    joinPolicy: input.joinPolicy,
                    createdByUserId: userId,
                    status: 'ACTIVE',
                    memberCount: 1,
                },
            });
            await tx.circleMember.create({
                data: {
                    circleId: created.id,
                    userId,
                    role: 'ADMIN',
                    status: 'ACTIVE',
                    joinedAt: now,
                },
            });
            return created;
        });
        return circle;
    }
    async updateCircle(circleId, adminId, input) {
        await this.assertCircleAdmin(circleId, adminId);
        const circle = await this.prisma.circle.findUnique({ where: { id: circleId } });
        if (!circle || circle.status === 'ARCHIVED') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle not found.' });
        }
        if (circle.version !== input.version) {
            throw new common_1.ConflictException({ code: 'VERSION_CONFLICT', message: 'Circle was updated elsewhere.' });
        }
        return this.prisma.circle.update({
            where: { id: circleId },
            data: {
                name: input.name?.trim() ?? circle.name,
                description: input.description?.trim() ?? circle.description,
                guidelines: input.guidelines?.trim() ?? circle.guidelines,
                visibility: input.visibility ?? circle.visibility,
                joinPolicy: input.joinPolicy ?? circle.joinPolicy,
                version: { increment: 1 },
            },
        });
    }
    async archiveCircle(circleId, adminId) {
        await this.assertCircleAdmin(circleId, adminId);
        await this.prisma.circle.update({
            where: { id: circleId },
            data: { status: 'ARCHIVED', version: { increment: 1 } },
        });
        return { ok: true };
    }
    async listPendingRequests(circleId, adminId) {
        await this.assertCircleAdmin(circleId, adminId);
        const rows = await this.prisma.circleMember.findMany({
            where: { circleId, status: 'PENDING' },
            include: { user: { include: { profile: true } } },
            orderBy: { requestedAt: 'asc' },
        });
        return rows.map((row) => ({
            userId: row.userId,
            username: row.user.profile?.username ?? 'member',
            displayName: row.user.profile?.displayName ?? 'Member',
            requestedAt: row.requestedAt?.toISOString() ?? null,
        }));
    }
    async approveRequest(circleId, adminId, userId) {
        await this.assertCircleAdmin(circleId, adminId);
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
        if (!membership || membership.status !== 'PENDING') {
            return { ok: true, status: membership?.status ?? 'NONE' };
        }
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            await tx.circleMember.update({
                where: { circleId_userId: { circleId, userId } },
                data: {
                    status: 'ACTIVE',
                    role: 'MEMBER',
                    joinedAt: now,
                    decidedAt: now,
                    decidedByUserId: adminId,
                },
            });
            await tx.circle.update({
                where: { id: circleId },
                data: { memberCount: { increment: 1 } },
            });
        });
        return { ok: true, status: 'ACTIVE' };
    }
    async declineRequest(circleId, adminId, userId) {
        await this.assertCircleAdmin(circleId, adminId);
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
        if (!membership || membership.status !== 'PENDING') {
            return { ok: true, status: membership?.status ?? 'NONE' };
        }
        await this.prisma.circleMember.update({
            where: { circleId_userId: { circleId, userId } },
            data: {
                status: 'DECLINED',
                decidedAt: new Date(),
                decidedByUserId: adminId,
            },
        });
        return { ok: true, status: 'DECLINED' };
    }
    async removeMember(circleId, adminId, userId) {
        await this.assertCircleAdmin(circleId, adminId);
        if (adminId === userId) {
            throw new common_1.BadRequestException({ code: 'CANNOT_REMOVE_SELF', message: 'Use leave instead.' });
        }
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
        if (!membership || membership.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Active member not found.' });
        }
        if (membership.role === 'ADMIN') {
            const adminCount = await this.prisma.circleMember.count({
                where: { circleId, status: 'ACTIVE', role: 'ADMIN' },
            });
            if (adminCount <= 1) {
                throw new common_1.ForbiddenException({ code: 'LAST_ADMIN', message: 'Cannot remove the only Circle Admin.' });
            }
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.circleMember.update({
                where: { circleId_userId: { circleId, userId } },
                data: { status: 'REMOVED', leftAt: new Date(), decidedByUserId: adminId, decidedAt: new Date() },
            });
            await tx.circle.update({
                where: { id: circleId },
                data: { memberCount: { decrement: 1 } },
            });
        });
        return { ok: true };
    }
    async muteMember(circleId, adminId, userId, reason) {
        await this.assertCircleAdmin(circleId, adminId);
        const membership = await this.prisma.circleMember.findUnique({
            where: { circleId_userId: { circleId, userId } },
        });
        if (!membership || membership.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Active member not found.' });
        }
        await this.prisma.circleMute.upsert({
            where: { circleId_mutedUserId: { circleId, mutedUserId: userId } },
            update: { reason: reason?.trim() ?? null, mutedByUserId: adminId },
            create: { circleId, mutedUserId: userId, mutedByUserId: adminId, reason: reason?.trim() ?? null },
        });
        return { ok: true };
    }
    async unmuteMember(circleId, adminId, userId) {
        await this.assertCircleAdmin(circleId, adminId);
        await this.prisma.circleMute.deleteMany({ where: { circleId, mutedUserId: userId } });
        return { ok: true };
    }
    async removeCirclePost(circleId, adminId, postId, reason) {
        await this.assertCircleAdmin(circleId, adminId);
        const trimmed = reason?.trim();
        if (!trimmed || trimmed.length < 8) {
            throw new common_1.BadRequestException({ code: 'REASON_REQUIRED', message: 'Reason of at least 8 characters required.' });
        }
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.circleId !== circleId || post.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Circle post not found.' });
        }
        const now = new Date();
        await this.prisma.post.update({
            where: { id: postId },
            data: { status: 'DELETED', deletedAt: now, body: '[removed by circle admin]', version: { increment: 1 } },
        });
        await this.audit.record({
            actorUserId: adminId,
            action: 'circle.post.remove',
            targetType: 'post',
            targetId: postId,
            result: 'SUCCESS',
            metadata: { circleId, reason: trimmed },
        });
        return { ok: true, deletedAt: now.toISOString() };
    }
};
exports.CircleAdminService = CircleAdminService;
exports.CircleAdminService = CircleAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbox_service_1.OutboxService,
        audit_service_1.AuditService])
], CircleAdminService);
//# sourceMappingURL=circle-admin.service.js.map