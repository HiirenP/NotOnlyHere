"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = exports.AdminPermission = exports.ADMIN_PERMISSION_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const admin_permissions_service_1 = require("./admin-permissions.service");
exports.ADMIN_PERMISSION_KEY = 'adminPermission';
const AdminPermission = (permission) => (0, common_1.SetMetadata)(exports.ADMIN_PERMISSION_KEY, permission);
exports.AdminPermission = AdminPermission;
let AdminGuard = class AdminGuard {
    permissions;
    reflector;
    constructor(permissions, reflector) {
        this.permissions = permissions;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Admin access required.' });
        }
        const required = this.reflector.get(exports.ADMIN_PERMISSION_KEY, context.getHandler());
        if (!required) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Admin permission not configured.' });
        }
        const allowed = await this.permissions.hasPermission(user.id, required);
        if (!allowed) {
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Insufficient admin permissions.' });
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_permissions_service_1.AdminPermissionsService,
        core_1.Reflector])
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map