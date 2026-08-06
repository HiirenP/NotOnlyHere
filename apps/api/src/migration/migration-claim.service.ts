import { Injectable } from '@nestjs/common';
import { GENERIC_RESET_MESSAGE, normalizeEmail } from '../auth/auth.constants';
import { EmailTokenService } from '../auth/email-token.service';
import { OutboxService } from '../outbox/outbox.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MigrationClaimService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailTokens: EmailTokenService,
    private readonly outbox: OutboxService,
  ) {}

  async isMigrationUserPendingClaim(userId: string) {
    const map = await this.prisma.migrationSourceMap.findFirst({
      where: { entityType: 'USER', targetId: userId, status: 'IMPORTED' },
    });
    if (!map) return false;
    const credential = await this.prisma.credential.findUnique({ where: { userId } });
    return !credential;
  }

  async requestClaim(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
      include: { credential: true },
    });

    if (user && !user.credential) {
      const pending = await this.isMigrationUserPendingClaim(user.id);
      if (pending && user.status === 'ACTIVE') {
        const rawToken = await this.emailTokens.create(user.id, 'RESET_PASSWORD');
        await this.outbox.emitPasswordReset(user.id, user.email, rawToken);
      }
    }

    return { ok: true, message: GENERIC_RESET_MESSAGE };
  }
}
