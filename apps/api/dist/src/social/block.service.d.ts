import { PrismaService } from '../prisma/prisma.service';
export declare class BlockService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    isBlockedEitherWay(userA: string, userB: string): Promise<boolean>;
    hasBlocked(blockerId: string, blockedId: string): Promise<boolean>;
    listBlocks(userId: string): Promise<({
        blocked: {
            profile: {
                userId: string;
                createdAt: Date;
                version: number;
                updatedAt: Date;
                username: string;
                displayName: string;
                bio: string | null;
                avatarMediaId: string | null;
                coverMediaId: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            email: string;
            status: import(".prisma/client").$Enums.UserStatus;
            emailVerifiedAt: Date | null;
            activatedAt: Date | null;
            ageAttestedAt: Date | null;
            termsVersion: string;
            privacyVersion: string;
            communityGuidelinesVersion: string;
            termsAcceptedAt: Date;
            privacyAcceptedAt: Date;
            communityGuidelinesAcceptedAt: Date;
            locale: string | null;
            timeZone: string | null;
            lastLoginAt: Date | null;
            deletionRequestedAt: Date | null;
            deletionDueAt: Date | null;
            deletedAt: Date | null;
            anonymizedReference: string;
            version: number;
            updatedAt: Date;
        };
    } & {
        createdAt: Date;
        blockerId: string;
        blockedId: string;
    })[]>;
    blockUser(blockerId: string, blockedId: string): Promise<void>;
    unblockUser(blockerId: string, blockedId: string): Promise<void>;
    resolveTargetUser(input: {
        userId?: string;
        username?: string;
    }): Promise<{
        profile: {
            userId: string;
            createdAt: Date;
            version: number;
            updatedAt: Date;
            username: string;
            displayName: string;
            bio: string | null;
            avatarMediaId: string | null;
            coverMediaId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        emailVerifiedAt: Date | null;
        activatedAt: Date | null;
        ageAttestedAt: Date | null;
        termsVersion: string;
        privacyVersion: string;
        communityGuidelinesVersion: string;
        termsAcceptedAt: Date;
        privacyAcceptedAt: Date;
        communityGuidelinesAcceptedAt: Date;
        locale: string | null;
        timeZone: string | null;
        lastLoginAt: Date | null;
        deletionRequestedAt: Date | null;
        deletionDueAt: Date | null;
        deletedAt: Date | null;
        anonymizedReference: string;
        version: number;
        updatedAt: Date;
    }>;
}
