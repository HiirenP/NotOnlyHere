import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

const ALLOWED_AMOUNTS = new Set([500, 1000, 2500, 5000]);

@Injectable()
export class StripeCheckoutService {
  isDevMode() {
    return process.env.STRIPE_MODE === 'dev' || !process.env.STRIPE_SECRET_KEY;
  }

  assertAllowedAmount(amountMinor: number, currency: string) {
    if (currency !== 'USD' || !ALLOWED_AMOUNTS.has(amountMinor)) {
      throw new Error('INVALID_AMOUNT');
    }
  }

  createCheckoutSessionId() {
    return `cs_dev_${randomUUID()}`;
  }

  createPaymentIntentId() {
    return `pi_dev_${randomUUID()}`;
  }
}
