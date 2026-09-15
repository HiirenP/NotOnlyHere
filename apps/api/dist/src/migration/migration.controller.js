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
exports.AdminMigrationController = exports.MigrationClaimController = exports.LegacyRedirectController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../admin/admin.guard");
const auth_guard_1 = require("../auth/auth.guard");
const legacy_redirect_service_1 = require("./legacy-redirect.service");
const migration_claim_service_1 = require("./migration-claim.service");
const migration_import_service_1 = require("./migration-import.service");
const migration_reconciliation_service_1 = require("./migration-reconciliation.service");
let LegacyRedirectController = class LegacyRedirectController {
    redirects;
    constructor(redirects) {
        this.redirects = redirects;
    }
    resolve(path) {
        return this.redirects.resolve(path ?? '/');
    }
};
exports.LegacyRedirectController = LegacyRedirectController;
__decorate([
    (0, common_1.Get)('resolve'),
    __param(0, (0, common_1.Query)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LegacyRedirectController.prototype, "resolve", null);
exports.LegacyRedirectController = LegacyRedirectController = __decorate([
    (0, common_1.Controller)('legacy'),
    __metadata("design:paramtypes", [legacy_redirect_service_1.LegacyRedirectService])
], LegacyRedirectController);
let MigrationClaimController = class MigrationClaimController {
    claims;
    constructor(claims) {
        this.claims = claims;
    }
    requestClaim(body) {
        return this.claims.requestClaim(body.email);
    }
};
exports.MigrationClaimController = MigrationClaimController;
__decorate([
    (0, common_1.Post)('claim-request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MigrationClaimController.prototype, "requestClaim", null);
exports.MigrationClaimController = MigrationClaimController = __decorate([
    (0, common_1.Controller)('auth/migration'),
    __metadata("design:paramtypes", [migration_claim_service_1.MigrationClaimService])
], MigrationClaimController);
let AdminMigrationController = class AdminMigrationController {
    imports;
    reconciliation;
    redirects;
    constructor(imports, reconciliation, redirects) {
        this.imports = imports;
        this.reconciliation = reconciliation;
        this.redirects = redirects;
    }
    startRun(req, body) {
        return this.imports.runImport(req.user.id, body);
    }
    runReport(id) {
        return this.reconciliation.getRunReport(id);
    }
    summary() {
        return this.reconciliation.getLatestSummary();
    }
    readiness() {
        return this.reconciliation.getReleaseReadiness();
    }
    listRedirects() {
        return this.redirects.list();
    }
    upsertRedirect(body) {
        return this.redirects.upsert(body);
    }
};
exports.AdminMigrationController = AdminMigrationController;
__decorate([
    (0, common_1.Post)('runs'),
    (0, admin_guard_1.AdminPermission)('migration.write'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminMigrationController.prototype, "startRun", null);
__decorate([
    (0, common_1.Get)('runs/:id/reconciliation'),
    (0, admin_guard_1.AdminPermission)('migration.read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminMigrationController.prototype, "runReport", null);
__decorate([
    (0, common_1.Get)('reconciliation'),
    (0, admin_guard_1.AdminPermission)('migration.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminMigrationController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('release-readiness'),
    (0, admin_guard_1.AdminPermission)('migration.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminMigrationController.prototype, "readiness", null);
__decorate([
    (0, common_1.Get)('redirects'),
    (0, admin_guard_1.AdminPermission)('migration.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminMigrationController.prototype, "listRedirects", null);
__decorate([
    (0, common_1.Post)('redirects'),
    (0, admin_guard_1.AdminPermission)('migration.write'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminMigrationController.prototype, "upsertRedirect", null);
exports.AdminMigrationController = AdminMigrationController = __decorate([
    (0, common_1.Controller)('admin/migration'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [migration_import_service_1.MigrationImportService,
        migration_reconciliation_service_1.MigrationReconciliationService,
        legacy_redirect_service_1.LegacyRedirectService])
], AdminMigrationController);
//# sourceMappingURL=migration.controller.js.map