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
exports.ConnectionService = void 0;
const common_1 = require("@nestjs/common");
const block_service_1 = require("./block.service");
const activity_service_1 = require("../activity/activity.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ConnectionService = class ConnectionService {
    prisma;
    blocks;
    activity;
    constructor(prisma, blocks, activity) {
        this.prisma = prisma;
        this.blocks = blocks;
        this.activity = activity;
    }
    async findPairConnection(userA, userB) {
        return this.prisma.connection.findFirst({
            where: {
                OR: [
                    { requesterId: userA, addresseeId: userB },
                    { requesterId: userB, addresseeId: userA },
                ],
            },
            include: {
                requester: { include: { profile: true } },
                addressee: { include: { profile: true } },
            },
        });
    }
    async listConnections(userId, status) {
        const connections = await this.prisma.connection.findMany({
            where: {
                ...(status ? { status } : {}),
                OR: [{ requesterId: userId }, { addresseeId: userId }],
            },
            include: {
                requester: { include: { profile: true } },
                addressee: { include: { profile: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return connections.map((connection) => this.serialize(connection, userId));
    }
    async getConnectionContext(viewerId, targetUserId) {
        if (viewerId === targetUserId) {
            return {
                connectionStatus: null,
                connectionId: null,
                isBlocked: false,
                isBlockedBy: false,
                canConnect: false,
                canMessage: false,
            };
        }
        const [connection, isBlockedEitherWay, hasBlocked, isBlockedBy] = await Promise.all([
            this.findPairConnection(viewerId, targetUserId),
            this.blocks.isBlockedEitherWay(viewerId, targetUserId),
            this.blocks.hasBlocked(viewerId, targetUserId),
            this.blocks.hasBlocked(targetUserId, viewerId),
        ]);
        const connectionStatus = connection?.status ?? null;
        const accepted = connectionStatus === 'ACCEPTED';
        return {
            connectionStatus,
            connectionId: connection?.id ?? null,
            isBlocked: isBlockedEitherWay,
            isBlockedBy,
            canConnect: !isBlockedEitherWay && !accepted && connectionStatus !== 'PENDING',
            canMessage: accepted && !isBlockedEitherWay,
        };
    }
    async sendRequest(requesterId, addresseeUsername) {
        const addressee = await this.prisma.user.findFirst({
            where: {
                status: 'ACTIVE',
                profile: { username: addresseeUsername.toLowerCase() },
            },
            include: { profile: true },
        });
        if (!addressee?.profile) {
            throw new common_1.NotFoundException({ code: 'USER_NOT_FOUND', message: 'Member not found.' });
        }
        if (addressee.id === requesterId) {
            throw new common_1.BadRequestException({
                code: 'SELF_CONNECTION',
                message: 'You cannot connect with yourself.',
            });
        }
        if (await this.blocks.isBlockedEitherWay(requesterId, addressee.id)) {
            throw new common_1.ForbiddenException({
                code: 'BLOCKED',
                message: 'Connection is not available.',
            });
        }
        const existing = await this.findPairConnection(requesterId, addressee.id);
        if (existing) {
            if (existing.status === 'ACCEPTED') {
                return this.serialize(existing, requesterId);
            }
            if (existing.status === 'PENDING') {
                if (existing.requesterId === addressee.id && existing.addresseeId === requesterId) {
                    return this.acceptConnection(existing.id, requesterId);
                }
                return this.serialize(existing, requesterId);
            }
        }
        const created = await this.prisma.connection.create({
            data: {
                requesterId,
                addresseeId: addressee.id,
                status: 'PENDING',
            },
            include: {
                requester: { include: { profile: true } },
                addressee: { include: { profile: true } },
            },
        });
        return this.serialize(created, requesterId);
    }
    async acceptConnection(connectionId, userId) {
        const connection = await this.prisma.connection.findUnique({
            where: { id: connectionId },
            include: {
                requester: { include: { profile: true } },
                addressee: { include: { profile: true } },
            },
        });
        if (!connection) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Connection not found.' });
        }
        if (connection.addresseeId !== userId) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Only the recipient can accept.' });
        }
        if (connection.status === 'ACCEPTED') {
            return this.serialize(connection, userId);
        }
        if (connection.status !== 'PENDING') {
            throw new common_1.BadRequestException({ code: 'INVALID_STATE', message: 'Connection cannot be accepted.' });
        }
        if (await this.blocks.isBlockedEitherWay(connection.requesterId, connection.addresseeId)) {
            throw new common_1.ForbiddenException({ code: 'BLOCKED', message: 'Connection is not available.' });
        }
        const now = new Date();
        const updated = await this.prisma.connection.update({
            where: { id: connection.id },
            data: { status: 'ACCEPTED', respondedAt: now },
            include: {
                requester: { include: { profile: true } },
                addressee: { include: { profile: true } },
            },
        });
        await Promise.all([
            this.activity.recordConnectionAccepted(updated.requesterId, updated.addressee.profile.displayName),
            this.activity.recordConnectionAccepted(updated.addresseeId, updated.requester.profile.displayName),
        ]);
        return this.serialize(updated, userId);
    }
    async removeConnection(connectionId, userId) {
        const connection = await this.prisma.connection.findUnique({ where: { id: connectionId } });
        if (!connection) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Connection not found.' });
        }
        if (connection.requesterId !== userId && connection.addresseeId !== userId) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Not allowed.' });
        }
        await this.prisma.connection.delete({ where: { id: connectionId } });
        return { ok: true };
    }
    countAcceptedConnections(userId) {
        return this.prisma.connection.count({
            where: {
                status: 'ACCEPTED',
                OR: [{ requesterId: userId }, { addresseeId: userId }],
            },
        });
    }
    serialize(connection, viewerId) {
        const direction = connection.status === 'ACCEPTED'
            ? 'connected'
            : connection.requesterId === viewerId
                ? 'outgoing'
                : 'incoming';
        return {
            id: connection.id,
            status: connection.status,
            requester: {
                id: connection.requester.id,
                username: connection.requester.profile?.username ?? 'member',
                displayName: connection.requester.profile?.displayName ?? 'Member',
                avatar: null,
            },
            addressee: {
                id: connection.addressee.id,
                username: connection.addressee.profile?.username ?? 'member',
                displayName: connection.addressee.profile?.displayName ?? 'Member',
                avatar: null,
            },
            createdAt: connection.createdAt.toISOString(),
            respondedAt: connection.respondedAt?.toISOString() ?? null,
            direction,
        };
    }
};
exports.ConnectionService = ConnectionService;
exports.ConnectionService = ConnectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        block_service_1.BlockService,
        activity_service_1.ActivityService])
], ConnectionService);
//# sourceMappingURL=connection.service.js.map