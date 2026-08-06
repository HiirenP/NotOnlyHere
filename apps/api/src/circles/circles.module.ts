import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuditService } from '../audit/audit.service';
import { FeedModule } from '../feed/feed.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { OutboxModule } from '../outbox/outbox.module';
import { CircleAdminService } from './circle-admin.service';
import { CircleInvitesService } from './circle-invites.service';
import { CircleMembershipService } from './circle-membership.service';
import { CirclePolicyService } from './circle-policy.service';
import { CircleInvitesController, CirclesController } from './circles.controller';
import { CirclesService } from './circles.service';

@Module({
  imports: [AuthModule, OutboxModule, forwardRef(() => FeedModule), forwardRef(() => NotificationsModule)],
  controllers: [CirclesController, CircleInvitesController],
  providers: [
    CirclesService,
    CirclePolicyService,
    CircleMembershipService,
    CircleAdminService,
    CircleInvitesService,
    AuditService,
  ],
  exports: [CirclesService, CirclePolicyService, CircleMembershipService, CircleInvitesService, CircleAdminService],
})
export class CirclesModule {}
