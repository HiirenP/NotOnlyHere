import { Module } from '@nestjs/common';
import { AnonymousModule } from '../anonymous/anonymous.module';
import { AuthModule } from '../auth/auth.module';
import { ActivityService } from '../activity/activity.service';
import { MediaService } from '../media/media.service';
import {
  CommentsController,
  FeedController,
  LinkPreviewsController,
  PostsController,
} from './feed.controller';
import { CommentsService, ReactionsService } from './comments.service';
import { OutboxModule } from '../outbox/outbox.module';
import { FeedPolicyService } from './feed-policy.service';
import { FeedService } from './feed.service';
import { LinkPreviewService } from './link-preview.service';
import { PostsService } from './posts.service';
import { SearchService } from './search.service';

@Module({
  imports: [AuthModule, AnonymousModule, OutboxModule],
  controllers: [FeedController, PostsController, CommentsController, LinkPreviewsController],
  providers: [
    FeedService,
    PostsService,
    FeedPolicyService,
    ActivityService,
    MediaService,
    CommentsService,
    ReactionsService,
    LinkPreviewService,
    SearchService,
  ],
  exports: [FeedPolicyService, PostsService, FeedService],
})
export class FeedModule {}
