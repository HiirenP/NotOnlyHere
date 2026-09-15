"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_guard_1 = require("./auth.guard");
const auth_service_1 = require("./auth.service");
const email_token_service_1 = require("./email-token.service");
const oauth_controller_1 = require("./oauth.controller");
const oauth_service_1 = require("./oauth.service");
const password_service_1 = require("./password.service");
const session_service_1 = require("./session.service");
const outbox_module_1 = require("../outbox/outbox.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [outbox_module_1.OutboxModule],
        controllers: [auth_controller_1.AuthController, auth_controller_1.AccountSessionsController, oauth_controller_1.OAuthController],
        providers: [
            auth_service_1.AuthService,
            session_service_1.SessionService,
            auth_guard_1.AuthGuard,
            password_service_1.PasswordService,
            email_token_service_1.EmailTokenService,
            oauth_service_1.OAuthService,
        ],
        exports: [session_service_1.SessionService, auth_guard_1.AuthGuard, auth_service_1.AuthService, email_token_service_1.EmailTokenService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map