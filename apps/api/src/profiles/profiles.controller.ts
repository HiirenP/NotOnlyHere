import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ActivityService } from '../activity/activity.service';
import { MediaService } from '../media/media.service';
import { ProfilesService } from './profiles.service';
import { BlockService } from '../social/block.service';
import { ConnectionService } from '../social/connection.service';
import { PostsService } from '../feed/posts.service';

@Controller('profiles')
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(
    private readonly profiles: ProfilesService,
    private readonly activity: ActivityService,
    private readonly posts: PostsService,
  ) {}

  @Get('me')
  getMe(@Req() req: Request & { user: { id: string } }) {
    return this.profiles.getMyProfile(req.user.id);
  }

  @Patch('me')
  updateMe(
    @Req() req: Request & { user: { id: string } },
    @Body() body: {
      displayName?: string;
      username?: string;
      bio?: string | null;
      avatarMediaId?: string | null;
      coverMediaId?: string | null;
      version: number;
    },
  ) {
    return this.profiles.updateMyProfile(req.user.id, body);
  }

  @Get(':username/posts')
  listPosts(
    @Req() req: Request & { user: { id: string } },
    @Param('username') username: string,
  ) {
    return this.posts.listByUsername(username, req.user.id);
  }

  @Get(':username')
  getByUsername(
    @Req() req: Request & { user: { id: string } },
    @Param('username') username: string,
  ) {
    return this.profiles.getProfileByUsername(username, req.user.id);
  }

  @Get(':username/activity')
  async getActivity(
    @Req() req: Request & { user: { id: string } },
    @Param('username') username: string,
  ) {
    const profile = await this.profiles.getProfileByUsername(username, req.user.id);
    if (!profile.viewer.isSelf) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Activity is only visible to the profile owner.' });
    }
    return this.activity.listForUser(profile.userId, req.user.id);
  }
}

@Controller('connections')
@UseGuards(AuthGuard)
export class ConnectionsController {
  constructor(private readonly connections: ConnectionService) {}

  @Get()
  list(@Req() req: Request & { user: { id: string } }) {
    return this.connections.listConnections(req.user.id);
  }

  @Post('requests')
  createRequest(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { username: string },
  ) {
    if (!body.username?.trim()) {
      throw new BadRequestException({ code: 'USERNAME_REQUIRED', message: 'Username is required.' });
    }
    return this.connections.sendRequest(req.user.id, body.username);
  }

  @Post(':id/accept')
  accept(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.connections.acceptConnection(id, req.user.id);
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.connections.removeConnection(id, req.user.id);
  }
}

@Controller('blocks')
@UseGuards(AuthGuard)
export class BlocksController {
  constructor(private readonly blocks: BlockService) {}

  @Get()
  async list(@Req() req: Request & { user: { id: string } }) {
    const rows = await this.blocks.listBlocks(req.user.id);
    return rows.map((row) => ({
      userId: row.blockedId,
      username: row.blocked.profile?.username ?? 'member',
      displayName: row.blocked.profile?.displayName ?? 'Member',
      blockedAt: row.createdAt.toISOString(),
    }));
  }

  @Post()
  async create(@Req() req: Request & { user: { id: string } }, @Body() body: { userId?: string; username?: string }) {
    const target = await this.blocks.resolveTargetUser(body);
    await this.blocks.blockUser(req.user.id, target.id);
    return { ok: true };
  }

  @Delete(':userId')
  async remove(@Req() req: Request & { user: { id: string } }, @Param('userId') userId: string) {
    await this.blocks.unblockUser(req.user.id, userId);
    return { ok: true };
  }
}

@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('uploads')
  @UseGuards(AuthGuard)
  createUpload(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { purpose: 'AVATAR' | 'PROFILE_COVER'; declaredMime: string; byteSize: number },
  ) {
    return this.media.createUploadIntent(req.user.id, body.purpose, body.declaredMime, body.byteSize);
  }

  @Post(':id/complete')
  @UseGuards(AuthGuard)
  completeUpload(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { uploadToken: string; width?: number; height?: number; detectedMime?: string },
  ) {
    return this.media.completeUpload(id, req.user.id, body.uploadToken, body);
  }

  @Get(':id/file')
  @UseGuards(AuthGuard)
  async serveFile(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.media.getReadableAsset(id, req.user.id);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#e8eaed"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#676a79" font-family="monospace" font-size="18">Media ${id.slice(0, 8)}</text></svg>`;
    res.setHeader('content-type', 'image/svg+xml');
    res.send(svg);
  }
}
