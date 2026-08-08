"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const admin_module_1 = require("../admin/admin.module");
const auth_module_1 = require("../auth/auth.module");
const messaging_module_1 = require("../messaging/messaging.module");
const outbox_module_1 = require("../outbox/outbox.module");
const broadcasts_service_1 = require("./broadcasts.service");
const notifications_controller_1 = require("./notifications.controller");
const notifications_service_1 = require("./notifications.service");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, outbox_module_1.OutboxModule, admin_module_1.AdminModule, (0, common_1.forwardRef)(() => messaging_module_1.MessagingModule)],
        controllers: [notifications_controller_1.NotificationsController, notifications_controller_1.BroadcastsController],
        providers: [notifications_service_1.NotificationsService, broadcasts_service_1.BroadcastsService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map