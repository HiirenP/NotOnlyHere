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
exports.MediaService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const MAX_COVER_BYTES = 5 * 1024 * 1024;
let MediaService = class MediaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    maxBytesForPurpose(purpose) {
        return purpose === 'AVATAR' ? MAX_AVATAR_BYTES : MAX_COVER_BYTES;
    }
    createUploadIntent(userId, purpose, declaredMime, byteSize) {
        if (!IMAGE_MIME_TYPES.includes(declaredMime)) {
            throw new common_1.BadRequestException({
                code: 'INVALID_MIME',
                message: 'Only JPEG, PNG, and WebP images are supported.',
            });
        }
        const maxBytes = this.maxBytesForPurpose(purpose);
        if (byteSize <= 0 || byteSize > maxBytes) {
            throw new common_1.BadRequestException({
                code: 'FILE_TOO_LARGE',
                message: `Image must be ${Math.floor(maxBytes / (1024 * 1024))}MB or smaller.`,
            });
        }
        const uploadToken = (0, crypto_1.randomBytes)(24).toString('hex');
        const objectKey = `dev/${userId}/${(0, crypto_1.randomBytes)(16).toString('hex')}`;
        return this.prisma.mediaAsset.create({
            data: {
                ownerUserId: userId,
                purpose,
                status: 'PENDING',
                objectKey,
                declaredMime,
                byteSize: BigInt(byteSize),
                originalFilename: `${purpose.toLowerCase()}.img`,
            },
        }).then((asset) => ({
            id: asset.id,
            uploadToken,
            maxBytes,
            allowedMimeTypes: IMAGE_MIME_TYPES,
        }));
    }
    async completeUpload(mediaId, userId, uploadToken, input) {
        const asset = await this.prisma.mediaAsset.findUnique({ where: { id: mediaId } });
        if (!asset || asset.ownerUserId !== userId) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Upload not found.' });
        }
        if (asset.status !== 'PENDING') {
            return { id: asset.id, status: asset.status };
        }
        if (!uploadToken || uploadToken.length < 16) {
            throw new common_1.BadRequestException({ code: 'INVALID_TOKEN', message: 'Invalid upload token.' });
        }
        const now = new Date();
        const updated = await this.prisma.mediaAsset.update({
            where: { id: mediaId },
            data: {
                status: 'READY',
                detectedMime: input.detectedMime ?? asset.declaredMime,
                width: input.width,
                height: input.height,
                verifiedAt: now,
            },
        });
        return { id: updated.id, status: updated.status };
    }
    async assertOwnedReadyMedia(userId, mediaId, purpose) {
        const asset = await this.prisma.mediaAsset.findUnique({ where: { id: mediaId } });
        if (!asset || asset.ownerUserId !== userId || asset.status !== 'READY') {
            throw new common_1.BadRequestException({
                code: 'INVALID_MEDIA',
                message: 'Media is not ready for use.',
            });
        }
        if (asset.purpose !== purpose) {
            throw new common_1.BadRequestException({
                code: 'INVALID_MEDIA_PURPOSE',
                message: 'Media purpose does not match.',
            });
        }
        return asset;
    }
    mediaUrl(mediaId) {
        if (!mediaId)
            return null;
        const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
        return `${apiUrl}/api/v1/media/${mediaId}/file`;
    }
    serializeMedia(mediaId) {
        if (!mediaId)
            return null;
        return { id: mediaId, url: this.mediaUrl(mediaId) };
    }
    async getReadableAsset(mediaId, requesterId) {
        const asset = await this.prisma.mediaAsset.findUnique({ where: { id: mediaId } });
        if (!asset || asset.status !== 'READY') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Media not found.' });
        }
        const ownerProfile = await this.prisma.profile.findFirst({
            where: {
                OR: [{ avatarMediaId: mediaId }, { coverMediaId: mediaId }],
            },
        });
        if (asset.ownerUserId === requesterId)
            return asset;
        if (ownerProfile)
            return asset;
        throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Media is not accessible.' });
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map