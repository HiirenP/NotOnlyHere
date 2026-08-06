import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type StripeWebhookPayload = {
  id: string;
  type: string;
  created: number;
  livemode?: boolean;
  data: {
    object: {
      id: string;
      metadata?: Record<string, string>;
      payment_intent?: string;
      mode?: string;
    };
  };
};

@Injectable()
export class StripeWebhookService {
  constructor(private readonly prisma: PrismaService) {}

  async handleRawBody(rawBody: string, signature: string | undefined) {
    const devMode = process.env.STRIPE_MODE === 'dev' || !process.env.STRIPE_WEBHOOK_SECRET;
    if (!devMode && signature !== process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('INVALID_SIGNATURE');
    }

    const event = JSON.parse(rawBody) as StripeWebhookPayload;
    const existing = await this.prisma.stripeEvent.findUnique({
      where: { stripeEventId: event.id },
    });
    if (existing?.processedAt) {
      return { ok: true, duplicate: true };
    }

    if (!existing) {
      await this.prisma.stripeEvent.create({
        data: {
          id: randomUUID(),
          stripeEventId: event.id,
          eventType: event.type,
          livemode: event.livemode ?? false,
          payload: event as object,
          providerCreatedAt: new Date(event.created * 1000),
        },
      });
    }

    if (event.type === 'checkout.session.completed') {
      await this.handleCheckoutCompleted(event.data.object);
    }

    await this.prisma.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { processedAt: new Date(), processingAttempts: { increment: 1 } },
    });

    return { ok: true, duplicate: false };
  }

  private async handleCheckoutCompleted(session: {
    id: string;
    metadata?: Record<string, string>;
    payment_intent?: string;
  }) {
    const donation = await this.prisma.donation.findUnique({
      where: { stripeCheckoutSessionId: session.id },
    });
    if (donation) {
      const paymentIntentId = session.payment_intent ?? `pi_dev_${session.id}`;
      await this.prisma.$transaction([
        this.prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: donation.frequency === 'MONTHLY' ? 'ACTIVE' : 'SUCCEEDED',
            stripePaymentIntentId: paymentIntentId,
            succeededAt: new Date(),
          },
        }),
        this.prisma.donationPayment.upsert({
          where: { stripePaymentIntentId: paymentIntentId },
          update: { status: 'PAID', paidAt: new Date() },
          create: {
            id: randomUUID(),
            donationId: donation.id,
            stripePaymentIntentId: paymentIntentId,
            amountMinor: donation.amountMinor,
            currency: donation.currency,
            status: 'PAID',
            paidAt: new Date(),
          },
        }),
      ]);
      return;
    }

    const purchase = await this.prisma.resourcePurchase.findUnique({
      where: { stripeCheckoutSessionId: session.id },
      include: { resource: true },
    });
    if (!purchase || !purchase.userId) return;

    const userId = purchase.userId;
    const paymentIntentId = session.payment_intent ?? `pi_dev_${session.id}`;
    await this.prisma.$transaction(async (tx) => {
      await tx.resourcePurchase.update({
        where: { id: purchase.id },
        data: {
          status: 'PAID',
          stripePaymentIntentId: paymentIntentId,
          paidAt: new Date(),
        },
      });

      const existing = await tx.resourceEntitlement.findUnique({
        where: { resourceId_userId: { resourceId: purchase.resourceId, userId } },
      });
      if (!existing) {
        await tx.resourceEntitlement.create({
          data: {
            id: randomUUID(),
            resourceId: purchase.resourceId,
            userId,
            purchaseId: purchase.id,
            grantedAt: new Date(),
          },
        });
      }
    });
  }
}
