import { createHash, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { TokenPurpose, type Prisma } from '@prisma/client';
import { EMAIL_TOKEN_TTL } from './auth.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailTokenService {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest();
  }

  async create(userId: string, purpose: TokenPurpose, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prisma;
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const ttl =
      purpose === 'VERIFY_EMAIL' ? EMAIL_TOKEN_TTL.VERIFY_EMAIL : EMAIL_TOKEN_TTL.RESET_PASSWORD;

    await db.emailToken.create({
      data: {
        userId,
        purpose,
        tokenHash,
        expiresAt: new Date(Date.now() + ttl),
      },
    });

    return rawToken;
  }

  async consume(rawToken: string, purpose: TokenPurpose) {
    const tokenHash = this.hashToken(rawToken);
    const record = await this.prisma.emailToken.findFirst({
      where: {
        tokenHash,
        purpose,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) return null;

    await this.prisma.emailToken.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });

    return record;
  }
}
