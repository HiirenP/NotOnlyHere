import { PrismaService } from '../prisma/prisma.service';
export declare class StripeWebhookService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    handleRawBody(rawBody: string, signature: string | undefined): Promise<{
        ok: boolean;
        duplicate: boolean;
    }>;
    private handleCheckoutCompleted;
}
