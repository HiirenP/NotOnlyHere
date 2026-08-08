import type { DonationFrequency } from '@prisma/client';
import type { Request } from 'express';
import { DonationsService } from './donations.service';
export declare class DonationsController {
    private readonly donations;
    constructor(donations: DonationsService);
    createCheckout(req: Request & {
        user: {
            id: string;
        };
    }, body: {
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
}
export declare class AdminDonationsController {
    private readonly donations;
    constructor(donations: DonationsService);
    list(cursor?: string, limit?: string): Promise<{
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
}
