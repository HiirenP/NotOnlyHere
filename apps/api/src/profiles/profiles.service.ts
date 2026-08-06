import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ProfileResponse, UpdateProfileRequest } from '@notonlyhere/contracts';
import { isValidUsername, normalizeUsername } from '../auth/auth.constants';
import { ActivityService } from '../activity/activity.service';
import { BlockService } from '../social/block.service';
import { ConnectionService } from '../social/connection.service';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
    private readonly blocks: BlockService,
    private readonly connections: ConnectionService,
    private readonly activity: ActivityService,
  ) {}

  async getMyProfile(userId: string): Promise<ProfileResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user?.profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
    }
    return this.buildProfileResponse(user, user.profile, userId);
  }

  async getProfileByUsername(username: string, viewerId: string): Promise<ProfileResponse> {
    const normalized = normalizeUsername(username);
    const user = await this.prisma.user.findFirst({
      where: {
        status: 'ACTIVE',
        profile: { username: normalized },
      },
      include: { profile: true },
    });

    if (!user?.profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
    }

    if (user.id !== viewerId) {
      const blocked = await this.blocks.isBlockedEitherWay(viewerId, user.id);
      if (blocked) {
        throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
      }
    }

    return this.buildProfileResponse(user, user.profile, viewerId);
  }

  async updateMyProfile(userId: string, input: UpdateProfileRequest) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
    }

    if (input.version !== profile.version) {
      throw new ConflictException({
        code: 'VERSION_CONFLICT',
        message: 'Profile was updated elsewhere. Refresh and try again.',
      });
    }

    const data: {
      displayName?: string;
      username?: string;
      bio?: string | null;
      avatarMediaId?: string | null;
      coverMediaId?: string | null;
      version: { increment: number };
    } = { version: { increment: 1 } };

    if (input.displayName !== undefined) {
      const trimmed = input.displayName.trim();
      if (trimmed.length < 1 || trimmed.length > 80) {
        throw new BadRequestException({
          code: 'INVALID_DISPLAY_NAME',
          message: 'Display name must be 1–80 characters.',
        });
      }
      data.displayName = trimmed;
    }

    if (input.username !== undefined) {
      const username = normalizeUsername(input.username);
      if (!isValidUsername(username)) {
        throw new BadRequestException({
          code: 'INVALID_USERNAME',
          message: 'Username must be 3–30 characters: lowercase letters, numbers, underscore.',
        });
      }
      const taken = await this.prisma.profile.findFirst({
        where: { username, NOT: { userId } },
      });
      if (taken) {
        throw new ConflictException({ code: 'USERNAME_TAKEN', message: 'Username is already taken.' });
      }
      data.username = username;
    }

    if (input.bio !== undefined) {
      if (input.bio && input.bio.length > 500) {
        throw new BadRequestException({
          code: 'INVALID_BIO',
          message: 'Bio must be 500 characters or fewer.',
        });
      }
      data.bio = input.bio;
    }

    if (input.avatarMediaId !== undefined) {
      if (input.avatarMediaId) {
        await this.media.assertOwnedReadyMedia(userId, input.avatarMediaId, 'AVATAR');
      }
      data.avatarMediaId = input.avatarMediaId;
    }

    if (input.coverMediaId !== undefined) {
      if (input.coverMediaId) {
        await this.media.assertOwnedReadyMedia(userId, input.coverMediaId, 'PROFILE_COVER');
      }
      data.coverMediaId = input.coverMediaId;
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data,
    });

    await this.activity.recordProfileUpdated(userId);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { profile: true },
    });

    return this.buildProfileResponse(user, updated, userId);
  }

  private async buildProfileResponse(
    user: { id: string; createdAt: Date },
    profile: {
      userId: string;
      username: string;
      displayName: string;
      bio: string | null;
      avatarMediaId: string | null;
      coverMediaId: string | null;
      version: number;
    },
    viewerId: string,
  ): Promise<ProfileResponse> {
    const [connectionCount, viewer] = await Promise.all([
      this.connections.countAcceptedConnections(profile.userId),
      this.connections.getConnectionContext(viewerId, profile.userId),
    ]);

    return {
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      joinDate: user.createdAt.toISOString(),
      avatar: this.media.serializeMedia(profile.avatarMediaId),
      cover: this.media.serializeMedia(profile.coverMediaId),
      connectionCount,
      version: profile.version,
      viewer: {
        isSelf: viewerId === profile.userId,
        ...viewer,
      },
    };
  }
}
