import { PrismaService } from '../prisma/prisma.service';
export declare class MigrationReconciliationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getRunReport(runId: string): Promise<{
        runId: string;
        sourceSystem: string;
        dryRun: boolean;
        status: import(".prisma/client").$Enums.MigrationRunStatus;
        counts: import("@prisma/client/runtime/library").JsonValue;
        grouped: Record<string, Record<string, number>>;
        startedAt: string;
        completedAt: string | null;
    } | null>;
    getLatestSummary(): Promise<{
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
    getReleaseReadiness(): Promise<{
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
}
