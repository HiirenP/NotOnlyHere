import type { Request, Response } from 'express';
import { AccountExportService, AccountDeletionService } from './account-lifecycle.service';
export declare class AccountController {
    private readonly exports;
    private readonly deletions;
    constructor(exports: AccountExportService, deletions: AccountDeletionService);
    getAccount(req: Request & {
        user: {
            id: string;
            email: string;
            status: string;
            profile: {
                displayName: string;
                username: string;
            } | null;
            adminUserRoles: {
                role: {
                    key: string;
                };
            }[];
        };
    }): {
        id: string;
        email: string;
        status: string;
        displayName: string;
        username: string;
        roles: string[];
    };
    requestExport(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        password: string;
        idempotencyKey?: string;
    }): Promise<import("@notonlyhere/contracts").AccountExportResponse>;
    getExport(req: Request & {
        user: {
            id: string;
        };
    }): Promise<import("@notonlyhere/contracts").AccountExportResponse>;
    downloadExport(req: Request & {
        user: {
            id: string;
        };
    }, id: string, res: Response): Promise<void>;
    requestDeletion(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        password: string;
    }): Promise<import("@notonlyhere/contracts").AccountDeletionResponse>;
}
