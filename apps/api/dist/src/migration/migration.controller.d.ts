import type { Request } from 'express';
import { LegacyRedirectService } from './legacy-redirect.service';
import { MigrationClaimService } from './migration-claim.service';
import { MigrationImportService, type MigrationFixture } from './migration-import.service';
import { MigrationReconciliationService } from './migration-reconciliation.service';
export declare class LegacyRedirectController {
    private readonly redirects;
    constructor(redirects: LegacyRedirectService);
    resolve(path: string): Promise<{
        sourcePath: string;
        targetPath: string;
        statusCode: number;
    }>;
}
export declare class MigrationClaimController {
    private readonly claims;
    constructor(claims: MigrationClaimService);
    requestClaim(body: {
        email: string;
    }): Promise<{
        ok: boolean;
        message: string;
    }>;
}
export declare class AdminMigrationController {
    private readonly imports;
    private readonly reconciliation;
    private readonly redirects;
    constructor(imports: MigrationImportService, reconciliation: MigrationReconciliationService, redirects: LegacyRedirectService);
    startRun(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        sourceSystem: string;
        dryRun?: boolean;
        fixture: MigrationFixture;
    }): Promise<{
        runId: string;
        dryRun: boolean;
        status: string;
        counts: Record<string, {
            imported: number;
            skipped: number;
            failed: number;
        }>;
    }>;
    runReport(id: string): Promise<{
        runId: string;
        sourceSystem: string;
        dryRun: boolean;
        status: import(".prisma/client").$Enums.MigrationRunStatus;
        counts: import("@prisma/client/runtime/library").JsonValue;
        grouped: Record<string, Record<string, number>>;
        startedAt: string;
        completedAt: string | null;
    } | null>;
    summary(): Promise<{
        latestRun: null;
        totals: {};
        pendingClaims: number;
        reconciled?: undefined;
    } | {
        latestRun: {
            id: string;
            sourceSystem: string;
            status: import(".prisma/client").$Enums.MigrationRunStatus;
            dryRun: boolean;
            startedAt: string;
            completedAt: string | null;
        };
        totals: Record<import(".prisma/client").$Enums.MigrationEntityType, Record<string, number>>;
        pendingClaims: number;
        reconciled: boolean;
    }>;
    readiness(): Promise<{
        ready: boolean;
        checks: {
            key: string;
            ok: boolean;
            detail: string;
        }[];
        migration: {
            latestRun: null;
            totals: {};
            pendingClaims: number;
            reconciled?: undefined;
        } | {
            latestRun: {
                id: string;
                sourceSystem: string;
                status: import(".prisma/client").$Enums.MigrationRunStatus;
                dryRun: boolean;
                startedAt: string;
                completedAt: string | null;
            };
            totals: Record<import(".prisma/client").$Enums.MigrationEntityType, Record<string, number>>;
            pendingClaims: number;
            reconciled: boolean;
        };
    }>;
    listRedirects(): Promise<{
        items: {
            id: string;
            sourcePath: string;
            targetPath: string;
            statusCode: number;
        }[];
    }>;
    upsertRedirect(body: {
        sourcePath: string;
        targetPath: string;
        statusCode?: number;
    }): Promise<{
        id: string;
        sourcePath: string;
        targetPath: string;
        statusCode: number;
    }>;
}
