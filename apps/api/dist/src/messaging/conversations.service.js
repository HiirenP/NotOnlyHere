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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const messaging_policy_service_1 = require("./messaging-policy.service");
const messaging_constants_1 = require("./messaging.constants");
const prisma_service_1 = require("../prisma/prisma.service");
let ConversationsService = class ConversationsService {
    prisma;
    policy;
    constructor(prisma, policy) {
        this.prisma = prisma;
        this.policy = policy;
    }
    async list(userId) {
        const rows = await this.prisma.conversationParticipant.findMany({
            where: { userId, leftAt: null },
            include: {
                conversation: {
                    include: {
                        lastMessage: true,
                        participants: { include: { user: { include: { profile: true } } } },
                    },
                },
            },
            orderBy: { conversation: { lastMessageAt: 'desc' } },
        });
        return rows.map((row) => {
            const other = row.conversation.participants.find((p) => p.userId !== userId);
            return {
                id: row.conversationId,
                otherUser: other
                    ? {
                        id: other.userId,
                        username: other.user.profile?.username ?? 'member',
                        displayName: other.user.profile?.displayName ?? 'Member',
                    }
                    : null,
                lastMessage: row.conversation.lastMessage
                    ? {
                        id: row.conversation.lastMessage.id,
                        body: row.conversation.lastMessage.body,
                        createdAt: row.conversation.lastMessage.createdAt.toISOString(),
                    }
                    : null,
                updatedAt: row.conversation.lastMessageAt?.toISOString() ?? row.conversation.createdAt.toISOString(),
            };
        });
    }
    async createOrGet(userId, otherUserId) {
        await this.policy.assertCanMessage(userId, otherUserId);
        const pairKey = (0, messaging_constants_1.buildPairKey)(userId, otherUserId);
        const existing = await this.prisma.conversation.findUnique({ where: { pairKey } });
        if (existing) {
            await this.policy.assertParticipant(existing.id, userId);
            return { id: existing.id, created: false };
        }
        const conversation = await this.prisma.$transaction(async (tx) => {
            const created = await tx.conversation.create({
                data: { pairKey, kind: 'DIRECT' },
            });
            await tx.conversationParticipant.createMany({
                data: [
                    { conversationId: created.id, userId },
                    { conversationId: created.id, userId: otherUserId },
                ],
            });
            return created;
        });
        return { id: conversation.id, created: true };
    }
    async get(conversationId, userId) {
        await this.policy.assertParticipant(conversationId, userId);
        const conversation = await this.prisma.conversation.findUniqueOrThrow({
            where: { id: conversationId },
            include: { participants: { include: { user: { include: { profile: true } } } } },
        });
        const other = conversation.participants.find((p) => p.userId !== userId);
        return {
            id: conversation.id,
            otherUser: other
                ? {
                    id: other.userId,
                    username: other.user.profile?.username ?? 'member',
                    displayName: other.user.profile?.displayName ?? 'Member',
                }
                : null,
            lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
        };
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        messaging_policy_service_1.MessagingPolicyService])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map