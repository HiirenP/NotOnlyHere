import { Controller, Headers, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('payments/stripe')
export class StripeWebhookController {
  constructor(private readonly webhooks: StripeWebhookService) {}

  @Post('webhook')
  async webhook(
    @Req() req: Request & { body: unknown },
    @Headers('stripe-signature') signature?: string,
  ) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    return this.webhooks.handleRawBody(rawBody, signature);
  }
}
