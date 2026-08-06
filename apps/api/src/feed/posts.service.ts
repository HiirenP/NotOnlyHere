import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PostVisibility, ReactionKind } from '@prisma/client';
import { ActivityService } from '../activity/activity.service';
import { AnonymousQuotaService } from '../anonymous/anonymous-quota.service';
import { AnonymousService } from '../anonymous/anonymous.service';
import { MediaService } from '../media/media.service';
import { FeedPolicyService } from './feed-policy.service';
import { LinkPreviewService } from './link-preview.service';
import {
  POST_BODY_MAX,
  POST_EDIT_WINDOW_MS,
  isMeaningfulBody,
  normalizeBody,
} from './feed.constants';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';

const postInclude = {
  author: { include: { profile: true } },
  anonymousAuthor: true,
  media: { include: { media: true }, orderBy: { position: 'asc' as const } },
  linkPreview: true,
  reactions: true,
  _count: { select: { comments: { where: { status: 'ACTIVE' as const } } } },
};

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: FeedPolicyService,
    private readonly media: MediaService,
    private readonly activity: ActivityService,
    private readonly linkPreviews: LinkPreviewService,
    private readonly anonymous: AnonymousService,
    private readonly anonymousQuota: AnonymousQuotaService,
    private readonly outbox: OutboxService,
  ) {}

  async createPost(
    authorId: string,
    input: {
      body: string;
      visibility: PostVisibility;
      isAnonymous?: boolean;
      circleId?: string;
      idempotencyKey?: string;
      media?: { mediaId: string; position: number; altText?: string }[];
      linkPreviewUrl?: string;
    },
  ) {
    const body = normalizeBody(input.body ?? '');
    const mediaItems = input.media ?? [];
    const hasLink = Boolean(input.linkPreviewUrl?.trim());

    if (!isMeaningfulBody(body) && mediaItems.length === 0 && !hasLink) {
      throw new BadRequestException({
        code: 'EMPTY_POST',
        message: 'Post must include text, images, or a link.',
      });
    }
    if (body.length > POST_BODY_MAX) {
      throw new BadRequestException({
        code: 'POST_TOO_LONG',
        message: `Post must be ${POST_BODY_MAX} characters or fewer.`,
      });
    }
    if (mediaItems.length > 4) {
      throw new BadRequestException({ code: 'TOO_MANY_IMAGES', message: 'Maximum 4 images per post.' });
    }

    const visibility = input.visibility ?? 'MEMBERS';
    const isAnonymous = Boolean(input.isAnonymous);
    const circleId = input.circleId?.trim() || null;

    if (circleId) {
      const membership = await this.policy.assertActiveCircleMember(circleId, authorId);
      if (!membership) {
        throw new ForbiddenException({ code: 'NOT_A_MEMBER', message: 'Circle membership required to post.' });
      }
      if (await this.policy.isCircleMuted(circleId, authorId)) {
        throw new ForbiddenException({ code: 'MUTED', message: 'You are muted in this circle.' });
      }
    }

    for (const item of mediaItems) {
      await this.media.assertOwnedReadyMedia(authorId, item.mediaId, 'POST_IMAGE');
    }

    const preview = hasLink ? await this.linkPreviews.fetchPreview(input.linkPreviewUrl!.trim()) : null;

    if (isAnonymous) {
      await this.anonymousQuota.consumeQuota(authorId);
    }

    const post = await this.prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          authorUserId: isAnonymous ? null : authorId,
          body: body || (hasLink ? preview!.canonicalUrl : '(image)'),
          visibility,
          isAnonymous,
          circleId,
        },
      });

      if (isAnonymous) {
        await tx.postAnonymousAuthor.create({
          data: {
            postId: created.id,
            userId: authorId,
            displayLabel: this.anonymous.createDisplayLabel(),
          },
        });
      }

      if (mediaItems.length > 0) {
        await tx.postMedia.createMany({
          data: mediaItems.map((item) => ({
            postId: created.id,
            mediaId: item.mediaId,
            position: item.position,
            altText: item.altText ?? null,
          })),
        });
      }

      if (preview) {
        await tx.postLinkPreview.create({
          data: {
            postId: created.id,
            sourceUrl: preview.sourceUrl,
            canonicalUrl: preview.canonicalUrl,
            title: preview.title,
            description: preview.description,
            siteName: preview.siteName,
            fetchStatus: preview.fetchStatus,
            fetchedAt: new Date(preview.fetchedAt),
          },
        });
      }

      return tx.post.findUniqueOrThrow({
        where: { id: created.id },
        include: postInclude,
      });
    });

    await this.activity.recordPostCreated(authorId, post.id);
    await this.outbox.emitModerationEvaluate(post.id, { postId: post.id });
    const context = await this.policy.getViewerContext(authorId);
    return this.serialize(post, authorId, context);
  }

  async getPost(postId: string, viewerId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId }, include: postInclude });
    if (!post) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    const context = await this.policy.getViewerContext(viewerId);
    if (!this.policy.canViewPost(viewerId, post, context)) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    }
    return this.serialize(post, viewerId, context);
  }

  async listByUsername(username: string, viewerId: string, limit = 20) {
    const profile = await this.prisma.profile.findUnique({ where: { username } });
    if (!profile) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Profile not found.' });
    }
    const context = await this.policy.getViewerContext(viewerId);
    const candidates = await this.prisma.post.findMany({
      where: { authorUserId: profile.userId, status: 'ACTIVE' },
      include: postInclude,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: Math.min(limit, 50),
    });
    const items = candidates
      .filter((post) => this.policy.canViewPost(viewerId, post, context))
      .map((post) => this.serialize(post, viewerId, context));
    return { items };
  }

  async updatePost(postId: string, authorId: string, input: { body: string; version: number }) {
    const post = await this.prisma.post.findUnique({ where: { id: postId }, include: postInclude });
    if (!post || post.status !== 'ACTIVE') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    }
    if (!this.policy.isPostAuthor(post, authorId)) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can edit this post.' });
    }
    if (input.version !== post.version) {
      throw new ConflictException({ code: 'VERSION_CONFLICT', message: 'Post was updated elsewhere.' });
    }
    if (Date.now() - post.createdAt.getTime() > POST_EDIT_WINDOW_MS) {
      throw new BadRequestException({ code: 'EDIT_WINDOW_EXPIRED', message: 'Edit window expired.' });
    }

    const body = normalizeBody(input.body);
    if (!isMeaningfulBody(body)) {
      throw new BadRequestException({ code: 'EMPTY_POST', message: 'Post must include text content.' });
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: { body, version: { increment: 1 }, editedAt: new Date() },
      include: postInclude,
    });
    const context = await this.policy.getViewerContext(authorId);
    return this.serialize(updated, authorId, context);
  }

  async deletePost(postId: string, authorId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { anonymousAuthor: true },
    });
    if (!post || post.status !== 'ACTIVE') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    }
    if (!this.policy.isPostAuthor(post, authorId)) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can delete this post.' });
    }
    const now = new Date();
    await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'DELETED', deletedAt: now, body: '[deleted]', version: { increment: 1 } },
    });
    return { ok: true, deletedAt: now.toISOString() };
  }

  serialize(
    post: {
      id: string;
      authorUserId: string | null;
      isAnonymous: boolean;
      body: string;
      visibility: PostVisibility;
      status: string;
      version: number;
      editedAt: Date | null;
      deletedAt: Date | null;
      createdAt: Date;
      author: { profile: { username: string; displayName: string; avatarMediaId: string | null } | null } | null;
      anonymousAuthor?: { displayLabel: string; userId: string | null } | null;
      media?: { position: number; altText: string | null; mediaId: string; media: { id: string } }[];
      linkPreview?: {
        sourceUrl: string;
        canonicalUrl: string;
        title: string | null;
        description: string | null;
        siteName: string | null;
        fetchStatus: string;
      } | null;
      reactions?: { kind: ReactionKind; userId: string }[];
    },
    viewerId: string,
    _context: { blockedUserIds: Set<string>; connectedUserIds: Set<string> },
  ) {
    const profile = post.author?.profile;
    const counts = { SUPPORT: 0, HUG: 0, INSIGHTFUL: 0 };
    let viewerReaction: ReactionKind | null = null;
    for (const reaction of post.reactions ?? []) {
      counts[reaction.kind] += 1;
      if (reaction.userId === viewerId) viewerReaction = reaction.kind;
    }

    const isAuthor = this.policy.isPostAuthor(post, viewerId);

    return {
      id: post.id,
      body: post.body,
      visibility: post.visibility,
      status: post.status,
      version: post.version,
      isEdited: Boolean(post.editedAt),
      editedAt: post.editedAt?.toISOString() ?? null,
      createdAt: post.createdAt.toISOString(),
      deletedAt: post.deletedAt?.toISOString() ?? null,
      isAnonymous: post.isAnonymous,
      author: post.isAnonymous
        ? {
            isAnonymous: true as const,
            displayLabel: post.anonymousAuthor?.displayLabel ?? 'Anonymous',
          }
        : {
            isAnonymous: false as const,
            id: post.authorUserId!,
            username: profile?.username ?? 'member',
            displayName: profile?.displayName ?? 'Member',
            avatar: this.media.serializeMedia(profile?.avatarMediaId),
          },
      media: (post.media ?? []).map((item) => ({
        id: item.mediaId,
        position: item.position,
        altText: item.altText,
        url: this.media.mediaUrl(item.mediaId),
      })),
      linkPreview: post.linkPreview
        ? {
            sourceUrl: post.linkPreview.sourceUrl,
            canonicalUrl: post.linkPreview.canonicalUrl,
            title: post.linkPreview.title,
            description: post.linkPreview.description,
            siteName: post.linkPreview.siteName,
            fetchStatus: post.linkPreview.fetchStatus,
          }
        : null,
      reactions: { counts, viewerReaction },
      commentCount: (post as { _count?: { comments: number } })._count?.comments ?? 0,
      viewer: {
        isAuthor,
        canEdit:
          isAuthor &&
          post.status === 'ACTIVE' &&
          Date.now() - post.createdAt.getTime() <= POST_EDIT_WINDOW_MS,
        canDelete: isAuthor && post.status === 'ACTIVE',
        canConnect: !post.isAnonymous,
        canMessage: !post.isAnonymous,
      },
    };
  }
}
