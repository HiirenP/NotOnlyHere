"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationModule = void 0;
const common_1 = require("@nestjs/common");
const admin_module_1 = require("../admin/admin.module");
const auth_module_1 = require("../auth/auth.module");
const outbox_module_1 = require("../outbox/outbox.module");
const legacy_redirect_service_1 = require("./legacy-redirect.service");
const migration_controller_1 = require("./migration.controller");
const migration_claim_service_1 = require("./migration-claim.service");
const migration_import_service_1 = require("./migration-import.service");
const migration_reconciliation_service_1 = require("./migration-reconciliation.service");
let MigrationModule = class MigrationModule {
};
exports.MigrationModule = MigrationModule;
exports.MigrationModule = MigrationModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, admin_module_1.AdminModule, outbox_module_1.OutboxModule],
        controllers: [migration_controller_1.LegacyRedirectController, migration_controller_1.MigrationClaimController, migration_controller_1.AdminMigrationController],
        providers: [
            migration_import_service_1.MigrationImportService,
            migration_reconciliation_service_1.MigrationReconciliationService,
            legacy_redirect_service_1.LegacyRedirectService,
            migration_claim_service_1.MigrationClaimService,
        ],
        exports: [migration_import_service_1.MigrationImportService, migration_reconciliation_service_1.MigrationReconciliationService, legacy_redirect_service_1.LegacyRedirectService, migration_claim_service_1.MigrationClaimService],
    })
], MigrationModule);
//# sourceMappingURL=migration.module.js.map