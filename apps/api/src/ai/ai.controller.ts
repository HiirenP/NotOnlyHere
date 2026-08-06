import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import type { AiConsentType } from '@prisma/client';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Get('consent')
  getConsent(@Req() req: Request & { user: { id: string } }) {
    return this.ai.getConsentStatus(req.user.id);
  }

  @Put('consent')
  updateConsent(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { consentType: AiConsentType; granted: boolean; source?: string },
  ) {
    return this.ai.updateConsent(req.user.id, body);
  }

  @Get('preferences')
  getPreferences(@Req() req: Request & { user: { id: string } }) {
    return this.ai.getPreferences(req.user.id);
  }

  @Put('preferences')
  updatePreferences(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { preferences: Record<string, string> },
  ) {
    return this.ai.updatePreferences(req.user.id, body.preferences ?? {});
  }

  @Get('conversations')
  listConversations(@Req() req: Request & { user: { id: string } }) {
    return this.ai.listConversations(req.user.id);
  }

  @Post('conversations')
  @HttpCode(HttpStatus.CREATED)
  createConversation(@Req() req: Request & { user: { id: string } }) {
    return this.ai.createConversation(req.user.id);
  }

  @Get('conversations/:id')
  getConversation(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.ai.getConversation(id, req.user.id);
  }

  @Delete('conversations/:id')
  deleteConversation(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.ai.deleteConversation(id, req.user.id);
  }

  @Get('conversations/:id/messages')
  listMessages(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.ai.listMessages(id, req.user.id, { cursor, limit: limit ? Number(limit) : undefined });
  }

  @Post('conversations/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  sendMessage(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.ai.sendMessage(id, req.user.id, body.content);
  }

  @Get('quota')
  quota(@Req() req: Request & { user: { id: string } }) {
    return this.ai.getQuota(req.user.id);
  }

  @Get('conversation-starters')
  starters() {
    return this.ai.getStarters();
  }

  @Get('circle-recommendations')
  recommendations(@Req() req: Request & { user: { id: string } }) {
    return this.ai.getCircleRecommendations(req.user.id);
  }
}
