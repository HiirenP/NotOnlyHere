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
exports.AdminAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../admin/admin.guard");
const auth_guard_1 = require("../auth/auth.guard");
const analytics_service_1 = require("./analytics.service");
let AdminAnalyticsController = class AdminAnalyticsController {
    analytics;
    constructor(analytics) {
        this.analytics = analytics;
    }
    users(req, from, to) {
        return this.analytics.getUsersOverview(req.user.id, { from, to });
    }
    engagement(req, from, to) {
        return this.analytics.getEngagement(req.user.id, { from, to });
    }
    funnel(req, from, to) {
        return this.analytics.getFunnel(req.user.id, { from, to });
    }
    createExport(req, body) {
        return this.analytics.createExport(req.user.id, {
            reportType: body.reportType,
            filters: body.filters ?? {},
            idempotencyKey: body.idempotencyKey,
        });
    }
    getExport(req, id) {
        return this.analytics.getExport(req.user.id, id);
    }
};
exports.AdminAnalyticsController = AdminAnalyticsController;
__decorate([
    (0, common_1.Get)('users'),
    (0, admin_guard_1.AdminPermission)('analytics.read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "users", null);
__decorate([
    (0, common_1.Get)('engagement'),
    (0, admin_guard_1.AdminPermission)('analytics.read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "engagement", null);
__decorate([
    (0, common_1.Get)('funnel'),
    (0, admin_guard_1.AdminPermission)('analytics.read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "funnel", null);
__decorate([
    (0, common_1.Post)('exports'),
    (0, admin_guard_1.AdminPermission)('analytics.export'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "createExport", null);
__decorate([
    (0, common_1.Get)('exports/:id'),
    (0, admin_guard_1.AdminPermission)('analytics.read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminAnalyticsController.prototype, "getExport", null);
exports.AdminAnalyticsController = AdminAnalyticsController = __decorate([
    (0, common_1.Controller)('admin/analytics'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AdminAnalyticsController);
//# sourceMappingURL=admin-analytics.controller.js.map