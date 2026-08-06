import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import type { AiFlagStatus } from '@prisma/client';
import type { Request } from 'express';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { ModerationService } from './moderation.service';

@Controller('admin/ai/flags')
@UseGuards(AuthGuard, AdminGuard)
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  @Get()
  @AdminPermission('ai_flags.review')
  list(
    @Query('status') status?: AiFlagStatus,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.moderation.listFlags({ status, cursor, limit: limit ? Number(limit) : undefined });
  }

  @Get(':id')
  @AdminPermission('ai_flags.review')
  get(@Param('id') id: string) {
    return this.moderation.getFlag(id);
  }

  @Patch(':id')
  @AdminPermission('ai_flags.review')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { status: AiFlagStatus; resolutionNote?: string | null },
  ) {
    return this.moderation.updateFlag(id, req.user.id, body);
  }
}
