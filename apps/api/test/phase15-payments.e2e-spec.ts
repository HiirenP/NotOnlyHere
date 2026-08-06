import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { StripeWebhookService } from '../src/payments/stripe-webhook.service';

const RESOURCE_PAID_ID = '00000000-0000-5000-8000-000000000011';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

function checkoutCompletedEvent(sessionId: string, paymentIntent?: string) {
  return {
    id: `evt_${randomUUID()}`,
    type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    data: {
      object: {
        id: sessionId,
        payment_intent: paymentIntent ?? `pi_dev_${randomUUID()}`,
        mode: 'payment',
      },
    },
  };
}

describe('Phase 15 Payments (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let webhooks: StripeWebhookService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    process.env.STRIPE_MODE = 'dev';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    webhooks = app.get(StripeWebhookService);
    await app.init();

    await prisma.resourceEntitlement.deleteMany();
    await prisma.resourcePurchase.deleteMany();
    await prisma.donationPayment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.stripeEvent.deleteMany();

    const adminId = '00000000-0000-4000-8000-000000000002';
    const now = new Date();
    await prisma.resource.upsert({
      where: { id: RESOURCE_PAID_ID },
      update: {},
      create: {
        id: RESOURCE_PAID_ID,
        slug: 'deep-dive-workbook',
        kind: 'WORKSHEET',
        access: 'PAID_ONCE',
        title: 'Deep Dive Workbook',
        summary: 'Paid worksheet for phase 15.',
        bodyPlain: 'Paid content body.',
        priceMinor: 999,
        currency: 'USD',
        status: 'PUBLISHED',
        publishedAt: now,
        createdByUserId: adminId,
        updatedByUserId: adminId,
      },
    });
  });

  afterAll(async () => app.close());

  it('creates a donation checkout session and completes via webhook', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const idempotencyKey = `donation-${randomUUID()}`;

    const checkout = await request(app.getHttpServer())
      .post('/api/v1/donations/checkout-session')
      .set('Cookie', cookie)
      .send({
        frequency: 'ONE_TIME',
        amountMinor: 1000,
        currency: 'USD',
        idempotencyKey,
      });
    expect([200, 201]).toContain(checkout.status);
    expect(checkout.body.publicId).toBeTruthy();
    expect(checkout.body.checkoutSessionId).toMatch(/^cs_/);
    expect(checkout.body.devMode).toBe(true);

    const pending = await request(app.getHttpServer()).get(
      `/api/v1/donations/${checkout.body.publicId}/status`,
    );
    expect(pending.status).toBe(200);
    expect(pending.body.status).toBe('PENDING');

    const event = checkoutCompletedEvent(checkout.body.checkoutSessionId);
    const result = await webhooks.handleRawBody(JSON.stringify(event), undefined);
    expect(result.ok).toBe(true);
    expect(result.duplicate).toBe(false);

    const completed = await request(app.getHttpServer()).get(
      `/api/v1/donations/${checkout.body.publicId}/status`,
    );
    expect(completed.body.status).toBe('SUCCEEDED');
    expect(completed.body.succeededAt).toBeTruthy();
  });

  it('rejects invalid donation amounts', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post('/api/v1/donations/checkout-session')
      .set('Cookie', cookie)
      .send({
        frequency: 'ONE_TIME',
        amountMinor: 123,
        currency: 'USD',
        idempotencyKey: randomUUID(),
      });
    expect(response.status).toBe(400);
  });

  it('deduplicates stripe webhook events', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const checkout = await request(app.getHttpServer())
      .post('/api/v1/donations/checkout-session')
      .set('Cookie', cookie)
      .send({
        frequency: 'MONTHLY',
        amountMinor: 2500,
        currency: 'USD',
        idempotencyKey: randomUUID(),
      });
    expect([200, 201]).toContain(checkout.status);

    const event = checkoutCompletedEvent(checkout.body.checkoutSessionId);
    const first = await webhooks.handleRawBody(JSON.stringify(event), undefined);
    const second = await webhooks.handleRawBody(JSON.stringify(event), undefined);
    expect(first.duplicate).toBe(false);
    expect(second.duplicate).toBe(true);

    const status = await request(app.getHttpServer()).get(
      `/api/v1/donations/${checkout.body.publicId}/status`,
    );
    expect(status.body.status).toBe('ACTIVE');
  });

  it('grants resource access after purchase webhook', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');

    const locked = await request(app.getHttpServer())
      .get('/api/v1/resources/deep-dive-workbook')
      .set('Cookie', cookie);
    expect(locked.status).toBe(403);

    const session = await request(app.getHttpServer())
      .post(`/api/v1/resources/${RESOURCE_PAID_ID}/purchase-session`)
      .set('Cookie', cookie)
      .send({ idempotencyKey: randomUUID() });
    expect([200, 201]).toContain(session.status);
    expect(session.body.checkoutSessionId).toMatch(/^cs_/);

    await webhooks.handleRawBody(
      JSON.stringify(checkoutCompletedEvent(session.body.checkoutSessionId)),
      undefined,
    );

    const entitled = await request(app.getHttpServer())
      .get('/api/v1/resources/deep-dive-workbook')
      .set('Cookie', cookie);
    expect(entitled.status).toBe(200);
    expect(entitled.body.bodyPlain).toContain('Paid content');
  });

  it('lists donations for admins', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'demo@notonlyhere.local');

    const allowed = await request(app.getHttpServer())
      .get('/api/v1/admin/donations')
      .set('Cookie', adminCookie);
    expect(allowed.status).toBe(200);
    expect(Array.isArray(allowed.body.items)).toBe(true);
    expect(allowed.body.items.length).toBeGreaterThan(0);

    const denied = await request(app.getHttpServer())
      .get('/api/v1/admin/donations')
      .set('Cookie', memberCookie);
    expect(denied.status).toBe(403);
  });
});
