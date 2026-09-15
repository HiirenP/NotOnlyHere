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
exports.NotificationsService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const crypto_2 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const outbox_service_1 = require("../outbox/outbox.service");
let NotificationsService = class NotificationsService {
    prisma;
    outbox;
    constructor(prisma, outbox) {
        this.prisma = prisma;
        this.outbox = outbox;
    }
    async create(input, tx) {
        const client = tx ?? this.prisma;
        const notification = await client.notification.create({
            data: {
                id: (0, crypto_2.randomUUID)(),
                recipientUserId: input.recipientUserId,
                eventType: input.eventType,
                actorUserId: input.actorUserId ?? null,
                postId: input.postId ?? null,
                commentId: input.commentId ?? null,
                connectionId: input.connectionId ?? null,
                circleId: input.circleId ?? null,
                circleInviteId: input.circleInviteId ?? null,
                conversationId: input.conversationId ?? null,
                eventId: input.eventId ?? null,
                targetUserId: input.targetUserId ?? null,
                titleKey: input.titleKey,
                bodyKey: input.bodyKey,
                templateParams: (input.templateParams ?? {}),
            },
        });
        if (input.sendEmail !== false) {
            await this.outbox.emitNotificationEmail(notification.id, input.recipientUserId, input.eventType, tx);
        }
        return this.serialize(notification);
    }
    async list(userId, options) {
        const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
        let cursorDate;
        let cursorId;
        if (options.cursor) {
            const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
            cursorDate = new Date(createdAt);
            cursorId = id;
        }
        const rows = await this.prisma.notification.findMany({
            where: {
                recipientUserId: userId,
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
        });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        const unreadCount = await this.prisma.notification.count({
            where: { recipientUserId: userId, readAt: null },
        });
        return {
            unreadCount,
            items: page.map((row) => this.serialize(row)),
            nextCursor: rows.length > limit && last
                ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
                : null,
        };
    }
    async markRead(notificationId, userId) {
        const notification = await this.prisma.notification.findFirst({
            where: { id: notificationId, recipientUserId: userId },
        });
        if (!notification)
            return { ok: false };
        if (!notification.readAt) {
            await this.prisma.notification.update({
                where: { id: notificationId },
                data: { readAt: new Date() },
            });
        }
        return { ok: true };
    }
    async markAllRead(userId) {
        await this.prisma.notification.updateMany({
            where: { recipientUserId: userId, readAt: null },
            data: { readAt: new Date() },
        });
        return { ok: true };
    }
    hashEmail(email) {
        return (0, crypto_1.createHash)('sha256').update(email.toLowerCase()).digest();
    }
    serialize(notification) {
        return {
            id: notification.id,
            eventType: notification.eventType,
            titleKey: notification.titleKey,
            bodyKey: notification.bodyKey,
            templateParams: notification.templateParams,
            readAt: notification.readAt?.toISOString() ?? null,
            createdAt: notification.createdAt.toISOString(),
            targets: {
                actorUserId: notification.actorUserId,
                postId: notification.postId,
                commentId: notification.commentId,
                connectionId: notification.connectionId,
                circleId: notification.circleId,
                conversationId: notification.conversationId,
                targetUserId: notification.targetUserId,
            },
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbox_service_1.OutboxService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map