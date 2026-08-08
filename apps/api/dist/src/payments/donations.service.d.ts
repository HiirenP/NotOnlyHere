import type { DonationFrequency } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StripeCheckoutService } from './stripe-checkout.service';
export declare class DonationsService {
    private readonly prisma;
    private readonly stripe;
    constructor(prisma: PrismaService, stripe: StripeCheckoutService);
    createCheckoutSession(userId: string | null, input: {
        frequency: DonationFrequency;
        amountMinor: number;
        currency: string;
        idempotencyKey: string;
    }): Promise<{
        publicId: string;
        checkoutSessionId: string | null;
        status: string;
        checkoutUrl: string;
        devMode: boolean;
    }>;
    getStatus(publicId: string): Promise<{
        publicId: string;
        status: import(".prisma/client").$Enums.DonationStatus;
        frequency: import(".prisma/client").$Enums.DonationFrequency;
        amountMinor: number;
        currency: string;
        succeededAt: string | null;
    }>;
    listForAdmin(options: {
        cursor?: string;
        limit?: number;
    }): Promise<{
        items: {
            id: string;
            publicId: string;
            status: import(".prisma/client").$Enums.DonationStatus;
            frequency: import(".prisma/client").$Enums.DonationFrequency;
            amountMinor: number;
            currency: string;
            createdAt: string;
        }[];
        nextCursor: string | null;
    }>;
    private serializeCheckout;
}
