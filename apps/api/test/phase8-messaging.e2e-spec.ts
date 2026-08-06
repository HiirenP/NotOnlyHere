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

describe('Phase 8 Messaging (e2e)', () => {
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

    await prisma.messageReaction.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();

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

  it('creates a 1:1 conversation between connected members', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post('/api/v1/conversations')
      .set('Cookie', cookie)
      .send({ userId: MEMBER2_ID });
    expect([200, 201]).toContain(response.status);
    expect(response.body.id).toBeTruthy();

    const again = await request(app.getHttpServer())
      .post('/api/v1/conversations')
      .set('Cookie', cookie)
      .send({ userId: MEMBER2_ID });
    expect(again.body.id).toBe(response.body.id);
    expect(again.body.created).toBe(false);
  });

  it('sends messages with client idempotency', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const memberCookie = await login(app, 'member2@notonlyhere.local');

    const conversation = await request(app.getHttpServer())
      .post('/api/v1/conversations')
      .set('Cookie', demoCookie)
      .send({ userId: MEMBER2_ID });

    const clientMessageId = randomUUID();
    const sent = await request(app.getHttpServer())
      .post(`/api/v1/conversations/${conversation.body.id}/messages`)
      .set('Cookie', demoCookie)
      .send({ body: 'Hello there', clientMessageId });
    expect([200, 201]).toContain(sent.status);

    const retry = await request(app.getHttpServer())
      .post(`/api/v1/conversations/${conversation.body.id}/messages`)
      .set('Cookie', demoCookie)
      .send({ body: 'Hello there', clientMessageId });
    expect(retry.body.id).toBe(sent.body.id);

    const history = await request(app.getHttpServer())
      .get(`/api/v1/conversations/${conversation.body.id}/messages`)
      .set('Cookie', memberCookie);
    expect(history.status).toBe(200);
    expect(history.body.items.some((item: { body: string }) => item.body === 'Hello there')).toBe(true);
  });

  it('blocks messaging when users are not connected', async () => {
    await prisma.connection.deleteMany({
      where: {
        OR: [
          { requesterId: DEMO_ID, addresseeId: MEMBER2_ID },
          { requesterId: MEMBER2_ID, addresseeId: DEMO_ID },
        ],
      },
    });

    const cookie = await login(app, 'demo@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post('/api/v1/conversations')
      .set('Cookie', cookie)
      .send({ userId: MEMBER2_ID });
    expect(response.status).toBe(403);
  });
});
