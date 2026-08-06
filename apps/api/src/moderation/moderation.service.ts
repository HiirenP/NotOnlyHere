import { randomUUID } from 'crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { AiFlagStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const MODEL_VERSION = 'dev-mod-v1';
const FLAG_PATTERNS: { pattern: RegExp; category: string; rationaleCode: string; confidence: number }[] = [
  { pattern: /\b(kill|hurt)\s+you\b/i, category: 'THREATS', rationaleCode: 'THREAT_LANGUAGE', confidence: 0.82 },
  { pattern: /\bharass\b/i, category: 'HARASSMENT', rationaleCode: 'HARASSMENT_LANGUAGE', confidence: 0.71 },
];

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluatePost(postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.status !== 'ACTIVE') return null;
    return this.createFlagIfNeeded({ postId, body: post.body });
  }

  async evaluateComment(commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.status !== 'ACTIVE') return null;
    return this.createFlagIfNeeded({ commentId, body: comment.body });
  }

  async listFlags(options: { status?: AiFlagStatus; cursor?: string; limit?: number }) {
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
    let cursorDate: Date | undefined;
    let cursorId: string | undefined;
    if (options.cursor) {
      const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
      cursorDate = new Date(createdAt);
      cursorId = id;
    }

    const rows = await this.prisma.aiModFlag.findMany({
      where: {
        ...(options.status ? { status: options.status } : {}),
        ...(cursorDate && cursorId
          ? {
              OR: [
                { createdAt: { lt: cursorDate } },
                { createdAt: cursorDate, id: { lt: cursorId } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      include: {
        post: { select: { id: true, body: true, status: true } },
        comment: { select: { id: true, body: true, status: true, postId: true } },
      },
    });

    const page = rows.slice(0, limit);
    const last = page[limit - 1];
    return {
      items: page.map((row) => this.serialize(row)),
      nextCursor:
        rows.length > limit && last
          ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
          : null,
    };
  }

  async getFlag(flagId: string) {
    const row = await this.prisma.aiModFlag.findUnique({
      where: { id: flagId },
      include: {
        post: { select: { id: true, body: true, status: true } },
        comment: { select: { id: true, body: true, status: true, postId: true } },
      },
    });
    if (!row) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Flag not found.' });
    return this.serialize(row);
  }

  async updateFlag(
    flagId: string,
    reviewerId: string,
    input: { status: AiFlagStatus; resolutionNote?: string | null },
  ) {
    if (!['REVIEWED', 'DISMISSED', 'ACTIONED'].includes(input.status)) {
      throw new BadRequestException({ code: 'INVALID_STATUS', message: 'Invalid disposition status.' });
    }
    const row = await this.prisma.aiModFlag.update({
      where: { id: flagId },
      data: {
        status: input.status,
        reviewedByUserId: reviewerId,
        reviewedAt: new Date(),
        resolutionNote: input.resolutionNote?.trim() || null,
      },
      include: {
        post: { select: { id: true, body: true, status: true } },
        comment: { select: { id: true, body: true, status: true, postId: true } },
      },
    });
    return this.serialize(row);
  }

  private async createFlagIfNeeded(input: { postId?: string; commentId?: string; body: string }) {
    const match = FLAG_PATTERNS.find((entry) => entry.pattern.test(input.body));
    if (!match) return null;

    const existing = await this.prisma.aiModFlag.findFirst({
      where: {
        postId: input.postId ?? null,
        commentId: input.commentId ?? null,
        status: 'OPEN',
        category: match.category,
      },
    });
    if (existing) return existing;

    return this.prisma.aiModFlag.create({
      data: {
        id: randomUUID(),
        postId: input.postId ?? null,
        commentId: input.commentId ?? null,
        category: match.category,
        confidence: match.confidence,
        modelVersion: MODEL_VERSION,
        rationaleCode: match.rationaleCode,
      },
    });
  }

  private serialize(
    row: Prisma.AiModFlagGetPayload<{
      include: {
        post: { select: { id: true; body: true; status: true } };
        comment: { select: { id: true; body: true; status: true; postId: true } };
      };
    }>,
  ) {
    return {
      id: row.id,
      category: row.category,
      confidence: row.confidence ? Number(row.confidence) : null,
      status: row.status,
      modelVersion: row.modelVersion,
      rationaleCode: row.rationaleCode,
      reviewedAt: row.reviewedAt?.toISOString() ?? null,
      resolutionNote: row.resolutionNote,
      createdAt: row.createdAt.toISOString(),
      target: row.post
        ? { type: 'POST' as const, id: row.post.id, body: row.post.body, status: row.post.status }
        : row.comment
          ? {
              type: 'COMMENT' as const,
              id: row.comment.id,
              postId: row.comment.postId,
              body: row.comment.body,
              status: row.comment.status,
            }
          : null,
    };
  }
}
