import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AnonymousQuotaService } from './anonymous-quota.service';

@Controller('anonymous')
@UseGuards(AuthGuard)
export class AnonymousController {
  constructor(private readonly quota: AnonymousQuotaService) {}

  @Get('quota')
  getQuota(@Req() req: Request & { user: { id: string } }) {
    return this.quota.getQuota(req.user.id);
  }
}
