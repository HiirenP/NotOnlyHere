import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { WellnessService } from './wellness.service';

@Controller('wellness')
@UseGuards(AuthGuard)
export class WellnessController {
  constructor(private readonly wellness: WellnessService) {}

  @Get('checkins')
  list(
    @Req() req: Request & { user: { id: string } },
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.wellness.listCheckins(req.user.id, { cursor, limit: limit ? Number(limit) : undefined });
  }

  @Post('checkins')
  upsert(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { mood: number; note?: string | null; timeZone: string; version?: number },
  ) {
    return this.wellness.upsertCheckin(req.user.id, body);
  }

  @Get('checkins/:id')
  get(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.wellness.getCheckin(id, req.user.id);
  }

  @Patch('checkins/:id')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { mood: number; note?: string | null; timeZone: string; version: number },
  ) {
    return this.wellness.updateCheckinById(id, req.user.id, body);
  }

  @Delete('checkins/:id')
  remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.wellness.deleteCheckin(id, req.user.id);
  }

  @Get('trends')
  trends(
    @Req() req: Request & { user: { id: string } },
    @Query('window') window: '7d' | '30d' = '7d',
    @Query('timeZone') timeZone = 'UTC',
  ) {
    return this.wellness.trends(req.user.id, window === '30d' ? '30d' : '7d', timeZone);
  }
}
