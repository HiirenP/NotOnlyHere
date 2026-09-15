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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const auth_guard_1 = require("../auth/auth.guard");
const account_lifecycle_service_1 = require("./account-lifecycle.service");
let AccountController = class AccountController {
    exports;
    deletions;
    constructor(exports, deletions) {
        this.exports = exports;
        this.deletions = deletions;
    }
    getAccount(req) {
        const user = req.user;
        return {
            id: user.id,
            email: user.email,
            status: user.status,
            displayName: user.profile?.displayName ?? 'Member',
            username: user.profile?.username ?? 'member',
            roles: user.adminUserRoles.map((r) => r.role.key),
        };
    }
    requestExport(req, body) {
        return this.exports.requestExport(req.user.id, body.password, body.idempotencyKey);
    }
    getExport(req) {
        return this.exports.getLatestExport(req.user.id);
    }
    async downloadExport(req, id, res) {
        const exportRow = await this.exports.getExportForDownload(req.user.id, id);
        const exportDir = process.env.EXPORT_STORAGE_DIR ?? (0, node_path_1.join)(process.cwd(), '.exports');
        const filePath = (0, node_path_1.join)(exportDir, `${exportRow.id}.json`);
        const payload = await (0, promises_1.readFile)(filePath, 'utf8');
        res.setHeader('content-type', 'application/json');
        res.setHeader('content-disposition', `attachment; filename="notonlyhere-export-${exportRow.id}.json"`);
        res.send(payload);
    }
    requestDeletion(req, body) {
        return this.deletions.requestDeletion(req.user.id, body.password);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Post)('export'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "requestExport", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "getExport", null);
__decorate([
    (0, common_1.Get)('export/:id/download'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "downloadExport", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "requestDeletion", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('account'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [account_lifecycle_service_1.AccountExportService,
        account_lifecycle_service_1.AccountDeletionService])
], AccountController);
//# sourceMappingURL=account.controller.js.map