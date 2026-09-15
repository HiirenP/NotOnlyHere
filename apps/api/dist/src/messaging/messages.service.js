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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const messaging_policy_service_1 = require("./messaging-policy.service");
const notifications_service_1 = require("../notifications/notifications.service");
const messaging_constants_1 = require("./messaging.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    policy;
    notifications;
    constructor(prisma, policy, notifications) {
        this.prisma = prisma;
        this.policy = policy;
        this.notifications = notifications;
    }
    async list(conversationId, userId, options) {
        await this.policy.assertParticipant(conversationId, userId);
        const limit = Math.min(Math.max(options.limit ?? 30, 1), 100);
        let cursor = null;
        if (options.cursor) {
            try {
                cursor = (0, messaging_constants_1.decodeMessageCursor)(options.cursor);
            }
            catch {
                throw new common_1.BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid cursor.' });
            }
        }
        const messages = await this.prisma.message.findMany({
            where: {
                conversationId,
                status: 'ACTIVE',
                ...(cursor
                    ? {
                        OR: [
                            { createdAt: { lt: cursor.createdAt } },
                            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
                        ],
                    }
                    : {}),
            },
            include: { reactions: true },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
        });
        const page = messages.slice(0, limit).reverse();
        const oldest = page[0];
        return {
            items: page.map((message) => this.serialize(message, userId)),
            nextCursor: messages.length > limit && oldest
                ? (0, messaging_constants_1.encodeMessageCursor)(oldest.createdAt, oldest.id)
                : null,
        };
    }
    async send(conversationId, senderId, input) {
        await this.policy.assertParticipant(conversationId, senderId);
        const body = input.body.trim();
        if (!body)
            throw new common_1.BadRequestException({ code: 'EMPTY_MESSAGE', message: 'Message cannot be empty.' });
        if (body.length > messaging_constants_1.MESSAGE_BODY_MAX) {
            throw new common_1.BadRequestException({ code: 'MESSAGE_TOO_LONG', message: 'Message is too long.' });
        }
        const clientMessageId = input.clientMessageId || (0, crypto_1.randomUUID)();
        const existing = await this.prisma.message.findFirst({
            where: { senderUserId: senderId, clientMessageId },
            include: { reactions: true },
        });
        if (existing)
            return this.serialize(existing, senderId);
        const message = await this.prisma.$transaction(async (tx) => {
            const created = await tx.message.create({
                data: {
                    conversationId,
                    senderUserId: senderId,
                    clientMessageId,
                    body,
                },
                include: { reactions: true },
            });
            await tx.conversation.update({
                where: { id: conversationId },
                data: { lastMessageId: created.id, lastMessageAt: created.createdAt },
            });
            return created;
        });
        const participants = await this.prisma.conversationParticipant.findMany({
            where: { conversationId, leftAt: null },
        });
        const recipient = participants.find((p) => p.userId !== senderId);
        if (recipient) {
            await this.notifications.create({
                recipientUserId: recipient.userId,
                eventType: 'message.received',
                titleKey: 'notification.message.title',
                bodyKey: 'notification.message.body',
                conversationId,
                actorUserId: senderId,
                templateParams: { preview: body.slice(0, 80) },
            });
        }
        return this.serialize(message, senderId);
    }
    assertEmoji(emoji) {
        if (!messaging_constants_1.ALLOWED_MESSAGE_EMOJI.includes(emoji)) {
            throw new common_1.BadRequestException({ code: 'INVALID_EMOJI', message: 'Emoji not allowed.' });
        }
        return emoji;
    }
    async setReaction(messageId, userId, emoji) {
        const message = await this.prisma.message.findUnique({ where: { id: messageId } });
        if (!message || message.status !== 'ACTIVE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Message not found.' });
        }
        await this.policy.assertParticipant(message.conversationId, userId);
        this.assertEmoji(emoji);
        await this.prisma.messageReaction.upsert({
            where: { messageId_userId_emoji: { messageId, userId, emoji } },
            update: {},
            create: { messageId, userId, emoji },
        });
        return this.getReactionSummary(messageId, userId);
    }
    async removeReaction(messageId, userId, emoji) {
        const message = await this.prisma.message.findUnique({ where: { id: messageId } });
        if (!message)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Message not found.' });
        await this.policy.assertParticipant(message.conversationId, userId);
        await this.prisma.messageReaction.deleteMany({ where: { messageId, userId, emoji } });
        return this.getReactionSummary(messageId, userId);
    }
    async getReactionSummary(messageId, viewerId) {
        const reactions = await this.prisma.messageReaction.findMany({ where: { messageId } });
        const counts = {};
        const viewer = [];
        for (const reaction of reactions) {
            counts[reaction.emoji] = (counts[reaction.emoji] ?? 0) + 1;
            if (reaction.userId === viewerId)
                viewer.push(reaction.emoji);
        }
        return { counts, viewerReactions: viewer };
    }
    serialize(message, viewerId) {
        const counts = {};
        const viewerReactions = [];
        for (const reaction of message.reactions) {
            counts[reaction.emoji] = (counts[reaction.emoji] ?? 0) + 1;
            if (reaction.userId === viewerId)
                viewerReactions.push(reaction.emoji);
        }
        return {
            id: message.id,
            conversationId: message.conversationId,
            senderUserId: message.senderUserId,
            clientMessageId: message.clientMessageId,
            body: message.body,
            createdAt: message.createdAt.toISOString(),
            reactions: { counts, viewerReactions },
            viewer: { isSender: message.senderUserId === viewerId },
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        messaging_policy_service_1.MessagingPolicyService,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map