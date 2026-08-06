import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { ModerationService } from '../src/moderation/moderation.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 13 Moderation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let moderation: ModerationService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    moderation = app.get(ModerationService);
    await app.init();
    await prisma.aiModFlag.deleteMany();
  });

  afterAll(async () => app.close());

  it('creates a moderation flag for flagged post content without changing post status', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'I will hurt you if this continues.', visibility: 'MEMBERS' });
    expect([200, 201]).toContain(created.status);

    const flag = await moderation.evaluatePost(created.body.id);
    expect(flag?.category).toBe('THREATS');

    const post = await prisma.post.findUnique({ where: { id: created.body.id } });
    expect(post?.status).toBe('ACTIVE');
  });

  it('deduplicates open flags for the same target and category', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'This is harassment plain and simple.', visibility: 'MEMBERS' });

    const first = await moderation.evaluatePost(created.body.id);
    const second = await moderation.evaluatePost(created.body.id);
    expect(second?.id).toBe(first?.id);
  });

  it('allows admins to review flags and blocks members', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'demo@notonlyhere.local');

    const list = await request(app.getHttpServer())
      .get('/api/v1/admin/ai/flags')
      .set('Cookie', adminCookie);
    expect(list.status).toBe(200);
    expect(list.body.items.length).toBeGreaterThan(0);

    const denied = await request(app.getHttpServer())
      .get('/api/v1/admin/ai/flags')
      .set('Cookie', memberCookie);
    expect(denied.status).toBe(403);

    const flagId = list.body.items[0].id;
    const reviewed = await request(app.getHttpServer())
      .patch(`/api/v1/admin/ai/flags/${flagId}`)
      .set('Cookie', adminCookie)
      .send({ status: 'REVIEWED', resolutionNote: 'Reviewed by admin.' });
    expect(reviewed.status).toBe(200);
    expect(reviewed.body.status).toBe('REVIEWED');
  });

  it('ignores deleted content during evaluation', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'I will hurt you again.', visibility: 'MEMBERS' });

    await prisma.post.update({
      where: { id: created.body.id },
      data: { status: 'DELETED', deletedAt: new Date() },
    });

    const flag = await moderation.evaluatePost(created.body.id);
    expect(flag).toBeNull();
  });
});
