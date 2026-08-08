import type { PrismaClient } from '@prisma/client';
type SeedCtx = {
    now: Date;
    passwordHash: string;
    baseUser: {
        status: 'ACTIVE';
        emailVerifiedAt: Date;
        activatedAt: Date;
        ageAttestedAt: Date;
        termsVersion: string;
        privacyVersion: string;
        communityGuidelinesVersion: string;
        termsAcceptedAt: Date;
        privacyAcceptedAt: Date;
        communityGuidelinesAcceptedAt: Date;
    };
    demoUserId: string;
    adminUserId: string;
    member2UserId: string;
};
export declare function seedDesignDemo(prisma: PrismaClient, ctx: SeedCtx): Promise<void>;
export {};
