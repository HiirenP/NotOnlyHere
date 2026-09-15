import { TokenPurpose, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class EmailTokenService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private hashToken;
    create(userId: string, purpose: TokenPurpose, tx?: Prisma.TransactionClient): Promise<string>;
    consume(rawToken: string, purpose: TokenPurpose): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        purpose: import(".prisma/client").$Enums.TokenPurpose;
        tokenHash: Prisma.Bytes;
        targetEmail: string | null;
        consumedAt: Date | null;
        attemptCount: number;
    } | null>;
}
