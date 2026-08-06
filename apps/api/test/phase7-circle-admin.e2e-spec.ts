import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const APPROVAL_CIRCLE = '00000000-0000-5000-8000-000000000002';
const DEMO_ID = '00000000-0000-4000-8000-000000000001';
const MEMBER2_ID = '00000000-0000-4000-8000-000000000003';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 7 Circle admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdCircleId: string;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterAll(async () => app.close());

  it('creates a circle and assigns creator as admin', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post('/api/v1/circles')
      .set('Cookie', cookie)
      .send({
        name: 'Phase 7 Test Circle',
        description: 'Created in tests',
        guidelines: 'Be respectful',
        visibility: 'PUBLIC',
        joinPolicy: 'OPEN',
      });
    expect([200, 201]).toContain(response.status);
    createdCircleId = response.body.id;
    expect(response.body.slug).toBeTruthy();

    const membership = await prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId: createdCircleId, userId: '00000000-0000-4000-8000-000000000001' } },
    });
    expect(membership?.role).toBe('ADMIN');
  });

  it('approves a pending membership request', async () => {
    await prisma.circleMember.upsert({
      where: { circleId_userId: { circleId: APPROVAL_CIRCLE, userId: MEMBER2_ID } },
      update: { status: 'ACTIVE', role: 'ADMIN', joinedAt: new Date(), leftAt: null },
      create: {
        circleId: APPROVAL_CIRCLE,
        userId: MEMBER2_ID,
        status: 'ACTIVE',
        role: 'ADMIN',
        joinedAt: new Date(),
      },
    });

    await prisma.circleMember.upsert({
      where: { circleId_userId: { circleId: APPROVAL_CIRCLE, userId: DEMO_ID } },
      update: { status: 'PENDING', requestedAt: new Date(), joinedAt: null, leftAt: null, role: 'MEMBER' },
      create: { circleId: APPROVAL_CIRCLE, userId: DEMO_ID, status: 'PENDING', requestedAt: new Date(), role: 'MEMBER' },
    });

    const adminCookie = await login(app, 'member2@notonlyhere.local');
    const approved = await request(app.getHttpServer())
      .post(`/api/v1/circles/${APPROVAL_CIRCLE}/membership-requests/${DEMO_ID}/approve`)
      .set('Cookie', adminCookie);
    expect([200, 201]).toContain(approved.status);

    const membership = await prisma.circleMember.findUnique({
      where: { circleId_userId: { circleId: APPROVAL_CIRCLE, userId: DEMO_ID } },
    });
    expect(membership?.status).toBe('ACTIVE');
  });

  it('posts to a circle feed and removes post as admin', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const post = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'Circle-only update', visibility: 'MEMBERS', circleId: createdCircleId });
    expect([200, 201]).toContain(post.status);

    const feed = await request(app.getHttpServer())
      .get(`/api/v1/circles/${createdCircleId}/feed`)
      .set('Cookie', cookie);
    expect(feed.status).toBe(200);
    expect(feed.body.items.some((item: { id: string }) => item.id === post.body.id)).toBe(true);

    const removed = await request(app.getHttpServer())
      .post(`/api/v1/circles/${createdCircleId}/posts/${post.body.id}/remove`)
      .set('Cookie', cookie)
      .send({ reason: 'Off-topic for this circle' });
    expect([200, 201]).toContain(removed.status);

    const deleted = await prisma.post.findUnique({ where: { id: post.body.id } });
    expect(deleted?.status).toBe('DELETED');
  });

  it('blocks removed members from circle feed', async () => {
    const adminCookie = await login(app, 'demo@notonlyhere.local');
    const memberCookie = await login(app, 'member2@notonlyhere.local');

    await request(app.getHttpServer())
      .post(`/api/v1/circles/${createdCircleId}/membership`)
      .set('Cookie', memberCookie);

    await request(app.getHttpServer())
      .delete(`/api/v1/circles/${createdCircleId}/members/${MEMBER2_ID}`)
      .set('Cookie', adminCookie);

    const feed = await request(app.getHttpServer())
      .get(`/api/v1/circles/${createdCircleId}/feed`)
      .set('Cookie', memberCookie);
    expect(feed.status).toBe(400);
  });
});
