import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
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

async function grantAiConsent(app: INestApplication, cookie: string[]) {
  await request(app.getHttpServer())
    .put('/api/v1/ai/consent')
    .set('Cookie', cookie)
    .send({ consentType: 'AI_USE', granted: true });
}

describe('Phase 12 Ava (e2e)', () => {
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
    await prisma.aiMessage.deleteMany();
    await prisma.aiConversation.deleteMany();
    await prisma.aiPreference.deleteMany();
    await prisma.aiUsageDaily.deleteMany();
    await prisma.aiConsent.deleteMany();
  });

  afterAll(async () => app.close());

  it('requires AI consent before chatting', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/ai/conversations')
      .set('Cookie', cookie);
    expect(created.status).toBe(403);
  });

  it('records consent, sends a message, and isolates conversations', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const memberCookie = await login(app, 'member2@notonlyhere.local');
    await grantAiConsent(app, demoCookie);
    await grantAiConsent(app, memberCookie);

    const conversation = await request(app.getHttpServer())
      .post('/api/v1/ai/conversations')
      .set('Cookie', demoCookie);
    expect([200, 201]).toContain(conversation.status);

    const sent = await request(app.getHttpServer())
      .post(`/api/v1/ai/conversations/${conversation.body.id}/messages`)
      .set('Cookie', demoCookie)
      .send({ content: 'I could use some support today.' });
    expect(sent.status).toBe(201);
    expect(sent.body.assistantMessage.content.length).toBeGreaterThan(0);

    const memberList = await request(app.getHttpServer())
      .get('/api/v1/ai/conversations')
      .set('Cookie', memberCookie);
    expect(memberList.body.items).toHaveLength(0);

    const usage = await prisma.aiUsageDaily.findUnique({
      where: {
        userId_usageDate: {
          userId: DEMO_ID,
          usageDate: new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z'),
        },
      },
    });
    expect(usage?.acceptedMessageCount).toBe(1);
  });

  it('enforces the daily quota', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    await grantAiConsent(app, cookie);
    const conversation = await request(app.getHttpServer())
      .post('/api/v1/ai/conversations')
      .set('Cookie', cookie);
    const usageDate = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');
    await prisma.aiUsageDaily.upsert({
      where: { userId_usageDate: { userId: DEMO_ID, usageDate } },
      update: { acceptedMessageCount: 50 },
      create: { userId: DEMO_ID, usageDate, acceptedMessageCount: 50 },
    });

    const response = await request(app.getHttpServer())
      .post(`/api/v1/ai/conversations/${conversation.body.id}/messages`)
      .set('Cookie', cookie)
      .send({ content: 'One more message' });
    expect(response.status).toBe(429);
  });

  it('requires opt-in for circle recommendations', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const denied = await request(app.getHttpServer())
      .get('/api/v1/ai/circle-recommendations')
      .set('Cookie', cookie);
    expect(denied.status).toBe(403);

    await request(app.getHttpServer())
      .put('/api/v1/ai/consent')
      .set('Cookie', cookie)
      .send({ consentType: 'CIRCLE_RECOMMENDATIONS', granted: true });

    const allowed = await request(app.getHttpServer())
      .get('/api/v1/ai/circle-recommendations')
      .set('Cookie', cookie);
    expect(allowed.status).toBe(200);
    expect(Array.isArray(allowed.body.items)).toBe(true);
  });

  it('soft-deletes conversation history for the owner', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    await grantAiConsent(app, cookie);
    const list = await request(app.getHttpServer())
      .get('/api/v1/ai/conversations')
      .set('Cookie', cookie);
    const conversationId = list.body.items[0].id;

    const deleted = await request(app.getHttpServer())
      .delete(`/api/v1/ai/conversations/${conversationId}`)
      .set('Cookie', cookie);
    expect(deleted.status).toBe(200);

    const after = await request(app.getHttpServer())
      .get(`/api/v1/ai/conversations/${conversationId}`)
      .set('Cookie', cookie);
    expect(after.status).toBe(404);
  });
});
