import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { BroadcastsService } from './broadcasts.service';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(
    @Req() req: Request & { user: { id: string } },
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notifications.list(req.user.id, { cursor, limit: limit ? Number(limit) : undefined });
  }

  @Patch(':id/read')
  markRead(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.notifications.markRead(id, req.user.id);
  }

  @Post('read-all')
  markAllRead(@Req() req: Request & { user: { id: string } }) {
    return this.notifications.markAllRead(req.user.id);
  }
}

@Controller('admin/broadcasts')
@UseGuards(AuthGuard, AdminGuard)
export class BroadcastsController {
  constructor(private readonly broadcasts: BroadcastsService) {}

  @Post()
  @AdminPermission('broadcast.create')
  create(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: { title: string; body: string; audienceType: 'ALL_ACTIVE'; idempotencyKey: string },
  ) {
    return this.broadcasts.create(req.user.id, body);
  }

  @Get(':id')
  @AdminPermission('broadcast.read')
  get(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.broadcasts.get(id, req.user.id);
  }
}
