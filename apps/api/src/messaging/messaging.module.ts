import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ConversationsService } from './conversations.service';
import { ConversationsController, MessagesController } from './messaging.controller';
import { MessagingPolicyService } from './messaging-policy.service';
import { MessagesService } from './messages.service';

@Module({
  imports: [AuthModule, forwardRef(() => NotificationsModule)],
  controllers: [ConversationsController, MessagesController],
  providers: [MessagingPolicyService, ConversationsService, MessagesService],
  exports: [MessagingPolicyService, ConversationsService, MessagesService],
})
export class MessagingModule {}
