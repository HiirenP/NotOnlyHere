import type { ResourceAccess, ResourceKind } from '@prisma/client';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class ResourcesService {
    private readonly prisma;
    private readonly permissions;
    constructor(prisma: PrismaService, permissions: AdminPermissionsService);
    listResources(userId: string, options: {
        q?: string;
        kind?: ResourceKind;
        cursor?: string;
        limit?: number;
    }): Promise<{
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
    getResourceBySlug(slug: string, userId: string): Promise<{
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
    updateProgress(resourceId: string, userId: string, input: {
        progressPercent: number;
        lastPositionSeconds?: number | null;
    }): Promise<{
        resourceId: string;
        progressPercent: number;
        completedAt: string | null;
        lastPositionSeconds: number | null;
        updatedAt: string;
    }>;
    createResource(userId: string, input: {
        title: string;
        summary: string;
        kind: ResourceKind;
        access: ResourceAccess;
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
    updateResource(userId: string, resourceId: string, input: {
        title?: string;
        summary?: string;
        bodyPlain?: string | null;
        externalVideoUrl?: string | null;
        status?: string;
        version: number;
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
    private hasEntitlement;
    private canAccess;
    private assertCanWrite;
    private validateResourceInput;
    private serializeSummary;
    private serializeDetail;
}
