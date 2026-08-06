import { createHash, randomBytes } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { IdentityProvider } from '@prisma/client';
import { sanitizeReturnTo } from './auth.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OAuthService {
  constructor(private readonly prisma: PrismaService) {}

  private parseProvider(provider: string): IdentityProvider {
    const normalized = provider.toUpperCase();
    if (normalized !== 'GOOGLE' && normalized !== 'APPLE') {
      throw new BadRequestException({ code: 'INVALID_PROVIDER', message: 'Unsupported provider.' });
    }
    return normalized as IdentityProvider;
  }

  isConfigured(provider: IdentityProvider) {
    if (provider === 'GOOGLE') return !!process.env.OAUTH_GOOGLE_CLIENT_ID;
    return !!process.env.OAUTH_APPLE_CLIENT_ID;
  }

  async start(providerName: string, returnTo: string | undefined, res: Response) {
    const provider = this.parseProvider(providerName);
    if (!this.isConfigured(provider)) {
      const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
      return res.redirect(`${webUrl}/login?error=oauth_not_configured`);
    }

    const state = randomBytes(24).toString('hex');
    const codeVerifier = randomBytes(32).toString('base64url');
    const stateHash = createHash('sha256').update(state).digest();

    await this.prisma.oAuthTransaction.create({
      data: {
        provider,
        stateHash,
        codeVerifier,
        returnTo: sanitizeReturnTo(returnTo),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    const redirectUri = `${apiUrl}/api/v1/auth/oauth/${providerName.toLowerCase()}/callback`;

    if (provider === 'GOOGLE') {
      const params = new URLSearchParams({
        client_id: process.env.OAUTH_GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        code_challenge: createHash('sha256').update(codeVerifier).digest('base64url'),
        code_challenge_method: 'S256',
      });
      return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    }

    return res.redirect(`${process.env.WEB_URL ?? 'http://localhost:3000'}/login?error=apple_pending`);
  }

  async callback(providerName: string, code: string, state: string, res: Response) {
    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
    if (!code || !state) {
      return res.redirect(`${webUrl}/login?error=oauth_failed`);
    }

    const provider = this.parseProvider(providerName);
    const stateHash = createHash('sha256').update(state).digest();
    const transaction = await this.prisma.oAuthTransaction.findFirst({
      where: {
        provider,
        stateHash,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!transaction) {
      return res.redirect(`${webUrl}/login?error=oauth_state_invalid`);
    }

    await this.prisma.oAuthTransaction.update({
      where: { id: transaction.id },
      data: { consumedAt: new Date() },
    });

    // Provider token exchange and account linking is completed when credentials are configured.
    return res.redirect(`${webUrl}/login?error=oauth_linking_pending`);
  }
}
