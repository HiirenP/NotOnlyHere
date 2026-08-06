import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: {
    actorUserId: string;
    action: string;
    targetType: string;
    targetId: string;
    result: 'SUCCESS' | 'DENIED' | 'FAILED';
    requestId?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.auditLog.create({
      data: {
        id: randomUUID(),
        actorUserId: input.actorUserId,
        actorType: 'ADMIN',
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        result: input.result,
        requestId: input.requestId ?? null,
        metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  }
}
