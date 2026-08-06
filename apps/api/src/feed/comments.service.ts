import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ReactionKind } from '@prisma/client';
import { AnonymousQuotaService } from '../anonymous/anonymous-quota.service';
import { AnonymousService } from '../anonymous/anonymous.service';
import { FeedPolicyService } from './feed-policy.service';
import { POST_EDIT_WINDOW_MS, normalizeBody } from './feed.constants';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';

const COMMENT_MAX = 2000;
const REACTION_KINDS: ReactionKind[] = ['SUPPORT', 'HUG', 'INSIGHTFUL'];

const commentInclude = {
  author: { include: { profile: true } },
  anonymousAuthor: true,
  reactions: true,
};

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: FeedPolicyService,
    private readonly anonymous: AnonymousService,
    private readonly anonymousQuota: AnonymousQuotaService,
    private readonly outbox: OutboxService,
  ) {}

  async list(postId: string, viewerId: string) {
    await this.assertCanViewPost(postId, viewerId);
    const comments = await this.prisma.comment.findMany({
      where: { postId, status: 'ACTIVE' },
      include: commentInclude,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    return comments.map((comment) => this.serialize(comment, viewerId));
  }

  async create(
    postId: string,
    authorId: string,
    input: { body: string; parentCommentId?: string; isAnonymous?: boolean },
  ) {
    await this.assertCanViewPost(postId, authorId);
    const body = normalizeBody(input.body);
    if (!body) {
      throw new BadRequestException({ code: 'EMPTY_COMMENT', message: 'Comment cannot be empty.' });
    }
    if (body.length > COMMENT_MAX) {
      throw new BadRequestException({ code: 'COMMENT_TOO_LONG', message: 'Comment is too long.' });
    }

    const isAnonymous = Boolean(input.isAnonymous);
    if (isAnonymous) {
      await this.anonymousQuota.consumeQuota(authorId);
    }

    let parentCommentId: string | null = null;
    if (input.parentCommentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: input.parentCommentId } });
      if (!parent || parent.postId !== postId || parent.status !== 'ACTIVE') {
        throw new BadRequestException({ code: 'INVALID_PARENT', message: 'Parent comment not found.' });
      }
      parentCommentId = parent.parentCommentId ?? parent.id;
    }

    const comment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.comment.create({
        data: {
          postId,
          authorUserId: isAnonymous ? null : authorId,
          parentCommentId,
          body,
          isAnonymous,
        },
      });

      if (isAnonymous) {
        await tx.commentAnonymousAuthor.create({
          data: {
            commentId: created.id,
            userId: authorId,
            displayLabel: this.anonymous.createDisplayLabel(),
          },
        });
      }

      return tx.comment.findUniqueOrThrow({
        where: { id: created.id },
        include: commentInclude,
      });
    });

    await this.outbox.emitModerationEvaluate(comment.id, { commentId: comment.id });
    return this.serialize(comment, authorId);
  }

  async update(commentId: string, authorId: string, input: { body: string; version: number }) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: commentInclude,
    });
    if (!comment || comment.status !== 'ACTIVE') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Comment not found.' });
    }
    if (!this.policy.isCommentAuthor(comment, authorId)) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can edit this comment.' });
    }
    if (input.version !== comment.version) {
      throw new BadRequestException({ code: 'VERSION_CONFLICT', message: 'Comment was updated elsewhere.' });
    }
    if (Date.now() - comment.createdAt.getTime() > POST_EDIT_WINDOW_MS) {
      throw new BadRequestException({ code: 'EDIT_WINDOW_EXPIRED', message: 'Edit window expired.' });
    }

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { body: normalizeBody(input.body), version: { increment: 1 }, editedAt: new Date() },
      include: { author: { include: { profile: true } }, reactions: true },
    });
    return this.serialize(updated, authorId);
  }

  async delete(commentId: string, authorId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { anonymousAuthor: true },
    });
    if (!comment || comment.status !== 'ACTIVE') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Comment not found.' });
    }
    if (!this.policy.isCommentAuthor(comment, authorId)) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Only the author can delete this comment.' });
    }
    await this.prisma.comment.update({
      where: { id: commentId },
      data: { status: 'DELETED', deletedAt: new Date(), body: '[deleted]', version: { increment: 1 } },
    });
    return { ok: true };
  }

  private async assertCanViewPost(postId: string, viewerId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    const context = await this.policy.getViewerContext(viewerId);
    if (!this.policy.canViewPost(viewerId, post, context)) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    }
  }

  private serialize(
    comment: {
      id: string;
      postId: string;
      parentCommentId: string | null;
      body: string;
      status: string;
      version: number;
      editedAt: Date | null;
      createdAt: Date;
      isAnonymous: boolean;
      authorUserId: string | null;
      author: { profile: { username: string; displayName: string } | null } | null;
      anonymousAuthor?: { displayLabel: string; userId: string | null } | null;
      reactions: { kind: ReactionKind; userId: string }[];
    },
    viewerId: string,
  ) {
    const counts = { SUPPORT: 0, HUG: 0, INSIGHTFUL: 0 };
    let viewerReaction: ReactionKind | null = null;
    for (const reaction of comment.reactions) {
      counts[reaction.kind] += 1;
      if (reaction.userId === viewerId) viewerReaction = reaction.kind;
    }
    const isAuthor = this.policy.isCommentAuthor(comment, viewerId);
    return {
      id: comment.id,
      postId: comment.postId,
      parentCommentId: comment.parentCommentId,
      body: comment.body,
      status: comment.status,
      version: comment.version,
      isEdited: Boolean(comment.editedAt),
      createdAt: comment.createdAt.toISOString(),
      isAnonymous: comment.isAnonymous,
      author: comment.isAnonymous
        ? {
            isAnonymous: true as const,
            displayLabel: comment.anonymousAuthor?.displayLabel ?? 'Anonymous',
          }
        : {
            isAnonymous: false as const,
            id: comment.authorUserId!,
            username: comment.author?.profile?.username ?? 'member',
            displayName: comment.author?.profile?.displayName ?? 'Member',
          },
      reactions: { counts, viewerReaction },
      viewer: {
        isAuthor,
        canEdit:
          isAuthor &&
          comment.status === 'ACTIVE' &&
          Date.now() - comment.createdAt.getTime() <= POST_EDIT_WINDOW_MS,
        canDelete: isAuthor && comment.status === 'ACTIVE',
        canConnect: !comment.isAnonymous,
        canMessage: !comment.isAnonymous,
      },
    };
  }
}

