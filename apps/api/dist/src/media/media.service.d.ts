import type { MediaPurpose } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class MediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private maxBytesForPurpose;
    createUploadIntent(userId: string, purpose: MediaPurpose, declaredMime: string, byteSize: number): Promise<{
        id: string;
        uploadToken: string;
        maxBytes: number;
        allowedMimeTypes: string[];
    }>;
    completeUpload(mediaId: string, userId: string, uploadToken: string, input: {
        width?: number;
        height?: number;
        detectedMime?: string;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.MediaStatus;
    }>;
    assertOwnedReadyMedia(userId: string, mediaId: string, purpose: MediaPurpose): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        deletedAt: Date | null;
        updatedAt: Date;
        purpose: import(".prisma/client").$Enums.MediaPurpose;
        objectKey: string;
        ownerUserId: string | null;
        originalFilename: string | null;
        declaredMime: string | null;
        detectedMime: string | null;
        byteSize: bigint | null;
        width: number | null;
        height: number | null;
        verifiedAt: Date | null;
    }>;
    mediaUrl(mediaId: string | null | undefined): string | null;
    serializeMedia(mediaId: string | null | undefined): {
        id: string;
        url: string;
    } | null;
    getReadableAsset(mediaId: string, requesterId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        deletedAt: Date | null;
        updatedAt: Date;
        purpose: import(".prisma/client").$Enums.MediaPurpose;
        objectKey: string;
        ownerUserId: string | null;
        originalFilename: string | null;
        declaredMime: string | null;
        detectedMime: string | null;
        byteSize: bigint | null;
        width: number | null;
        height: number | null;
        verifiedAt: Date | null;
    }>;
}
