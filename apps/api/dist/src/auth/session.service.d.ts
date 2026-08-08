import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare const ACCESS_COOKIE = "noh_access";
export declare const REFRESH_COOKIE = "noh_refresh";
export declare const CSRF_COOKIE = "noh_csrf";
export declare class SessionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    isDevAuthEnabled(): boolean;
    summarizeUserAgent(userAgent?: string): string;
    issueCsrfToken(res: Response): string;
    createSession(userId: string, res: Response, req?: Request): Promise<string>;
    createDevSession(userId: string, res: Response): Promise<string>;
    setCookies(res: Response, accessSessionId: string, refreshToken: string): void;
    clearCookies(res: Response): void;
    resolveUserFromRequest(req: Request): Promise<({
        profile: {
            userId: string;
            createdAt: Date;
            version: number;
            updatedAt: Date;
            username: string;
            displayName: string;
            bio: string | null;
            avatarMediaId: string | null;
            coverMediaId: string | null;
        } | null;
        adminUserRoles: ({
            role: {
                id: string;
                displayName: string;
                key: string;
            };
        } & {
            userId: string;
            roleId: string;
            grantedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
        emailVerifiedAt: Date | null;
        activatedAt: Date | null;
        ageAttestedAt: Date | null;
        termsVersion: string;
        privacyVersion: string;
        communityGuidelinesVersion: string;
        termsAcceptedAt: Date;
        privacyAcceptedAt: Date;
        communityGuidelinesAcceptedAt: Date;
        locale: string | null;
        timeZone: string | null;
        lastLoginAt: Date | null;
        deletionRequestedAt: Date | null;
        deletionDueAt: Date | null;
        deletedAt: Date | null;
        anonymizedReference: string;
        version: number;
        updatedAt: Date;
    }) | null>;
    revokeSession(sessionId: string, reason?: string): Promise<void>;
    revokeAllSessions(userId: string, reason?: string): Promise<void>;
    listSessions(userId: string, currentSessionId?: string): Promise<{
        id: string;
        userAgentSummary: string;
        lastUsedAt: string;
        isCurrent: boolean;
    }[]>;
    getCurrentSessionId(req: Request): string | undefined;
}
