import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { DonationFrequency } from '@prisma/client';
import type { Request } from 'express';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { DonationsService } from './donations.service';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donations: DonationsService) {}

  @Post('checkout-session')
  @UseGuards(AuthGuard)
  createCheckout(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      frequency: DonationFrequency;
      amountMinor: number;
      currency: string;
      idempotencyKey: string;
    },
  ) {
    return this.donations.createCheckoutSession(req.user.id, body);
  }

  @Get(':publicId/status')
  getStatus(@Param('publicId') publicId: string) {
    return this.donations.getStatus(publicId);
  }
}

@Controller('admin/donations')
@UseGuards(AuthGuard, AdminGuard)
export class AdminDonationsController {
  constructor(private readonly donations: DonationsService) {}

  @Get()
  @AdminPermission('donation.read')
  list(@Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    return this.donations.listForAdmin({ cursor, limit: limit ? Number(limit) : undefined });
  }
}
