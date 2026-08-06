import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly messages: MessagesService,
  ) {}

  @Get()
  list(@Req() req: Request & { user: { id: string } }) {
    return this.conversations.list(req.user.id);
  }

  @Post()
  create(@Req() req: Request & { user: { id: string } }, @Body() body: { userId: string }) {
    return this.conversations.createOrGet(req.user.id, body.userId);
  }

  @Get(':id')
  get(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.conversations.get(id, req.user.id);
  }

  @Get(':id/messages')
  listMessages(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messages.list(id, req.user.id, { cursor, limit: limit ? Number(limit) : undefined });
  }

  @Post(':id/messages')
  send(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { body: string; clientMessageId: string },
  ) {
    return this.messages.send(id, req.user.id, body);
  }
}

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Put(':id/reactions/:emoji')
  react(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('emoji') emoji: string,
  ) {
    return this.messages.setReaction(id, req.user.id, decodeURIComponent(emoji));
  }

  @Delete(':id/reactions/:emoji')
  unreact(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('emoji') emoji: string,
  ) {
    return this.messages.removeReaction(id, req.user.id, decodeURIComponent(emoji));
  }
}
