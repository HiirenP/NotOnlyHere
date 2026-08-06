import { Module, forwardRef } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { MessagingModule } from '../messaging/messaging.module';
import { OutboxModule } from '../outbox/outbox.module';
import { BroadcastsService } from './broadcasts.service';
import { BroadcastsController, NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [AuthModule, OutboxModule, AdminModule, forwardRef(() => MessagingModule)],
  controllers: [NotificationsController, BroadcastsController],
  providers: [NotificationsService, BroadcastsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
