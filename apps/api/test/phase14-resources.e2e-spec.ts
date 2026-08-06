import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const RESOURCE_ARTICLE_ID = '00000000-0000-5000-8000-000000000010';
const RESOURCE_PAID_ID = '00000000-0000-5000-8000-000000000011';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 14 Resources (e2e)', () => {
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

    await prisma.resourceEntitlement.deleteMany();
    await prisma.resourcePurchase.deleteMany();
    await prisma.resourceProgress.deleteMany();
    await prisma.resource.deleteMany();

    const adminId = '00000000-0000-4000-8000-000000000002';
    const now = new Date();
    await prisma.resource.createMany({
      data: [
        {
          id: RESOURCE_ARTICLE_ID,
          slug: 'grounding-basics',
          kind: 'ARTICLE',
          access: 'MEMBER',
          title: 'Grounding Basics',
          summary: 'A short article on grounding techniques.',
          bodyPlain: 'Take a breath. Notice five things you can see.',
          status: 'PUBLISHED',
          publishedAt: now,
          createdByUserId: adminId,
          updatedByUserId: adminId,
        },
        {
          id: RESOURCE_PAID_ID,
          slug: 'deep-dive-workbook',
          kind: 'WORKSHEET',
          access: 'PAID_ONCE',
          title: 'Deep Dive Workbook',
          summary: 'Paid worksheet placeholder for phase 15.',
          bodyPlain: 'Paid content body.',
          priceMinor: 999,
          currency: 'USD',
          status: 'PUBLISHED',
          publishedAt: now,
          createdByUserId: adminId,
          updatedByUserId: adminId,
        },
      ],
    });
  });

  afterAll(async () => app.close());

  it('lists published member resources and hides paid body until entitled', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const list = await request(app.getHttpServer()).get('/api/v1/resources').set('Cookie', cookie);
    expect(list.status).toBe(200);
    expect(list.body.items.some((item: { slug: string }) => item.slug === 'grounding-basics')).toBe(true);

    const article = await request(app.getHttpServer())
      .get('/api/v1/resources/grounding-basics')
      .set('Cookie', cookie);
    expect(article.status).toBe(200);
    expect(article.body.bodyPlain).toContain('Take a breath');

    const paid = await request(app.getHttpServer())
      .get('/api/v1/resources/deep-dive-workbook')
      .set('Cookie', cookie);
    expect(paid.status).toBe(403);
  });

  it('records progress idempotently for entitled resources', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const first = await request(app.getHttpServer())
      .put(`/api/v1/resources/${RESOURCE_ARTICLE_ID}/progress`)
      .set('Cookie', cookie)
      .send({ progressPercent: 50 });
    expect(first.status).toBe(200);

    const second = await request(app.getHttpServer())
      .put(`/api/v1/resources/${RESOURCE_ARTICLE_ID}/progress`)
      .set('Cookie', cookie)
      .send({ progressPercent: 100 });
    expect(second.body.progressPercent).toBe(100);
    expect(second.body.completedAt).toBeTruthy();
  });

  it('allows editors to create resources and blocks ordinary members', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'demo@notonlyhere.local');

    const created = await request(app.getHttpServer())
      .post('/api/v1/resources')
      .set('Cookie', adminCookie)
      .send({
        title: 'New Member Article',
        summary: 'Created in tests',
        kind: 'ARTICLE',
        access: 'MEMBER',
        bodyPlain: 'Helpful content.',
        status: 'PUBLISHED',
      });
    expect([200, 201]).toContain(created.status);

    const denied = await request(app.getHttpServer())
      .post('/api/v1/resources')
      .set('Cookie', memberCookie)
      .send({
        title: 'Nope',
        summary: 'Nope',
        kind: 'ARTICLE',
        access: 'MEMBER',
        bodyPlain: 'Nope',
      });
    expect(denied.status).toBe(403);
  });

  it('rejects public-free resources under the conservative default', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post('/api/v1/resources')
      .set('Cookie', adminCookie)
      .send({
        title: 'Public Article',
        summary: 'Should fail',
        kind: 'ARTICLE',
        access: 'PUBLIC_FREE',
        bodyPlain: 'Body',
      });
    expect(response.status).toBe(400);
  });
});
