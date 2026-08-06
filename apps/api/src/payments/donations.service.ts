import { randomUUID } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { DonationFrequency } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StripeCheckoutService } from './stripe-checkout.service';

@Injectable()
export class DonationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeCheckoutService,
  ) {}

  async createCheckoutSession(
    userId: string | null,
    input: {
      frequency: DonationFrequency;
      amountMinor: number;
      currency: string;
      idempotencyKey: string;
    },
  ) {
    try {
      this.stripe.assertAllowedAmount(input.amountMinor, input.currency);
    } catch {
      throw new BadRequestException({ code: 'INVALID_AMOUNT', message: 'Donation amount is not allowed.' });
    }

    if (input.idempotencyKey) {
      const existing = await this.prisma.donation.findFirst({
        where: { idempotencyKey: input.idempotencyKey, ...(userId ? { userId } : {}) },
      });
      if (existing) {
        return this.serializeCheckout(existing);
      }
    }

    const sessionId = this.stripe.createCheckoutSessionId();
    const donation = await this.prisma.donation.create({
      data: {
        id: randomUUID(),
        publicId: randomUUID(),
        userId,
        donorReference: randomUUID(),
        frequency: input.frequency,
        amountMinor: BigInt(input.amountMinor),
        currency: input.currency,
        status: 'PENDING',
        stripeCheckoutSessionId: sessionId,
        idempotencyKey: input.idempotencyKey,
        startedAt: new Date(),
      },
    });

    return this.serializeCheckout(donation);
  }

  async getStatus(publicId: string) {
    const donation = await this.prisma.donation.findUnique({ where: { publicId } });
    if (!donation) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Donation not found.' });
    return {
      publicId: donation.publicId,
      status: donation.status,
      frequency: donation.frequency,
      amountMinor: Number(donation.amountMinor),
      currency: donation.currency,
      succeededAt: donation.succeededAt?.toISOString() ?? null,
    };
  }

  async listForAdmin(options: { cursor?: string; limit?: number }) {
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
    let cursorDate: Date | undefined;
    let cursorId: string | undefined;
    if (options.cursor) {
      const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
      cursorDate = new Date(createdAt);
      cursorId = id;
    }

    const rows = await this.prisma.donation.findMany({
      where: cursorDate && cursorId
        ? {
            OR: [
              { createdAt: { lt: cursorDate } },
              { createdAt: cursorDate, id: { lt: cursorId } },
            ],
          }
        : {},
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const page = rows.slice(0, limit);
    const last = page[page.length - 1];
    return {
      items: page.map((row) => ({
        id: row.id,
        publicId: row.publicId,
        status: row.status,
        frequency: row.frequency,
        amountMinor: Number(row.amountMinor),
        currency: row.currency,
        createdAt: row.createdAt.toISOString(),
      })),
      nextCursor:
        rows.length > limit && last
          ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
          : null,
    };
  }

  private serializeCheckout(donation: {
    publicId: string;
    stripeCheckoutSessionId: string | null;
    status: string;
  }) {
    const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
    return {
      publicId: donation.publicId,
      checkoutSessionId: donation.stripeCheckoutSessionId,
      status: donation.status,
      checkoutUrl: `${webUrl}/app/donations/return?publicId=${donation.publicId}`,
      devMode: this.stripe.isDevMode(),
    };
  }
}
