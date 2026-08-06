import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SessionService } from '../auth/session.service';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly sessions: SessionService,
  ) {}

  @Post('events')
  async ingest(
    @Req() req: Request,
    @Body()
    body: {
      dedupId: string;
      eventKey: string;
      eventVersion: number;
      occurredAt: string;
      properties?: Record<string, unknown>;
      source: string;
      anonymousId?: string;
      sessionId?: string;
    },
  ) {
    const user = await this.sessions.resolveUserFromRequest(req);
    return this.analytics.ingestEvent({
      dedupId: body.dedupId,
      eventKey: body.eventKey,
      eventVersion: body.eventVersion,
      occurredAt: body.occurredAt,
      properties: body.properties,
      source: body.source,
      userId: user?.id ?? null,
      anonymousId: user ? null : body.anonymousId ?? null,
      sessionId: body.sessionId ?? null,
      requestId: req.headers['x-request-id']?.toString() ?? null,
    });
  }
}
