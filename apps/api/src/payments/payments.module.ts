import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { AdminDonationsController, DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { PurchasesService } from './purchases.service';
import { StripeCheckoutService } from './stripe-checkout.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookService } from './stripe-webhook.service';

@Module({
  imports: [AuthModule, AdminModule],
  controllers: [DonationsController, AdminDonationsController, StripeWebhookController],
  providers: [DonationsService, PurchasesService, StripeCheckoutService, StripeWebhookService],
  exports: [PurchasesService, StripeWebhookService],
})
export class PaymentsModule {}
