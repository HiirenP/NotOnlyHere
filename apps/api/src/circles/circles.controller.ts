import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { CircleJoinPolicy, CircleVisibility } from '@prisma/client';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CircleAdminService } from './circle-admin.service';
import { CircleInvitesService } from './circle-invites.service';
import { CircleMembershipService } from './circle-membership.service';
import { CirclesService } from './circles.service';
import { FeedService } from '../feed/feed.service';

@Controller('circles')
@UseGuards(AuthGuard)
export class CirclesController {
  constructor(
    private readonly circles: CirclesService,
    private readonly membership: CircleMembershipService,
    private readonly admin: CircleAdminService,
    private readonly invites: CircleInvitesService,
    private readonly feed: FeedService,
  ) {}

  @Post()
  create(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      name: string;
      description: string;
      guidelines: string;
      visibility: CircleVisibility;
      joinPolicy: CircleJoinPolicy;
    },
  ) {
    return this.admin.createCircle(req.user.id, body);
  }

  @Get()
  list(
    @Req() req: Request & { user: { id: string } },
    @Query('q') q?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.circles.listCircles(req.user.id, {
      q,
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  get(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.circles.getCircle(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      guidelines?: string;
      visibility?: CircleVisibility;
      joinPolicy?: CircleJoinPolicy;
      version: number;
    },
  ) {
    return this.admin.updateCircle(id, req.user.id, body);
  }

  @Delete(':id')
  archive(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.admin.archiveCircle(id, req.user.id);
  }

  @Get(':id/feed')
  circleFeed(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.feed.listCircleFeed(id, req.user.id, {
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id/members')
  listMembers(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.circles.listMembers(id, req.user.id, {
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id/membership-requests')
  listRequests(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.admin.listPendingRequests(id, req.user.id);
  }

  @Post(':id/membership-requests/:userId/approve')
  approve(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.admin.approveRequest(id, req.user.id, userId);
  }

  @Post(':id/membership-requests/:userId/decline')
  declineRequest(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.admin.declineRequest(id, req.user.id, userId);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.admin.removeMember(id, req.user.id, userId);
  }

  @Post(':id/membership')
  join(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.membership.join(id, req.user.id);
  }

  @Delete(':id/membership')
  leave(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.membership.leave(id, req.user.id);
  }

  @Post(':id/invites')
  createInvite(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { inviteeUserId: string },
  ) {
    return this.invites.createInvite(id, req.user.id, body.inviteeUserId);
  }

  @Get(':id/invites')
  listInvites(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.invites.listInvites(id, req.user.id);
  }

  @Delete(':id/invites/:inviteId')
  revokeInvite(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.invites.revokeInvite(id, req.user.id, inviteId);
  }

  @Put(':id/mutes/:userId')
  mute(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { reason?: string },
  ) {
    return this.admin.muteMember(id, req.user.id, userId, body.reason);
  }

  @Delete(':id/mutes/:userId')
  unmute(@Req() req: Request & { user: { id: string } }, @Param('id') id: string, @Param('userId') userId: string) {
    return this.admin.unmuteMember(id, req.user.id, userId);
  }

  @Post(':id/posts/:postId/remove')
  removePost(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('postId') postId: string,
    @Body() body: { reason: string },
  ) {
    return this.admin.removeCirclePost(id, req.user.id, postId, body.reason);
  }
}

@Controller('circle-invites')
@UseGuards(AuthGuard)
export class CircleInvitesController {
  constructor(private readonly invites: CircleInvitesService) {}

  @Post(':token/accept')
  accept(@Req() req: Request & { user: { id: string } }, @Param('token') token: string) {
    return this.invites.accept(token, req.user.id);
  }

  @Post(':token/decline')
  decline(@Req() req: Request & { user: { id: string } }, @Param('token') token: string) {
    return this.invites.decline(token, req.user.id);
  }

  @Delete(':id')
  revoke(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.invites.revokeInviteById(id, req.user.id);
  }
}
