import { Injectable } from '@nestjs/common';
import type { PostVisibility } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type PostLike = {
  id: string;
  authorUserId: string | null;
  isAnonymous: boolean;
  visibility: PostVisibility;
  status: string;
  circleId?: string | null;
  anonymousAuthor?: { userId: string | null } | null;
};

@Injectable()
export class FeedPolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async getViewerContext(viewerId: string) {
    const [blocks, connections] = await Promise.all([
      this.prisma.userBlock.findMany({
        where: {
          OR: [{ blockerId: viewerId }, { blockedId: viewerId }],
        },
      }),
      this.prisma.connection.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [{ requesterId: viewerId }, { addresseeId: viewerId }],
        },
      }),
    ]);

    const blockedUserIds = new Set<string>();
    for (const block of blocks) {
      blockedUserIds.add(block.blockerId === viewerId ? block.blockedId : block.blockerId);
    }

    const connectedUserIds = new Set<string>();
    for (const connection of connections) {
      connectedUserIds.add(connection.requesterId === viewerId ? connection.addresseeId : connection.requesterId);
    }

    return { blockedUserIds, connectedUserIds };
  }

  resolveAuthorUserId(post: PostLike) {
    if (!post.isAnonymous) {
      return post.authorUserId;
    }
    return post.anonymousAuthor?.userId ?? null;
  }

  canViewPost(
    viewerId: string,
    post: PostLike,
    context: { blockedUserIds: Set<string>; connectedUserIds: Set<string> },
  ) {
    if (post.status !== 'ACTIVE') {
      return false;
    }

    const authorId = this.resolveAuthorUserId(post);
    if (authorId && context.blockedUserIds.has(authorId)) {
      return false;
    }

    if (post.visibility === 'ONLY_ME') {
      return authorId === viewerId;
    }
    if (post.visibility === 'CONNECTIONS') {
      return authorId === viewerId || (authorId ? context.connectedUserIds.has(authorId) : false);
    }
    return true;
  }

  isPostAuthor(
    post: PostLike & { anonymousAuthor?: { userId: string | null } | null },
    viewerId: string,
  ) {
    const authorId = this.resolveAuthorUserId(post);
    return authorId === viewerId;
  }

  isCommentAuthor(
    comment: {
      authorUserId: string | null;
      isAnonymous: boolean;
      anonymousAuthor?: { userId: string | null } | null;
    },
    viewerId: string,
  ) {
    if (!comment.isAnonymous) {
      return comment.authorUserId === viewerId;
    }
    return comment.anonymousAuthor?.userId === viewerId;
  }

  async getActiveCircleMembership(circleId: string, userId: string) {
    return this.prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId, userId } },
    });
  }

  async assertActiveCircleMember(circleId: string, userId: string) {
    const membership = await this.getActiveCircleMembership(circleId, userId);
    if (!membership || membership.status !== 'ACTIVE') {
      return null;
    }
    return membership;
  }

  async isCircleMuted(circleId: string, userId: string) {
    const mute = await this.prisma.circleMute.findUnique({
      where: { circleId_mutedUserId: { circleId, mutedUserId: userId } },
    });
    if (!mute) return false;
    if (mute.expiresAt && mute.expiresAt.getTime() < Date.now()) return false;
    return true;
  }

  canViewCirclePost(
    viewerId: string,
    post: PostLike,
    context: { blockedUserIds: Set<string>; connectedUserIds: Set<string> },
    isCircleMember: boolean,
  ) {
    if (post.circleId && !isCircleMember) return false;
    return this.canViewPost(viewerId, post, context);
  }
}
