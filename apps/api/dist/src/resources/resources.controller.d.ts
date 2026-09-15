import type { ResourceKind } from '@prisma/client';
import type { Request } from 'express';
import { PurchasesService } from '../payments/purchases.service';
import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resources;
    private readonly purchases;
    constructor(resources: ResourcesService, purchases: PurchasesService);
    list(req: Request & {
        user: {
            id: string;
        };
    }, q?: string, kind?: ResourceKind, cursor?: string, limit?: string): Promise<{
        query: string;
        items: {
            id: string;
            slug: string;
            kind: import(".prisma/client").$Enums.ResourceKind;
            access: import(".prisma/client").$Enums.ResourceAccess;
            title: string;
            summary: string;
            publishedAt: string | null;
            viewer: {
                canAccess: boolean;
                progressPercent: number;
            };
        }[];
        nextCursor: string | null;
    }>;
    progress(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        progressPercent: number;
        lastPositionSeconds?: number | null;
    }): Promise<{
        resourceId: string;
        progressPercent: number;
        completedAt: string | null;
        lastPositionSeconds: number | null;
        updatedAt: string;
    }>;
    purchaseSession(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        idempotencyKey: string;
    }): Promise<{
        purchaseId: string;
        checkoutSessionId: string | null;
        status: string;
        checkoutUrl: string;
        devMode: boolean;
    }>;
    get(req: Request & {
        user: {
            id: string;
        };
    }, slug: string): Promise<{
        id: string;
        slug: string;
        kind: import(".prisma/client").$Enums.ResourceKind;
        access: import(".prisma/client").$Enums.ResourceAccess;
        title: string;
        summary: string;
        bodyPlain: string | null;
        externalVideoUrl: string | null;
        priceMinor: number | null;
        currency: string | null;
        status: string;
        publishedAt: string | null;
        version: number;
        viewer: {
            canAccess: boolean;
            requiresPurchase: boolean;
        };
    }>;
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        title: string;
        summary: string;
        kind: ResourceKind;
        access: 'MEMBER' | 'PAID_ONCE';
        bodyPlain?: string | null;
        externalVideoUrl?: string | null;
        priceMinor?: number | null;
        currency?: string | null;
        status?: string;
    }): Promise<{
        id: string;
        slug: string;
        kind: import(".prisma/client").$Enums.ResourceKind;
        access: import(".prisma/client").$Enums.ResourceAccess;
        title: string;
        summary: string;
        bodyPlain: string | null;
        externalVideoUrl: string | null;
        priceMinor: number | null;
        currency: string | null;
        status: string;
        publishedAt: string | null;
        version: number;
        viewer: {
            canAccess: boolean;
            requiresPurchase: boolean;
        };
    }>;
}
