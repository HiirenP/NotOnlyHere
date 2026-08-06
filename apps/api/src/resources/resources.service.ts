import { randomBytes, randomUUID } from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma, ResourceAccess, ResourceKind } from '@prisma/client';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { PrismaService } from '../prisma/prisma.service';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: AdminPermissionsService,
  ) {}

  async listResources(
    userId: string,
    options: { q?: string; kind?: ResourceKind; cursor?: string; limit?: number },
  ) {
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
    let cursorDate: Date | undefined;
    let cursorId: string | undefined;
    if (options.cursor) {
      const [publishedAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
      cursorDate = new Date(publishedAt);
      cursorId = id;
    }

    const rows = await this.prisma.resource.findMany({
      where: {
        status: 'PUBLISHED',
        access: { in: ['MEMBER', 'PAID_ONCE'] },
        ...(options.kind ? { kind: options.kind } : {}),
        ...(options.q?.trim()
          ? {
              OR: [
                { title: { contains: options.q.trim(), mode: 'insensitive' } },
                { summary: { contains: options.q.trim(), mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(cursorDate && cursorId
          ? {
              OR: [
                { publishedAt: { lt: cursorDate } },
                { publishedAt: cursorDate, id: { lt: cursorId } },
              ],
            }
          : {}),
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      include: { progress: { where: { userId } }, entitlements: { where: { userId, revokedAt: null } } },
    });

    const page = rows.slice(0, limit);
    const last = page[page.length - 1];
    return {
      query: options.q ?? '',
      items: await Promise.all(page.map((row) => this.serializeSummary(row, userId))),
      nextCursor:
        rows.length > limit && last && last.publishedAt
          ? Buffer.from(`${last.publishedAt.toISOString()}|${last.id}`).toString('base64url')
          : null,
    };
  }

  async getResourceBySlug(slug: string, userId: string) {
    const row = await this.prisma.resource.findUnique({
      where: { slug },
      include: { progress: { where: { userId } }, entitlements: { where: { userId, revokedAt: null } } },
    });
    if (!row || row.status !== 'PUBLISHED') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Resource not found.' });
    }
    const entitled = this.hasEntitlement(row);
    if (!entitled) {
      throw new ForbiddenException({
        code: 'NOT_ENTITLED',
        message: row.access === 'PAID_ONCE' ? 'Purchase required for this resource.' : 'You cannot access this resource.',
      });
    }
    return this.serializeDetail(row, userId, true);
  }

  async updateProgress(
    resourceId: string,
    userId: string,
    input: { progressPercent: number; lastPositionSeconds?: number | null },
  ) {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource || resource.status !== 'PUBLISHED') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Resource not found.' });
    }
    if (!this.hasEntitlement(resource)) {
      throw new ForbiddenException({ code: 'NOT_ENTITLED', message: 'You cannot access this resource.' });
    }
    if (!Number.isInteger(input.progressPercent) || input.progressPercent < 0 || input.progressPercent > 100) {
      throw new BadRequestException({ code: 'INVALID_PROGRESS', message: 'Progress must be between 0 and 100.' });
    }

    const row = await this.prisma.resourceProgress.upsert({
      where: { resourceId_userId: { resourceId, userId } },
      update: {
        progressPercent: input.progressPercent,
        lastPositionSeconds: input.lastPositionSeconds ?? null,
        completedAt: input.progressPercent === 100 ? new Date() : null,
      },
      create: {
        resourceId,
        userId,
        progressPercent: input.progressPercent,
        lastPositionSeconds: input.lastPositionSeconds ?? null,
        completedAt: input.progressPercent === 100 ? new Date() : null,
      },
    });

    return {
      resourceId,
      progressPercent: row.progressPercent,
      completedAt: row.completedAt?.toISOString() ?? null,
      lastPositionSeconds: row.lastPositionSeconds,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createResource(
    userId: string,
    input: {
      title: string;
      summary: string;
      kind: ResourceKind;
      access: ResourceAccess;
      bodyPlain?: string | null;
      externalVideoUrl?: string | null;
      priceMinor?: number | null;
      currency?: string | null;
      status?: string;
    },
  ) {
    await this.assertCanWrite(userId);
    this.validateResourceInput(input);

    const slug = `${slugify(input.title) || 'resource'}-${randomBytes(3).toString('hex')}`;
    const status = input.status ?? 'DRAFT';
    const row = await this.prisma.resource.create({
      data: {
        id: randomUUID(),
        slug,
        title: input.title.trim(),
        summary: input.summary.trim(),
        kind: input.kind,
        access: input.access,
        bodyPlain: input.bodyPlain?.trim() || null,
        externalVideoUrl: input.externalVideoUrl?.trim() || null,
        priceMinor: input.priceMinor ?? null,
        currency: input.currency ?? null,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        createdByUserId: userId,
        updatedByUserId: userId,
      },
    });
    return this.serializeDetail(row, userId, this.hasEntitlement(row));
  }

  async updateResource(
    userId: string,
    resourceId: string,
    input: {
      title?: string;
      summary?: string;
      bodyPlain?: string | null;
      externalVideoUrl?: string | null;
      status?: string;
      version: number;
    },
  ) {
    await this.assertCanWrite(userId);
    const existing = await this.prisma.resource.findUnique({ where: { id: resourceId } });
    if (!existing) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Resource not found.' });
    if (existing.version !== input.version) {
      throw new BadRequestException({ code: 'VERSION_CONFLICT', message: 'Resource was updated elsewhere.' });
    }

    const status = input.status ?? existing.status;
    const row = await this.prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: input.title?.trim() ?? existing.title,
        summary: input.summary?.trim() ?? existing.summary,
        bodyPlain: input.bodyPlain === undefined ? existing.bodyPlain : input.bodyPlain?.trim() || null,
        externalVideoUrl:
          input.externalVideoUrl === undefined ? existing.externalVideoUrl : input.externalVideoUrl?.trim() || null,
        status,
        publishedAt: status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
        updatedByUserId: userId,
        version: { increment: 1 },
      },
    });
    return this.serializeDetail(row, userId, this.hasEntitlement(row));
  }

  private hasEntitlement(
    resource: {
      access: ResourceAccess;
      status: string;
      entitlements?: { revokedAt: Date | null }[];
    },
  ) {
    if (resource.status !== 'PUBLISHED') return false;
    if (resource.access === 'MEMBER') return true;
    if (resource.access === 'PAID_ONCE') return (resource.entitlements?.length ?? 0) > 0;
    return false;
  }

  private canAccess(
    resource: { access: ResourceAccess; status: string },
    userId: string,
    entitlements?: { revokedAt: Date | null }[],
  ) {
    if (resource.status !== 'PUBLISHED') return false;
    if (resource.access === 'MEMBER') return true;
    if (resource.access === 'PAID_ONCE') return (entitlements?.length ?? 0) > 0;
    if (resource.access === 'PUBLIC_FREE') return false;
    return false;
  }

  private async assertCanWrite(userId: string) {
    const allowed = await this.permissions.hasPermission(userId, 'resource.write');
    if (!allowed) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Resource authoring requires editor access.' });
    }
  }

  private validateResourceInput(input: {
    title: string;
    summary: string;
    kind: ResourceKind;
    access: ResourceAccess;
    bodyPlain?: string | null;
    externalVideoUrl?: string | null;
    priceMinor?: number | null;
    currency?: string | null;
  }) {
    if (!input.title.trim() || !input.summary.trim()) {
      throw new BadRequestException({ code: 'INVALID_INPUT', message: 'Title and summary are required.' });
    }
    if (input.access === 'PUBLIC_FREE') {
      throw new BadRequestException({ code: 'PUBLIC_DISABLED', message: 'Public resources are disabled in this release.' });
    }
    if (input.access === 'PAID_ONCE' && (!input.priceMinor || input.priceMinor <= 0 || !input.currency)) {
      throw new BadRequestException({ code: 'INVALID_PRICE', message: 'Paid resources require price and currency.' });
    }
    if ((input.kind === 'ARTICLE' || input.kind === 'WORKSHEET') && !input.bodyPlain?.trim()) {
      throw new BadRequestException({ code: 'BODY_REQUIRED', message: 'Articles and worksheets require body content.' });
    }
    if (input.kind === 'VIDEO' && !input.externalVideoUrl?.trim()) {
      throw new BadRequestException({ code: 'VIDEO_URL_REQUIRED', message: 'Video resources require an external URL.' });
    }
  }

  private async serializeSummary(
    row: Prisma.ResourceGetPayload<{ include: { progress: true; entitlements: true } }>,
    userId: string,
  ) {
    return {
      id: row.id,
      slug: row.slug,
      kind: row.kind,
      access: row.access,
      title: row.title,
      summary: row.summary,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      viewer: {
        canAccess: this.canAccess(row, userId, row.entitlements),
        progressPercent: row.progress[0]?.progressPercent ?? 0,
      },
    };
  }

  private serializeDetail(
    row: {
      id: string;
      slug: string;
      kind: ResourceKind;
      access: ResourceAccess;
      title: string;
      summary: string;
      bodyPlain: string | null;
      externalVideoUrl: string | null;
      priceMinor: bigint | null;
      currency: string | null;
      status: string;
      publishedAt: Date | null;
      version: number;
    },
    userId: string,
    entitled: boolean,
  ) {
    return {
      id: row.id,
      slug: row.slug,
      kind: row.kind,
      access: row.access,
      title: row.title,
      summary: row.summary,
      bodyPlain: entitled ? row.bodyPlain : null,
      externalVideoUrl: entitled ? row.externalVideoUrl : null,
      priceMinor: row.priceMinor ? Number(row.priceMinor) : null,
      currency: row.currency,
      status: row.status,
      publishedAt: row.publishedAt?.toISOString() ?? null,
      version: row.version,
      viewer: {
        canAccess: entitled,
        requiresPurchase: row.access === 'PAID_ONCE' && !entitled,
      },
    };
  }
}
