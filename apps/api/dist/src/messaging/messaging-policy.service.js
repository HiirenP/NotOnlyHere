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
exports.MessagingPolicyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagingPolicyService = class MessagingPolicyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canMessage(userId, otherUserId) {
        if (userId === otherUserId)
            return false;
        const block = await this.prisma.userBlock.findFirst({
            where: {
                OR: [
                    { blockerId: userId, blockedId: otherUserId },
                    { blockerId: otherUserId, blockedId: userId },
                ],
            },
        });
        if (block)
            return false;
        const connection = await this.prisma.connection.findFirst({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { requesterId: userId, addresseeId: otherUserId },
                    { requesterId: otherUserId, addresseeId: userId },
                ],
            },
        });
        return Boolean(connection);
    }
    async assertParticipant(conversationId, userId) {
        const participant = await this.prisma.conversationParticipant.findUnique({
            where: { conversationId_userId: { conversationId, userId } },
        });
        if (!participant || participant.leftAt) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Conversation not found.' });
        }
        return participant;
    }
    async assertCanMessage(userId, otherUserId) {
        const allowed = await this.canMessage(userId, otherUserId);
        if (!allowed) {
            throw new common_1.ForbiddenException({
                code: 'NOT_CONNECTED',
                message: 'Direct messages require an accepted connection and no block.',
            });
        }
    }
};
exports.MessagingPolicyService = MessagingPolicyService;
exports.MessagingPolicyService = MessagingPolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagingPolicyService);
//# sourceMappingURL=messaging-policy.service.js.map