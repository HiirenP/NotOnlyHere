import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { OutboxModule } from '../outbox/outbox.module';
import { LegacyRedirectService } from './legacy-redirect.service';
import {
  AdminMigrationController,
  LegacyRedirectController,
  MigrationClaimController,
} from './migration.controller';
import { MigrationClaimService } from './migration-claim.service';
import { MigrationImportService } from './migration-import.service';
import { MigrationReconciliationService } from './migration-reconciliation.service';

@Module({
  imports: [AuthModule, AdminModule, OutboxModule],
  controllers: [LegacyRedirectController, MigrationClaimController, AdminMigrationController],
  providers: [
    MigrationImportService,
    MigrationReconciliationService,
    LegacyRedirectService,
    MigrationClaimService,
  ],
  exports: [MigrationImportService, MigrationReconciliationService, LegacyRedirectService, MigrationClaimService],
})
export class MigrationModule {}
