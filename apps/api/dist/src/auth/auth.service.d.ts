import type { Request, Response } from 'express';
import { EmailTokenService } from './email-token.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { OutboxService } from '../outbox/outbox.service';
import { PrismaService } from '../prisma/prisma.service';
type RegisterInput = {
    displayName: string;
    username: string;
    email: string;
    password: string;
    ageConfirmed: boolean;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    guidelinesAccepted: boolean;
};
export declare class AuthService {
    private readonly prisma;
    private readonly passwords;
    private readonly emailTokens;
    private readonly sessions;
    private readonly outbox;
    constructor(prisma: PrismaService, passwords: PasswordService, emailTokens: EmailTokenService, sessions: SessionService, outbox: OutboxService);
    register(input: RegisterInput): Promise<{
        userId: string;
        email: string;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    login(email: string, password: string, res: Response, req: Request, returnTo?: string): Promise<{
        ok: boolean;
        returnTo: string;
    }>;
    verifyEmail(rawToken: string): Promise<{
        ok: boolean;
    }>;
    resendVerification(email: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    resetPassword(rawToken: string, newPassword: string): Promise<{
        ok: boolean;
    }>;
    logout(req: Request, res: Response): Promise<{
        ok: boolean;
    }>;
    logoutAll(req: Request, res: Response): Promise<{
        ok: boolean;
    }>;
    private findUserForLogin;
}
export {};
