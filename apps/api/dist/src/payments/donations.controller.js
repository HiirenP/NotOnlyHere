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
exports.AdminDonationsController = exports.DonationsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../admin/admin.guard");
const auth_guard_1 = require("../auth/auth.guard");
const donations_service_1 = require("./donations.service");
let DonationsController = class DonationsController {
    donations;
    constructor(donations) {
        this.donations = donations;
    }
    createCheckout(req, body) {
        return this.donations.createCheckoutSession(req.user.id, body);
    }
    getStatus(publicId) {
        return this.donations.getStatus(publicId);
    }
};
exports.DonationsController = DonationsController;
__decorate([
    (0, common_1.Post)('checkout-session'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Get)(':publicId/status'),
    __param(0, (0, common_1.Param)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "getStatus", null);
exports.DonationsController = DonationsController = __decorate([
    (0, common_1.Controller)('donations'),
    __metadata("design:paramtypes", [donations_service_1.DonationsService])
], DonationsController);
let AdminDonationsController = class AdminDonationsController {
    donations;
    constructor(donations) {
        this.donations = donations;
    }
    list(cursor, limit) {
        return this.donations.listForAdmin({ cursor, limit: limit ? Number(limit) : undefined });
    }
};
exports.AdminDonationsController = AdminDonationsController;
__decorate([
    (0, common_1.Get)(),
    (0, admin_guard_1.AdminPermission)('donation.read'),
    __param(0, (0, common_1.Query)('cursor')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminDonationsController.prototype, "list", null);
exports.AdminDonationsController = AdminDonationsController = __decorate([
    (0, common_1.Controller)('admin/donations'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [donations_service_1.DonationsService])
], AdminDonationsController);
//# sourceMappingURL=donations.controller.js.map