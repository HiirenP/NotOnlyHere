import type { Response } from 'express';
import { IdentityProvider } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class OAuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private parseProvider;
    isConfigured(provider: IdentityProvider): boolean;
    start(providerName: string, returnTo: string | undefined, res: Response): Promise<void>;
    callback(providerName: string, code: string, state: string, res: Response): Promise<void>;
}
