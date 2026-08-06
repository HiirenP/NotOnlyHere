import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegacyRedirectService {
  constructor(private readonly prisma: PrismaService) {}

  normalizePath(path: string) {
    const trimmed = path.trim();
    if (!trimmed.startsWith('/')) return `/${trimmed}`;
    return trimmed.replace(/\/+$/, '') || '/';
  }

  async resolve(sourcePath: string) {
    const normalized = this.normalizePath(sourcePath);
    const redirect = await this.prisma.legacyRedirect.findFirst({
      where: { sourcePath: normalized, active: true },
    });
    if (!redirect) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'No redirect configured.' });
    }
    return {
      sourcePath: redirect.sourcePath,
      targetPath: redirect.targetPath,
      statusCode: redirect.statusCode,
    };
  }

  async list() {
    const rows = await this.prisma.legacyRedirect.findMany({
      where: { active: true },
      orderBy: { sourcePath: 'asc' },
    });
    return {
      items: rows.map((row) => ({
        id: row.id,
        sourcePath: row.sourcePath,
        targetPath: row.targetPath,
        statusCode: row.statusCode,
      })),
    };
  }

  async upsert(input: { sourcePath: string; targetPath: string; statusCode?: number }) {
    const sourcePath = this.normalizePath(input.sourcePath);
    const targetPath = input.targetPath.trim();
    if (!targetPath.startsWith('/')) {
      throw new Error('INVALID_TARGET');
    }

    const row = await this.prisma.legacyRedirect.upsert({
      where: { sourcePath },
      update: {
        targetPath,
        statusCode: input.statusCode ?? 301,
        active: true,
      },
      create: {
        sourcePath,
        targetPath,
        statusCode: input.statusCode ?? 301,
      },
    });

    return {
      id: row.id,
      sourcePath: row.sourcePath,
      targetPath: row.targetPath,
      statusCode: row.statusCode,
    };
  }
}
