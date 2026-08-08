"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CirclesModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const audit_service_1 = require("../audit/audit.service");
const feed_module_1 = require("../feed/feed.module");
const notifications_module_1 = require("../notifications/notifications.module");
const outbox_module_1 = require("../outbox/outbox.module");
const circle_admin_service_1 = require("./circle-admin.service");
const circle_invites_service_1 = require("./circle-invites.service");
const circle_membership_service_1 = require("./circle-membership.service");
const circle_policy_service_1 = require("./circle-policy.service");
const circles_controller_1 = require("./circles.controller");
const circles_service_1 = require("./circles.service");
let CirclesModule = class CirclesModule {
};
exports.CirclesModule = CirclesModule;
exports.CirclesModule = CirclesModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, outbox_module_1.OutboxModule, (0, common_1.forwardRef)(() => feed_module_1.FeedModule), (0, common_1.forwardRef)(() => notifications_module_1.NotificationsModule)],
        controllers: [circles_controller_1.CirclesController, circles_controller_1.CircleInvitesController],
        providers: [
            circles_service_1.CirclesService,
            circle_policy_service_1.CirclePolicyService,
            circle_membership_service_1.CircleMembershipService,
            circle_admin_service_1.CircleAdminService,
            circle_invites_service_1.CircleInvitesService,
            audit_service_1.AuditService,
        ],
        exports: [circles_service_1.CirclesService, circle_policy_service_1.CirclePolicyService, circle_membership_service_1.CircleMembershipService, circle_invites_service_1.CircleInvitesService, circle_admin_service_1.CircleAdminService],
    })
], CirclesModule);
//# sourceMappingURL=circles.module.js.map