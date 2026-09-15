"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnonymousModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const anonymous_controller_1 = require("./anonymous.controller");
const anonymous_quota_service_1 = require("./anonymous-quota.service");
const anonymous_service_1 = require("./anonymous.service");
let AnonymousModule = class AnonymousModule {
};
exports.AnonymousModule = AnonymousModule;
exports.AnonymousModule = AnonymousModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [anonymous_controller_1.AnonymousController],
        providers: [anonymous_quota_service_1.AnonymousQuotaService, anonymous_service_1.AnonymousService],
        exports: [anonymous_quota_service_1.AnonymousQuotaService, anonymous_service_1.AnonymousService],
    })
], AnonymousModule);
//# sourceMappingURL=anonymous.module.js.map