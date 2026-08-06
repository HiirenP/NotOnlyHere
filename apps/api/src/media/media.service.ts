import { randomBytes } from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { MediaPurpose } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const MAX_COVER_BYTES = 5 * 1024 * 1024;

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  private maxBytesForPurpose(purpose: MediaPurpose) {
    return purpose === 'AVATAR' ? MAX_AVATAR_BYTES : MAX_COVER_BYTES;
  }

  createUploadIntent(userId: string, purpose: MediaPurpose, declaredMime: string, byteSize: number) {
    if (!IMAGE_MIME_TYPES.includes(declaredMime)) {
      throw new BadRequestException({
        code: 'INVALID_MIME',
        message: 'Only JPEG, PNG, and WebP images are supported.',
      });
    }

    const maxBytes = this.maxBytesForPurpose(purpose);
    if (byteSize <= 0 || byteSize > maxBytes) {
      throw new BadRequestException({
        code: 'FILE_TOO_LARGE',
        message: `Image must be ${Math.floor(maxBytes / (1024 * 1024))}MB or smaller.`,
      });
    }

    const uploadToken = randomBytes(24).toString('hex');
    const objectKey = `dev/${userId}/${randomBytes(16).toString('hex')}`;

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

  async completeUpload(
    mediaId: string,
    userId: string,
    uploadToken: string,
    input: { width?: number; height?: number; detectedMime?: string },
  ) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id: mediaId } });
    if (!asset || asset.ownerUserId !== userId) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Upload not found.' });
    }
    if (asset.status !== 'PENDING') {
      return { id: asset.id, status: asset.status };
    }

    if (!uploadToken || uploadToken.length < 16) {
      throw new BadRequestException({ code: 'INVALID_TOKEN', message: 'Invalid upload token.' });
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

  async assertOwnedReadyMedia(userId: string, mediaId: string, purpose: MediaPurpose) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id: mediaId } });
    if (!asset || asset.ownerUserId !== userId || asset.status !== 'READY') {
      throw new BadRequestException({
        code: 'INVALID_MEDIA',
        message: 'Media is not ready for use.',
      });
    }
    if (asset.purpose !== purpose) {
      throw new BadRequestException({
        code: 'INVALID_MEDIA_PURPOSE',
        message: 'Media purpose does not match.',
      });
    }
    return asset;
  }

  mediaUrl(mediaId: string | null | undefined) {
    if (!mediaId) return null;
    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    return `${apiUrl}/api/v1/media/${mediaId}/file`;
  }

  serializeMedia(mediaId: string | null | undefined) {
    if (!mediaId) return null;
    return { id: mediaId, url: this.mediaUrl(mediaId)! };
  }

  async getReadableAsset(mediaId: string, requesterId: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id: mediaId } });
    if (!asset || asset.status !== 'READY') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Media not found.' });
    }

    const ownerProfile = await this.prisma.profile.findFirst({
      where: {
        OR: [{ avatarMediaId: mediaId }, { coverMediaId: mediaId }],
      },
    });

    if (asset.ownerUserId === requesterId) return asset;
    if (ownerProfile) return asset;

    throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Media is not accessible.' });
  }
}
