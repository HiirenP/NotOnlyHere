import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const DEMO_ID = '00000000-0000-4000-8000-000000000001';
const MEMBER2_ID = '00000000-0000-4000-8000-000000000003';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 9 Notifications (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    await app.init();
    await prisma.emailDelivery.deleteMany();
    await prisma.broadcastRecipient.deleteMany();
    await prisma.adminBroadcast.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.connection.upsert({
      where: { requesterId_addresseeId: { requesterId: DEMO_ID, addresseeId: MEMBER2_ID } },
      update: { status: 'ACCEPTED', respondedAt: new Date() },
      create: {
        requesterId: DEMO_ID,
        addresseeId: MEMBER2_ID,
        status: 'ACCEPTED',
        respondedAt: new Date(),
      },
    });
  });

  afterAll(async () => app.close());

  it('creates a notification when a DM is sent', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const memberCookie = await login(app, 'member2@notonlyhere.local');

    const conversation = await request(app.getHttpServer())
      .post('/api/v1/conversations')
      .set('Cookie', demoCookie)
      .send({ userId: MEMBER2_ID });

    await request(app.getHttpServer())
      .post(`/api/v1/conversations/${conversation.body.id}/messages`)
      .set('Cookie', demoCookie)
      .send({ body: 'Ping for notifications', clientMessageId: randomUUID() });

    const list = await request(app.getHttpServer())
      .get('/api/v1/notifications')
      .set('Cookie', memberCookie);
    expect(list.status).toBe(200);
    expect(list.body.unreadCount).toBeGreaterThan(0);
    expect(list.body.items[0].eventType).toBe('message.received');
  });

  it('marks notifications read and supports read-all', async () => {
    const memberCookie = await login(app, 'member2@notonlyhere.local');
    const list = await request(app.getHttpServer())
      .get('/api/v1/notifications')
      .set('Cookie', memberCookie);
    const first = list.body.items[0];

    const read = await request(app.getHttpServer())
      .patch(`/api/v1/notifications/${first.id}/read`)
      .set('Cookie', memberCookie);
    expect(read.status).toBe(200);

    await request(app.getHttpServer())
      .post('/api/v1/notifications/read-all')
      .set('Cookie', memberCookie);

    const after = await request(app.getHttpServer())
      .get('/api/v1/notifications')
      .set('Cookie', memberCookie);
    expect(after.body.unreadCount).toBe(0);
  });

  it('allows admin broadcast with idempotent idempotency key', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const key = `broadcast-${randomUUID()}`;
    const body = {
      title: 'Platform update',
      body: 'We deployed notifications.',
      audienceType: 'ALL_ACTIVE',
      idempotencyKey: key,
    };

    const first = await request(app.getHttpServer())
      .post('/api/v1/admin/broadcasts')
      .set('Cookie', adminCookie)
      .send(body);
    expect([200, 201]).toContain(first.status);
    expect(first.body.recipientCount).toBeGreaterThan(0);

    const second = await request(app.getHttpServer())
      .post('/api/v1/admin/broadcasts')
      .set('Cookie', adminCookie)
      .send(body);
    expect(second.body.id).toBe(first.body.id);

    const count = await prisma.adminBroadcast.count({
      where: { createdByUserId: '00000000-0000-4000-8000-000000000002', idempotencyKey: key },
    });
    expect(count).toBe(1);
  });
});
