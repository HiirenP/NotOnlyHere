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
exports.BroadcastsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const admin_permissions_service_1 = require("../admin/admin-permissions.service");
const notifications_service_1 = require("./notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
let BroadcastsService = class BroadcastsService {
    prisma;
    permissions;
    notifications;
    constructor(prisma, permissions, notifications) {
        this.prisma = prisma;
        this.permissions = permissions;
        this.notifications = notifications;
    }
    async create(adminId, input) {
        const allowed = await this.permissions.hasPermission(adminId, 'broadcast.create');
        if (!allowed) {
            throw new common_1.BadRequestException({ code: 'FORBIDDEN', message: 'broadcast.create permission required.' });
        }
        const existing = await this.prisma.adminBroadcast.findFirst({
            where: { createdByUserId: adminId, idempotencyKey: input.idempotencyKey },
        });
        if (existing)
            return this.getSummary(existing.id, adminId);
        const recipients = await this.prisma.user.findMany({
            where: { status: 'ACTIVE' },
            select: { id: true },
        });
        const broadcast = await this.prisma.$transaction(async (tx) => {
            const created = await tx.adminBroadcast.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    createdByUserId: adminId,
                    title: input.title.trim(),
                    body: input.body.trim(),
                    audienceType: input.audienceType,
                    audienceFilter: {},
                    status: 'PROCESSING',
                    idempotencyKey: input.idempotencyKey,
                    startedAt: new Date(),
                    recipientCount: recipients.length,
                },
            });
            if (recipients.length > 0) {
                await tx.broadcastRecipient.createMany({
                    data: recipients.map((user) => ({
                        broadcastId: created.id,
                        userId: user.id,
                        status: 'PENDING',
                    })),
                });
            }
            return created;
        });
        let sent = 0;
        for (const recipient of recipients) {
            const notification = await this.notifications.create({
                recipientUserId: recipient.id,
                eventType: 'broadcast.sent',
                titleKey: 'notification.broadcast.title',
                bodyKey: 'notification.broadcast.body',
                templateParams: { title: broadcast.title, body: broadcast.body },
                sendEmail: false,
            });
            await this.prisma.broadcastRecipient.update({
                where: { broadcastId_userId: { broadcastId: broadcast.id, userId: recipient.id } },
                data: { notificationId: notification.id, status: 'SENT' },
            });
            sent += 1;
        }
        const completed = await this.prisma.adminBroadcast.update({
            where: { id: broadcast.id },
            data: { status: 'COMPLETED', completedAt: new Date(), sentCount: sent },
        });
        return this.serializeSummary(completed);
    }
    async get(broadcastId, adminId) {
        const allowed = await this.permissions.hasPermission(adminId, 'broadcast.read');
        if (!allowed) {
            throw new common_1.BadRequestException({ code: 'FORBIDDEN', message: 'broadcast.read permission required.' });
        }
        const broadcast = await this.prisma.adminBroadcast.findUnique({ where: { id: broadcastId } });
        if (!broadcast)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Broadcast not found.' });
        return this.serializeSummary(broadcast);
    }
    async getSummary(broadcastId, adminId) {
        const broadcast = await this.prisma.adminBroadcast.findUnique({ where: { id: broadcastId } });
        if (!broadcast)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Broadcast not found.' });
        return this.serializeSummary(broadcast);
    }
    serializeSummary(broadcast) {
        return {
            id: broadcast.id,
            title: broadcast.title,
            body: broadcast.body,
            status: broadcast.status,
            recipientCount: broadcast.recipientCount,
            sentCount: broadcast.sentCount,
            failedCount: broadcast.failedCount,
            createdAt: broadcast.createdAt.toISOString(),
            completedAt: broadcast.completedAt?.toISOString() ?? null,
        };
    }
};
exports.BroadcastsService = BroadcastsService;
exports.BroadcastsService = BroadcastsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        admin_permissions_service_1.AdminPermissionsService,
        notifications_service_1.NotificationsService])
], BroadcastsService);
//# sourceMappingURL=broadcasts.service.js.map