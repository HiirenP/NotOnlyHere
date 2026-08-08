import { PrismaService } from '../prisma/prisma.service';
export type MigrationFixture = {
    users?: Array<{
        sourceId: string;
        email: string;
        username: string;
        displayName: string;
        bio?: string | null;
        status?: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
    }>;
    circles?: Array<{
        sourceId: string;
        name: string;
        slug: string;
        description?: string;
        visibility?: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
    }>;
    posts?: Array<{
        sourceId: string;
        authorSourceId: string;
        body: string;
        circleSourceId?: string | null;
    }>;
};
export declare class MigrationImportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    runImport(startedByUserId: string, input: {
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
    private upsertMap;
    private importUser;
    private importCircle;
    private importPost;
}
