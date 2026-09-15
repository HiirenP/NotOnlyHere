"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
const conversations_service_1 = require("./conversations.service");
const messaging_controller_1 = require("./messaging.controller");
const messaging_policy_service_1 = require("./messaging-policy.service");
const messages_service_1 = require("./messages.service");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, (0, common_1.forwardRef)(() => notifications_module_1.NotificationsModule)],
        controllers: [messaging_controller_1.ConversationsController, messaging_controller_1.MessagesController],
        providers: [messaging_policy_service_1.MessagingPolicyService, conversations_service_1.ConversationsService, messages_service_1.MessagesService],
        exports: [messaging_policy_service_1.MessagingPolicyService, conversations_service_1.ConversationsService, messages_service_1.MessagesService],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map