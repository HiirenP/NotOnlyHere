import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('admin/analytics')
@UseGuards(AuthGuard, AdminGuard)
export class AdminAnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('users')
  @AdminPermission('analytics.read')
  users(
    @Req() req: Request & { user: { id: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analytics.getUsersOverview(req.user.id, { from, to });
  }

  @Get('engagement')
  @AdminPermission('analytics.read')
  engagement(
    @Req() req: Request & { user: { id: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analytics.getEngagement(req.user.id, { from, to });
  }

  @Get('funnel')
  @AdminPermission('analytics.read')
  funnel(
    @Req() req: Request & { user: { id: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analytics.getFunnel(req.user.id, { from, to });
  }

  @Post('exports')
  @AdminPermission('analytics.export')
  createExport(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      reportType: string;
      filters?: { from?: string; to?: string };
      idempotencyKey: string;
    },
  ) {
    return this.analytics.createExport(req.user.id, {
      reportType: body.reportType,
      filters: body.filters ?? {},
      idempotencyKey: body.idempotencyKey,
    });
  }

  @Get('exports/:id')
  @AdminPermission('analytics.read')
  getExport(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.analytics.getExport(req.user.id, id);
  }
}
