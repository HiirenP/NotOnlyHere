import { EmailTokenService } from '../auth/email-token.service';
import { OutboxService } from '../outbox/outbox.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class MigrationClaimService {
    private readonly prisma;
    private readonly emailTokens;
    private readonly outbox;
    constructor(prisma: PrismaService, emailTokens: EmailTokenService, outbox: OutboxService);
    isMigrationUserPendingClaim(userId: string): Promise<boolean>;
    requestClaim(email: string): Promise<{
        ok: boolean;
        message: string;
    }>;
}
