import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthController {
    private readonly auth;
    private readonly sessions;
    private readonly prisma;
    constructor(auth: AuthService, sessions: SessionService, prisma: PrismaService);
    register(body: {
        displayName: string;
        username: string;
        email: string;
        password: string;
        ageConfirmed: boolean;
        termsAccepted: boolean;
        privacyAccepted: boolean;
        guidelinesAccepted: boolean;
    }): Promise<{
        userId: string;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    login(body: {
        email: string;
        password: string;
        returnTo?: string;
    }, req: Request, res: Response): Promise<{
        ok: boolean;
        returnTo: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        ok: boolean;
    }>;
    logoutAll(req: Request, res: Response): Promise<{
        ok: boolean;
    }>;
    verifyEmail(body: {
        token: string;
    }): Promise<{
        ok: boolean;
    }>;
    resendVerification(body: {
        email: string;
    }): Promise<{
        ok: boolean;
        message: string;
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        ok: boolean;
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        password: string;
    }): Promise<{
        ok: boolean;
    }>;
    devSession(body: {
        email?: string;
    }, res: Response): Promise<{
        ok: boolean;
        message: string;
        sessionId?: undefined;
    } | {
        ok: boolean;
        sessionId: string;
        message?: undefined;
    }>;
}
export declare class AccountSessionsController {
    private readonly sessions;
    constructor(sessions: SessionService);
    list(req: Request & {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        userAgentSummary: string;
        lastUsedAt: string;
        isCurrent: boolean;
    }[]>;
    revoke(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
}
