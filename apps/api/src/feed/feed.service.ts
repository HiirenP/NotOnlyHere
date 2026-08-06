import { BadRequestException, Injectable } from '@nestjs/common';
import type { FeedMode } from '@notonlyhere/contracts';
import { MediaService } from '../media/media.service';
import { PostsService } from './posts.service';
import { FeedPolicyService } from './feed-policy.service';
import { decodeCursor, encodeCursor, FEED_DEFAULT_LIMIT } from './feed.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: FeedPolicyService,
    private readonly posts: PostsService,
    private readonly media: MediaService,
  ) {}

  async listFeed(
    viewerId: string,
    options: { mode?: FeedMode; cursor?: string; limit?: number },
  ) {
    const mode = options.mode ?? 'CHRONOLOGICAL';
    if (!['RELEVANT', 'CHRONOLOGICAL'].includes(mode)) {
      throw new BadRequestException({ code: 'INVALID_MODE', message: 'Feed mode must be RELEVANT or CHRONOLOGICAL.' });
    }

    const limit = Math.min(Math.max(options.limit ?? FEED_DEFAULT_LIMIT, 1), 50);
    const context = await this.policy.getViewerContext(viewerId);

    let cursor: { createdAt: Date; id: string } | null = null;
    if (options.cursor) {
      try {
        cursor = decodeCursor(options.cursor);
      } catch {
        throw new BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid feed cursor.' });
      }
    }

    const candidates = await this.prisma.post.findMany({
      where: {
        status: 'ACTIVE',
        circleId: null,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      include: {
        author: { include: { profile: true } },
        anonymousAuthor: true,
        media: { include: { media: true }, orderBy: { position: 'asc' } },
        linkPreview: true,
        reactions: true,
        _count: { select: { comments: { where: { status: 'ACTIVE' } } } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit * 4,
    });

    const eligible = candidates.filter((post) => this.policy.canViewPost(viewerId, post, context));

    const sorted =
      mode === 'CHRONOLOGICAL'
        ? eligible
        : [...eligible].sort((a, b) => {
            const aAuthor = this.policy.resolveAuthorUserId(a);
            const bAuthor = this.policy.resolveAuthorUserId(b);
            const aConnected = aAuthor && context.connectedUserIds.has(aAuthor) ? 1 : 0;
            const bConnected = bAuthor && context.connectedUserIds.has(bAuthor) ? 1 : 0;
            if (aConnected !== bConnected) return bConnected - aConnected;
            const timeDiff = b.createdAt.getTime() - a.createdAt.getTime();
            if (timeDiff !== 0) return timeDiff;
            return b.id.localeCompare(a.id);
          });

    const page = sorted.slice(0, limit);
    const hasMore = sorted.length > limit;
    const last = page[page.length - 1];

    return {
      mode,
      items: page.map((post) => this.posts.serialize(post, viewerId, context)),
      nextCursor: hasMore && last ? encodeCursor(last.createdAt, last.id) : null,
    };
  }

  async listCircleFeed(
    circleId: string,
    viewerId: string,
    options: { cursor?: string; limit?: number },
  ) {
    const membership = await this.policy.assertActiveCircleMember(circleId, viewerId);
    if (!membership) {
      throw new BadRequestException({ code: 'NOT_A_MEMBER', message: 'Circle membership required.' });
    }

    const limit = Math.min(Math.max(options.limit ?? FEED_DEFAULT_LIMIT, 1), 50);
    const context = await this.policy.getViewerContext(viewerId);
    let cursor: { createdAt: Date; id: string } | null = null;
    if (options.cursor) {
      try {
        cursor = decodeCursor(options.cursor);
      } catch {
        throw new BadRequestException({ code: 'INVALID_CURSOR', message: 'Invalid feed cursor.' });
      }
    }

    const candidates = await this.prisma.post.findMany({
      where: {
        status: 'ACTIVE',
        circleId,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      include: {
        author: { include: { profile: true } },
        anonymousAuthor: true,
        media: { include: { media: true }, orderBy: { position: 'asc' } },
        linkPreview: true,
        reactions: true,
        _count: { select: { comments: { where: { status: 'ACTIVE' } } } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const eligible = candidates.filter((post) =>
      this.policy.canViewCirclePost(viewerId, post, context, true),
    );
    const page = eligible.slice(0, limit);
    const last = page[page.length - 1];

    return {
      circleId,
      items: page.map((post) => this.posts.serialize(post, viewerId, context)),
      nextCursor: eligible.length > limit && last ? encodeCursor(last.createdAt, last.id) : null,
    };
  }
}
