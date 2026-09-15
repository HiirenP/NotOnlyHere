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
exports.BlockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlockService = class BlockService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async isBlockedEitherWay(userA, userB) {
        if (userA === userB)
            return false;
        const block = await this.prisma.userBlock.findFirst({
            where: {
                OR: [
                    { blockerId: userA, blockedId: userB },
                    { blockerId: userB, blockedId: userA },
                ],
            },
        });
        return Boolean(block);
    }
    async hasBlocked(blockerId, blockedId) {
        const block = await this.prisma.userBlock.findUnique({
            where: { blockerId_blockedId: { blockerId, blockedId } },
        });
        return Boolean(block);
    }
    async listBlocks(userId) {
        return this.prisma.userBlock.findMany({
            where: { blockerId: userId },
            include: {
                blocked: { include: { profile: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async blockUser(blockerId, blockedId) {
        if (blockerId === blockedId) {
            throw new Error('Cannot block yourself');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.userBlock.upsert({
                where: { blockerId_blockedId: { blockerId, blockedId } },
                update: {},
                create: { blockerId, blockedId },
            });
            await tx.connection.deleteMany({
                where: {
                    OR: [
                        { requesterId: blockerId, addresseeId: blockedId },
                        { requesterId: blockedId, addresseeId: blockerId },
                    ],
                },
            });
        });
    }
    async unblockUser(blockerId, blockedId) {
        await this.prisma.userBlock.deleteMany({
            where: { blockerId, blockedId },
        });
    }
    async resolveTargetUser(input) {
        if (input.userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: input.userId },
                include: { profile: true },
            });
            if (!user)
                throw new common_1.NotFoundException({ code: 'USER_NOT_FOUND', message: 'Member not found.' });
            return user;
        }
        if (input.username) {
            const user = await this.prisma.user.findFirst({
                where: { profile: { username: input.username.toLowerCase() } },
                include: { profile: true },
            });
            if (!user)
                throw new common_1.NotFoundException({ code: 'USER_NOT_FOUND', message: 'Member not found.' });
            return user;
        }
        throw new common_1.BadRequestException({ code: 'TARGET_REQUIRED', message: 'userId or username is required.' });
    }
};
exports.BlockService = BlockService;
exports.BlockService = BlockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlockService);
//# sourceMappingURL=block.service.js.map