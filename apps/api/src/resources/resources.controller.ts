import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import type { ResourceKind } from '@prisma/client';
import type { Request } from 'express';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { PurchasesService } from '../payments/purchases.service';
import { ResourcesService } from './resources.service';

@Controller('resources')
@UseGuards(AuthGuard)
export class ResourcesController {
  constructor(
    private readonly resources: ResourcesService,
    private readonly purchases: PurchasesService,
  ) {}

  @Get()
  list(
    @Req() req: Request & { user: { id: string } },
    @Query('q') q?: string,
    @Query('kind') kind?: ResourceKind,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.resources.listResources(req.user.id, { q, kind, cursor, limit: limit ? Number(limit) : undefined });
  }

  @Put(':id/progress')
  progress(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { progressPercent: number; lastPositionSeconds?: number | null },
  ) {
    return this.resources.updateProgress(id, req.user.id, body);
  }

  @Post(':id/purchase-session')
  purchaseSession(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { idempotencyKey: string },
  ) {
    return this.purchases.createPurchaseSession(req.user.id, id, body.idempotencyKey);
  }

  @Get(':slug')
  get(@Req() req: Request & { user: { id: string } }, @Param('slug') slug: string) {
    return this.resources.getResourceBySlug(slug, req.user.id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @AdminPermission('resource.write')
  create(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      title: string;
      summary: string;
      kind: ResourceKind;
      access: 'MEMBER' | 'PAID_ONCE';
      bodyPlain?: string | null;
      externalVideoUrl?: string | null;
      priceMinor?: number | null;
      currency?: string | null;
      status?: string;
    },
  ) {
    return this.resources.createResource(req.user.id, body);
  }
}
