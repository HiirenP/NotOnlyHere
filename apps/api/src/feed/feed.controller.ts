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
import type { FeedMode, PostVisibility, ReactionKind } from '@notonlyhere/contracts';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CommentsService, ReactionsService } from './comments.service';
import { FeedService } from './feed.service';
import { LinkPreviewService } from './link-preview.service';
import { PostsService } from './posts.service';
import { SearchService } from './search.service';

@Controller('feed')
@UseGuards(AuthGuard)
export class FeedController {
  constructor(
    private readonly feed: FeedService,
    private readonly search: SearchService,
  ) {}

  @Get()
  list(
    @Req() req: Request & { user: { id: string } },
    @Query('mode') mode?: FeedMode,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.feed.listFeed(req.user.id, { mode, cursor, limit: limit ? Number(limit) : undefined });
  }

  @Get('search')
  searchPosts(
    @Req() req: Request & { user: { id: string } },
    @Query('q') q: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.search.searchPosts(req.user.id, { q, cursor, limit: limit ? Number(limit) : undefined });
  }
}

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(
    private readonly posts: PostsService,
    private readonly comments: CommentsService,
    private readonly reactions: ReactionsService,
  ) {}

  @Post()
  create(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      body: string;
      visibility: PostVisibility;
      isAnonymous?: boolean;
      circleId?: string;
      idempotencyKey?: string;
      media?: { mediaId: string; position: number; altText?: string }[];
      linkPreviewUrl?: string;
    },
  ) {
    return this.posts.createPost(req.user.id, body);
  }

  @Get(':id')
  get(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.posts.getPost(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { body: string; version: number },
  ) {
    return this.posts.updatePost(id, req.user.id, body);
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.posts.deletePost(id, req.user.id);
  }

  @Get(':id/comments')
  listComments(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.comments.list(id, req.user.id);
  }

  @Post(':id/comments')
  createComment(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { body: string; parentCommentId?: string; isAnonymous?: boolean },
  ) {
    return this.comments.create(id, req.user.id, body);
  }

  @Put(':id/reactions/:kind')
  setReaction(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Param('kind') kind: ReactionKind,
  ) {
    return this.reactions.setPostReaction(id, req.user.id, this.reactions.assertKind(kind));
  }

  @Delete(':id/reactions/:kind')
  removeReaction(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.reactions.removePostReaction(id, req.user.id);
  }
}

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Patch(':id')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { body: string; version: number },
  ) {
    return this.comments.update(id, req.user.id, body);
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.comments.delete(id, req.user.id);
  }
}

@Controller('link-previews')
@UseGuards(AuthGuard)
export class LinkPreviewsController {
  constructor(private readonly linkPreviews: LinkPreviewService) {}

  @Post()
  preview(@Body() body: { url: string }) {
    return this.linkPreviews.fetchPreview(body.url);
  }
}
