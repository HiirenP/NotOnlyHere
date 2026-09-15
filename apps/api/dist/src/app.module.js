"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const account_module_1 = require("./account/account.module");
const admin_module_1 = require("./admin/admin.module");
const anonymous_module_1 = require("./anonymous/anonymous.module");
const auth_module_1 = require("./auth/auth.module");
const health_module_1 = require("./health/health.module");
const outbox_module_1 = require("./outbox/outbox.module");
const feed_module_1 = require("./feed/feed.module");
const circles_module_1 = require("./circles/circles.module");
const messaging_module_1 = require("./messaging/messaging.module");
const notifications_module_1 = require("./notifications/notifications.module");
const wellness_module_1 = require("./wellness/wellness.module");
const events_module_1 = require("./events/events.module");
const ai_module_1 = require("./ai/ai.module");
const moderation_module_1 = require("./moderation/moderation.module");
const payments_module_1 = require("./payments/payments.module");
const blog_module_1 = require("./blog/blog.module");
const analytics_module_1 = require("./analytics/analytics.module");
const migration_module_1 = require("./migration/migration.module");
const resources_module_1 = require("./resources/resources.module");
const profiles_module_1 = require("./profiles/profiles.module");
const prisma_module_1 = require("./prisma/prisma.module");
const request_id_middleware_1 = require("./common/request-id.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, health_module_1.HealthModule, auth_module_1.AuthModule, account_module_1.AccountModule, outbox_module_1.OutboxModule, profiles_module_1.ProfilesModule, feed_module_1.FeedModule, anonymous_module_1.AnonymousModule, admin_module_1.AdminModule, circles_module_1.CirclesModule, messaging_module_1.MessagingModule, notifications_module_1.NotificationsModule, wellness_module_1.WellnessModule, events_module_1.EventsModule, ai_module_1.AiModule, moderation_module_1.ModerationModule, resources_module_1.ResourcesModule, payments_module_1.PaymentsModule, blog_module_1.BlogModule, analytics_module_1.AnalyticsModule, migration_module_1.MigrationModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map