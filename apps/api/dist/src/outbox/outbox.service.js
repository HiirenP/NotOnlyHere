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
exports.OutboxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OutboxService = class OutboxService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    client(tx) {
        return tx ?? this.prisma;
    }
    async emitNoop(aggregateId, message) {
        return this.prisma.outboxEvent.create({
            data: {
                aggregateType: 'platform',
                aggregateId,
                eventType: 'platform.noop',
                payload: {
                    message,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitEmailVerification(userId, email, rawToken, tx) {
        const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: 'user',
                aggregateId: userId,
                eventType: 'email.verification',
                payload: {
                    email,
                    verifyUrl: `${webUrl}/verify-email?token=${rawToken}`,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitPasswordReset(userId, email, rawToken, tx) {
        const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: 'user',
                aggregateId: userId,
                eventType: 'email.password_reset',
                payload: {
                    email,
                    resetUrl: `${webUrl}/reset-password?token=${rawToken}`,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitAccountExport(userId, exportId, tx) {
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: 'user',
                aggregateId: userId,
                eventType: 'account.export',
                payload: {
                    exportId,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitAccountDeletion(userId, dueAt, tx) {
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: 'user',
                aggregateId: userId,
                eventType: 'account.deletion',
                payload: {
                    dueAt,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitCircleMembershipRequested(circleId, userId, tx) {
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: 'circle',
                aggregateId: circleId,
                eventType: 'circle.membership_requested',
                payload: {
                    circleId,
                    userId,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitCircleInviteReceived(circleId, inviteId, inviteeUserId, tx) {
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: 'circle',
                aggregateId: circleId,
                eventType: 'circle.invite_received',
                payload: {
                    circleId,
                    inviteId,
                    inviteeUserId,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitNotificationEmail(notificationId, recipientUserId, eventType, tx) {
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: 'notification',
                aggregateId: notificationId,
                eventType: 'notification.email',
                payload: {
                    notificationId,
                    recipientUserId,
                    eventType,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async emitModerationEvaluate(aggregateId, payload, tx) {
        return this.client(tx).outboxEvent.create({
            data: {
                aggregateType: payload.postId ? 'post' : 'comment',
                aggregateId,
                eventType: 'moderation.evaluate',
                payload: {
                    ...payload,
                    emittedAt: new Date().toISOString(),
                },
            },
        });
    }
    async claimNextBatch(workerId, limit = 10) {
        return this.prisma.$transaction(async (tx) => {
            const events = await tx.$queryRaw `SELECT id FROM outbox_events WHERE status = 'PENDING' AND available_at <= NOW() ORDER BY available_at, id FOR UPDATE SKIP LOCKED LIMIT ${limit}`;
            const ids = events.map((e) => e.id);
            if (ids.length === 0)
                return [];
            await tx.outboxEvent.updateMany({
                where: { id: { in: ids } },
                data: {
                    status: 'PROCESSING',
                    lockedAt: new Date(),
                    lockedBy: workerId,
                },
            });
            return tx.outboxEvent.findMany({ where: { id: { in: ids } } });
        });
    }
    async markDelivered(eventId, consumer) {
        await this.prisma.$transaction([
            this.prisma.outboxEvent.update({
                where: { id: eventId },
                data: { status: 'DELIVERED', deliveredAt: new Date(), lockedAt: null, lockedBy: null },
            }),
            this.prisma.outboxConsumption.create({
                data: {
                    consumer,
                    eventId,
                    processedAt: new Date(),
                    result: 'ok',
                },
            }),
        ]);
    }
};
exports.OutboxService = OutboxService;
exports.OutboxService = OutboxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboxService);
//# sourceMappingURL=outbox.service.js.map