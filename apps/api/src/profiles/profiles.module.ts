import { Module } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { AuthModule } from '../auth/auth.module';
import { FeedModule } from '../feed/feed.module';
import { MediaService } from '../media/media.service';
import {
  BlocksController,
  ConnectionsController,
  MediaController,
  ProfilesController,
} from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { BlockService } from '../social/block.service';
import { ConnectionService } from '../social/connection.service';

@Module({
  imports: [AuthModule, FeedModule],
  controllers: [ProfilesController, ConnectionsController, BlocksController, MediaController],
  providers: [
    ProfilesService,
    BlockService,
    ConnectionService,
    ActivityService,
    MediaService,
  ],
  exports: [BlockService, ConnectionService],
})
export class ProfilesModule {}