@Injectable()
export class ReactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: FeedPolicyService,
  ) {}

  assertKind(kind: string): ReactionKind {
    if (!REACTION_KINDS.includes(kind as ReactionKind)) {
      throw new BadRequestException({ code: 'INVALID_REACTION', message: 'Invalid reaction kind.' });
    }
    return kind as ReactionKind;
  }

  async setPostReaction(postId: string, userId: string, kind: ReactionKind) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.status !== 'ACTIVE') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    }
    const context = await this.policy.getViewerContext(userId);
    if (!this.policy.canViewPost(userId, post, context)) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Post not found.' });
    }

    await this.prisma.postReaction.upsert({
      where: { postId_userId: { postId, userId } },
      update: { kind },
      create: { postId, userId, kind },
    });
    return this.getPostReactionSummary(postId, userId);
  }

  async removePostReaction(postId: string, userId: string) {
    await this.prisma.postReaction.deleteMany({ where: { postId, userId } });
    return this.getPostReactionSummary(postId, userId);
  }

  async getPostReactionSummary(postId: string, viewerId: string) {
    const reactions = await this.prisma.postReaction.findMany({ where: { postId } });
    const counts = { SUPPORT: 0, HUG: 0, INSIGHTFUL: 0 };
    let viewerReaction: ReactionKind | null = null;
    for (const reaction of reactions) {
      counts[reaction.kind] += 1;
      if (reaction.userId === viewerId) viewerReaction = reaction.kind;
    }
    return { counts, viewerReaction };
  }
}
