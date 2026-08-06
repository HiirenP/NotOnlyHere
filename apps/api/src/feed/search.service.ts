import { Injectable } from '@nestjs/common';
import { FeedPolicyService } from './feed-policy.service';
import { decodeCursor, encodeCursor, FEED_DEFAULT_LIMIT } from './feed.constants';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: FeedPolicyService,
    private readonly posts: PostsService,
  ) {}

  async searchPosts(
    viewerId: string,
    options: { q: string; cursor?: string; limit?: number },
  ) {
    const query = options.q.trim();
    const limit = Math.min(Math.max(options.limit ?? FEED_DEFAULT_LIMIT, 1), 50);
    const context = await this.policy.getViewerContext(viewerId);
    let cursor: { createdAt: Date; id: string } | null = null;
    if (options.cursor) cursor = decodeCursor(options.cursor);

    const candidates = await this.prisma.post.findMany({
      where: {
        status: 'ACTIVE',
        body: { contains: query, mode: 'insensitive' },
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
    const page = eligible.slice(0, limit);
    const last = page[page.length - 1];

    return {
      query,
      items: page.map((post) => this.posts.serialize(post, viewerId, context)),
      nextCursor: eligible.length > limit && last ? encodeCursor(last.createdAt, last.id) : null,
    };
  }
}
