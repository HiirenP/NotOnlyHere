import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { AccountDeletionResponse, AccountExportResponse } from '@notonlyhere/contracts';
import * as argon2 from 'argon2';
import { SessionService } from '../auth/session.service';
import { OutboxService } from '../outbox/outbox.service';
import { PrismaService } from '../prisma/prisma.service';

export const EXPORT_TTL_DAYS = 7;
export const DELETION_GRACE_DAYS = 7;

@Injectable()
export class AccountExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
  ) {}

  async requestExport(userId: string, password: string, idempotencyKey?: string) {
    await this.verifyPassword(userId, password);

    const existing = idempotencyKey
      ? await this.prisma.accountExport.findFirst({
          where: { userId, idempotencyKey },
        })
      : null;

    if (existing) {
      return this.serialize(existing);
    }

    const active = await this.prisma.accountExport.findFirst({
      where: {
        userId,
        status: { in: ['QUEUED', 'PROCESSING', 'READY'] },
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { requestedAt: 'desc' },
    });

    if (active) {
      return this.serialize(active);
    }

    const created = await this.prisma.accountExport.create({
      data: {
        userId,
        status: 'QUEUED',
        idempotencyKey: idempotencyKey ?? null,
      },
    });

    await this.outbox.emitAccountExport(userId, created.id);
    return this.serialize(created);
  }

  async getLatestExport(userId: string) {
    const latest = await this.prisma.accountExport.findFirst({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
    });
    if (!latest) {
      throw new NotFoundException({ code: 'EXPORT_NOT_FOUND', message: 'No export request found.' });
    }
    return this.serialize(latest);
  }

  async getExportForDownload(userId: string, exportId: string) {
    const exportRow = await this.prisma.accountExport.findFirst({
      where: { id: exportId, userId },
    });
    if (!exportRow || exportRow.status !== 'READY' || !exportRow.objectKey) {
      throw new NotFoundException({ code: 'EXPORT_NOT_READY', message: 'Export is not ready.' });
    }
    if (exportRow.expiresAt && exportRow.expiresAt < new Date()) {
      throw new NotFoundException({ code: 'EXPORT_EXPIRED', message: 'Export has expired.' });
    }
    return exportRow;
  }

  private serialize(exportRow: {
    id: string;
    status: 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED' | 'EXPIRED';
    requestedAt: Date;
    completedAt: Date | null;
    expiresAt: Date | null;
    objectKey: string | null;
  }): AccountExportResponse {
    const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
    return {
      id: exportRow.id,
      status: exportRow.status,
      requestedAt: exportRow.requestedAt.toISOString(),
      completedAt: exportRow.completedAt?.toISOString() ?? null,
      expiresAt: exportRow.expiresAt?.toISOString() ?? null,
      downloadUrl:
        exportRow.status === 'READY' && exportRow.objectKey
          ? `${apiUrl}/api/v1/account/export/${exportRow.id}/download`
          : null,
    };
  }

  private async verifyPassword(userId: string, password: string) {
    const credential = await this.prisma.credential.findUnique({ where: { userId } });
    if (!credential) {
      throw new UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
    }
    const valid = await argon2.verify(credential.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
    }
  }
}

@Injectable()
export class AccountDeletionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: SessionService,
    private readonly outbox: OutboxService,
  ) {}

  async requestDeletion(userId: string, password: string): Promise<AccountDeletionResponse> {
    const credential = await this.prisma.credential.findUnique({ where: { userId } });
    if (!credential) {
      throw new UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
    }
    const valid = await argon2.verify(credential.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException({ code: 'REAUTH_REQUIRED', message: 'Password confirmation failed.' });
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Account not found.' });
    }
    if (user.status === 'DELETION_PENDING') {
      return {
        status: 'DELETION_PENDING',
        requestedAt: user.deletionRequestedAt!.toISOString(),
        dueAt: user.deletionDueAt!.toISOString(),
        message: 'Account deletion is already scheduled.',
      };
    }

    const now = new Date();
    const dueAt = new Date(now.getTime() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'DELETION_PENDING',
        deletionRequestedAt: now,
        deletionDueAt: dueAt,
      },
    });

    await this.sessions.revokeAllSessions(userId, 'deletion_requested');
    await this.outbox.emitAccountDeletion(userId, dueAt.toISOString());

    return {
      status: 'DELETION_PENDING',
      requestedAt: now.toISOString(),
      dueAt: dueAt.toISOString(),
      message: 'Your account is scheduled for deletion after the grace period.',
    };
  }
}
