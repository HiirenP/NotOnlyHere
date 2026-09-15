import { PrismaService } from '../prisma/prisma.service';
import { StripeCheckoutService } from './stripe-checkout.service';
export declare class PurchasesService {
    private readonly prisma;
    private readonly stripe;
    constructor(prisma: PrismaService, stripe: StripeCheckoutService);
    createPurchaseSession(userId: string, resourceId: string, idempotencyKey: string): Promise<{
        purchaseId: string;
        checkoutSessionId: string | null;
        status: string;
        checkoutUrl: string;
        devMode: boolean;
    }>;
    private serializeCheckout;
}
