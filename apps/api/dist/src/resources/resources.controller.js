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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../admin/admin.guard");
const auth_guard_1 = require("../auth/auth.guard");
const purchases_service_1 = require("../payments/purchases.service");
const resources_service_1 = require("./resources.service");
let ResourcesController = class ResourcesController {
    resources;
    purchases;
    constructor(resources, purchases) {
        this.resources = resources;
        this.purchases = purchases;
    }
    list(req, q, kind, cursor, limit) {
        return this.resources.listResources(req.user.id, { q, kind, cursor, limit: limit ? Number(limit) : undefined });
    }
    progress(req, id, body) {
        return this.resources.updateProgress(id, req.user.id, body);
    }
    purchaseSession(req, id, body) {
        return this.purchases.createPurchaseSession(req.user.id, id, body.idempotencyKey);
    }
    get(req, slug) {
        return this.resources.getResourceBySlug(slug, req.user.id);
    }
    create(req, body) {
        return this.resources.createResource(req.user.id, body);
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('kind')),
    __param(3, (0, common_1.Query)('cursor')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "list", null);
__decorate([
    (0, common_1.Put)(':id/progress'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "progress", null);
__decorate([
    (0, common_1.Post)(':id/purchase-session'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "purchaseSession", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, admin_guard_1.AdminPermission)('resource.write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "create", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, common_1.Controller)('resources'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService,
        purchases_service_1.PurchasesService])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map