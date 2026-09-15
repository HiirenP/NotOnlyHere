import type { AccountDeletionResponse, AccountExportResponse } from '@notonlyhere/contracts';
import { SessionService } from '../auth/session.service';
import { OutboxService } from '../outbox/outbox.service';
import { PrismaService } from '../prisma/prisma.service';
export declare const EXPORT_TTL_DAYS = 7;
export declare const DELETION_GRACE_DAYS = 7;
export declare class AccountExportService {
    private readonly prisma;
    private readonly outbox;
    constructor(prisma: PrismaService, outbox: OutboxService);
    requestExport(userId: string, password: string, idempotencyKey?: string): Promise<AccountExportResponse>;
    getLatestExport(userId: string): Promise<AccountExportResponse>;
    getExportForDownload(userId: string, exportId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.AccountExportStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        objectKey: string | null;
        requestedAt: Date;
        expiresAt: Date | null;
        completedAt: Date | null;
        errorCode: string | null;
        idempotencyKey: string | null;
    }>;
    private serialize;
    private verifyPassword;
}
export declare class AccountDeletionService {
    private readonly prisma;
    private readonly sessions;
    private readonly outbox;
    constructor(prisma: PrismaService, sessions: SessionService, outbox: OutboxService);
    requestDeletion(userId: string, password: string): Promise<AccountDeletionResponse>;
}
