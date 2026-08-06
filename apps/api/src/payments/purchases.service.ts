import { randomUUID } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeCheckoutService } from './stripe-checkout.service';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeCheckoutService,
  ) {}

  async createPurchaseSession(
    userId: string,
    resourceId: string,
    idempotencyKey: string,
  ) {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource || resource.status !== 'PUBLISHED' || resource.access !== 'PAID_ONCE') {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Paid resource not found.' });
    }
    if (!resource.priceMinor || !resource.currency) {
      throw new BadRequestException({ code: 'INVALID_PRICE', message: 'Resource price is not configured.' });
    }

    const entitled = await this.prisma.resourceEntitlement.findFirst({
      where: { resourceId, userId, revokedAt: null },
    });
    if (entitled) {
      throw new ConflictException({ code: 'ALREADY_OWNED', message: 'You already own this resource.' });
    }

    if (idempotencyKey) {
      const existing = await this.prisma.resourcePurchase.findFirst({
        where: { userId, stripeCheckoutSessionId: { startsWith: 'cs_' }, status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
      });
      if (existing && existing.resourceId === resourceId) {
        return this.serializeCheckout(existing, resource.slug);
      }
    }

    const sessionId = this.stripe.createCheckoutSessionId();
    const purchase = await this.prisma.resourcePurchase.create({
      data: {
        id: randomUUID(),
        resourceId,
        userId,
        purchaserReference: randomUUID(),
        amountMinor: resource.priceMinor,
        currency: resource.currency,
        status: 'PENDING',
        stripeCheckoutSessionId: sessionId,
        priceSnapshot: {
          title: resource.title,
          amountMinor: Number(resource.priceMinor),
          currency: resource.currency,
        },
      },
    });

    return this.serializeCheckout(purchase, resource.slug);
  }

  private serializeCheckout(
    purchase: { id: string; stripeCheckoutSessionId: string | null; status: string },
    slug: string,
  ) {
    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
    return {
      purchaseId: purchase.id,
      checkoutSessionId: purchase.stripeCheckoutSessionId,
      status: purchase.status,
      checkoutUrl: `${webUrl}/app/resources/${slug}?purchase=pending`,
      devMode: this.stripe.isDevMode(),
    };
  }
}
