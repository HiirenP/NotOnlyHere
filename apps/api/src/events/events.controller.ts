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
import type { EventStatus, RsvpStatus } from '@prisma/client';
import type { Request } from 'express';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  list(
    @Req() req: Request & { user: { id: string } },
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('q') q?: string,
    @Query('view') view?: 'month' | 'list',
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.events.listEvents(req.user.id, {
      from,
      to,
      q,
      view,
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post()
  @UseGuards(AdminGuard)
  @AdminPermission('event.write')
  create(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      title: string;
      description: string;
      startsAt: string;
      endsAt: string;
      timeZone: string;
      locationName?: string | null;
      status?: EventStatus;
    },
  ) {
    return this.events.createEvent(req.user.id, body);
  }

  @Get(':id')
  get(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.events.getEvent(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @AdminPermission('event.write')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      startsAt?: string;
      endsAt?: string;
      timeZone?: string;
      locationName?: string | null;
      status?: EventStatus;
      version: number;
    },
  ) {
    return this.events.updateEvent(req.user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @AdminPermission('event.write')
  remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.events.deleteEvent(req.user.id, id);
  }

  @Put(':id/rsvp')
  rsvp(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { status: RsvpStatus },
  ) {
    return this.events.upsertRsvp(id, req.user.id, body.status);
  }

  @Delete(':id/rsvp')
  clearRsvp(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.events.deleteRsvp(id, req.user.id);
  }

  @Get(':id/attendees')
  attendees(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('status') status?: RsvpStatus,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.events.listAttendees(id, req.user.id, {
      status,
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
