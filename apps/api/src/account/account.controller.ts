import { Controller, Get, Post, Delete, Body, Req, UseGuards, Param, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AuthGuard } from '../auth/auth.guard';
import { AccountExportService, AccountDeletionService } from './account-lifecycle.service';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(
    private readonly exports: AccountExportService,
    private readonly deletions: AccountDeletionService,
  ) {}

  @Get()
  getAccount(@Req() req: Request & { user: { id: string; email: string; status: string; profile: { displayName: string; username: string } | null; adminUserRoles: { role: { key: string } }[] } }) {
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

  @Post('export')
  requestExport(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { password: string; idempotencyKey?: string },
  ) {
    return this.exports.requestExport(req.user.id, body.password, body.idempotencyKey);
  }

  @Get('export')
  getExport(@Req() req: Request & { user: { id: string } }) {
    return this.exports.getLatestExport(req.user.id);
  }

  @Get('export/:id/download')
  async downloadExport(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const exportRow = await this.exports.getExportForDownload(req.user.id, id);
    const exportDir = process.env.EXPORT_STORAGE_DIR ?? join(process.cwd(), '.exports');
    const filePath = join(exportDir, `${exportRow.id}.json`);
    const payload = await readFile(filePath, 'utf8');
    res.setHeader('content-type', 'application/json');
    res.setHeader('content-disposition', `attachment; filename="notonlyhere-export-${exportRow.id}.json"`);
    res.send(payload);
  }

  @Delete()
  requestDeletion(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { password: string },
  ) {
    return this.deletions.requestDeletion(req.user.id, body.password);
  }
}
