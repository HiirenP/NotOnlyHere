import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { AnonymousModule } from './anonymous/anonymous.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { OutboxModule } from './outbox/outbox.module';
import { FeedModule } from './feed/feed.module';
import { CirclesModule } from './circles/circles.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WellnessModule } from './wellness/wellness.module';
import { EventsModule } from './events/events.module';
import { AiModule } from './ai/ai.module';
import { ModerationModule } from './moderation/moderation.module';
import { PaymentsModule } from './payments/payments.module';
import { BlogModule } from './blog/blog.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MigrationModule } from './migration/migration.module';
import { ResourcesModule } from './resources/resources.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PrismaModule } from './prisma/prisma.module';
import { RequestIdMiddleware } from './common/request-id.middleware';

@Module({
  imports: [PrismaModule, HealthModule, AuthModule, AccountModule, OutboxModule, ProfilesModule, FeedModule, AnonymousModule, AdminModule, CirclesModule, MessagingModule, NotificationsModule, WellnessModule, EventsModule, AiModule, ModerationModule, ResourcesModule, PaymentsModule, BlogModule, AnalyticsModule, MigrationModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
