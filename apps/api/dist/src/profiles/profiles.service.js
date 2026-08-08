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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth/auth.constants");
const activity_service_1 = require("../activity/activity.service");
const block_service_1 = require("../social/block.service");
const connection_service_1 = require("../social/connection.service");
const media_service_1 = require("../media/media.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfilesService = class ProfilesService {
    prisma;
    media;
    blocks;
    connections;
    activity;
    constructor(prisma, media, blocks, connections, activity) {
        this.prisma = prisma;
        this.media = media;
        this.blocks = blocks;
        this.connections = connections;
        this.activity = activity;
    }
    async getMyProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user?.profile) {
            throw new common_1.NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
        }
        return this.buildProfileResponse(user, user.profile, userId);
    }
    async getProfileByUsername(username, viewerId) {
        const normalized = (0, auth_constants_1.normalizeUsername)(username);
        const user = await this.prisma.user.findFirst({
            where: {
                status: 'ACTIVE',
                profile: { username: normalized },
            },
            include: { profile: true },
        });
        if (!user?.profile) {
            throw new common_1.NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
        }
        if (user.id !== viewerId) {
            const blocked = await this.blocks.isBlockedEitherWay(viewerId, user.id);
            if (blocked) {
                throw new common_1.NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
            }
        }
        return this.buildProfileResponse(user, user.profile, viewerId);
    }
    async updateMyProfile(userId, input) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
        }
        if (input.version !== profile.version) {
            throw new common_1.ConflictException({
                code: 'VERSION_CONFLICT',
                message: 'Profile was updated elsewhere. Refresh and try again.',
            });
        }
        const data = { version: { increment: 1 } };
        if (input.displayName !== undefined) {
            const trimmed = input.displayName.trim();
            if (trimmed.length < 1 || trimmed.length > 80) {
                throw new common_1.BadRequestException({
                    code: 'INVALID_DISPLAY_NAME',
                    message: 'Display name must be 1–80 characters.',
                });
            }
            data.displayName = trimmed;
        }
        if (input.username !== undefined) {
            const username = (0, auth_constants_1.normalizeUsername)(input.username);
            if (!(0, auth_constants_1.isValidUsername)(username)) {
                throw new common_1.BadRequestException({
                    code: 'INVALID_USERNAME',
                    message: 'Username must be 3–30 characters: lowercase letters, numbers, underscore.',
                });
            }
            const taken = await this.prisma.profile.findFirst({
                where: { username, NOT: { userId } },
            });
            if (taken) {
                throw new common_1.ConflictException({ code: 'USERNAME_TAKEN', message: 'Username is already taken.' });
            }
            data.username = username;
        }
        if (input.bio !== undefined) {
            if (input.bio && input.bio.length > 500) {
                throw new common_1.BadRequestException({
                    code: 'INVALID_BIO',
                    message: 'Bio must be 500 characters or fewer.',
                });
            }
            data.bio = input.bio;
        }
        if (input.avatarMediaId !== undefined) {
            if (input.avatarMediaId) {
                await this.media.assertOwnedReadyMedia(userId, input.avatarMediaId, 'AVATAR');
            }
            data.avatarMediaId = input.avatarMediaId;
        }
        if (input.coverMediaId !== undefined) {
            if (input.coverMediaId) {
                await this.media.assertOwnedReadyMedia(userId, input.coverMediaId, 'PROFILE_COVER');
            }
            data.coverMediaId = input.coverMediaId;
        }
        const updated = await this.prisma.profile.update({
            where: { userId },
            data,
        });
        await this.activity.recordProfileUpdated(userId);
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: { profile: true },
        });
        return this.buildProfileResponse(user, updated, userId);
    }
    async buildProfileResponse(user, profile, viewerId) {
        const [connectionCount, viewer] = await Promise.all([
            this.connections.countAcceptedConnections(profile.userId),
            this.connections.getConnectionContext(viewerId, profile.userId),
        ]);
        return {
            userId: profile.userId,
            username: profile.username,
            displayName: profile.displayName,
            bio: profile.bio,
            joinDate: user.createdAt.toISOString(),
            avatar: this.media.serializeMedia(profile.avatarMediaId),
            cover: this.media.serializeMedia(profile.coverMediaId),
            connectionCount,
            version: profile.version,
            viewer: {
                isSelf: viewerId === profile.userId,
                ...viewer,
            },
        };
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        media_service_1.MediaService,
        block_service_1.BlockService,
        connection_service_1.ConnectionService,
        activity_service_1.ActivityService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map