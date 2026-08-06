import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { LegacyRedirectService } from './legacy-redirect.service';
import { MigrationClaimService } from './migration-claim.service';
import { MigrationImportService, type MigrationFixture } from './migration-import.service';
import { MigrationReconciliationService } from './migration-reconciliation.service';

@Controller('legacy')
export class LegacyRedirectController {
  constructor(private readonly redirects: LegacyRedirectService) {}

  @Get('resolve')
  resolve(@Query('path') path: string) {
    return this.redirects.resolve(path ?? '/');
  }
}

@Controller('auth/migration')
export class MigrationClaimController {
  constructor(private readonly claims: MigrationClaimService) {}

  @Post('claim-request')
  requestClaim(@Body() body: { email: string }) {
    return this.claims.requestClaim(body.email);
  }
}

@Controller('admin/migration')
@UseGuards(AuthGuard, AdminGuard)
export class AdminMigrationController {
  constructor(
    private readonly imports: MigrationImportService,
    private readonly reconciliation: MigrationReconciliationService,
    private readonly redirects: LegacyRedirectService,
  ) {}

  @Post('runs')
  @AdminPermission('migration.write')
  startRun(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      sourceSystem: string;
      dryRun?: boolean;
      fixture: MigrationFixture;
    },
  ) {
    return this.imports.runImport(req.user.id, body);
  }

  @Get('runs/:id/reconciliation')
  @AdminPermission('migration.read')
  runReport(@Param('id') id: string) {
    return this.reconciliation.getRunReport(id);
  }

  @Get('reconciliation')
  @AdminPermission('migration.read')
  summary() {
    return this.reconciliation.getLatestSummary();
  }

  @Get('release-readiness')
  @AdminPermission('migration.read')
  readiness() {
    return this.reconciliation.getReleaseReadiness();
  }

  @Get('redirects')
  @AdminPermission('migration.read')
  listRedirects() {
    return this.redirects.list();
  }

  @Post('redirects')
  @AdminPermission('migration.write')
  upsertRedirect(
    @Body() body: { sourcePath: string; targetPath: string; statusCode?: number },
  ) {
    return this.redirects.upsert(body);
  }
}
