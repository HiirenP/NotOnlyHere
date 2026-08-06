import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const DEMO_ID = '00000000-0000-4000-8000-000000000001';
const ADMIN_ID = '00000000-0000-4000-8000-000000000002';
const MEMBER2_ID = '00000000-0000-4000-8000-000000000003';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 5 Anonymous (e2e)', () => {
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
    await prisma.auditLog.deleteMany();
    await prisma.commentAnonymousAuthor.deleteMany();
    await prisma.postAnonymousAuthor.deleteMany();
    await prisma.anonymousUsageDaily.deleteMany();
    await prisma.postReaction.deleteMany();
    await prisma.commentReaction.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.postMedia.deleteMany();
    await prisma.postLinkPreview.deleteMany();
    await prisma.post.deleteMany();
    await prisma.userBlock.deleteMany();
  });

  afterAll(async () => app.close());

  it('creates anonymous post without leaking identity to other members', async () => {
    const authorCookie = await login(app, 'demo@notonlyhere.local');
    const viewerCookie = await login(app, 'member2@notonlyhere.local');

    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', authorCookie)
      .send({ body: 'Anonymous feelings', visibility: 'PUBLIC', isAnonymous: true });
    expect([200, 201]).toContain(created.status);
    expect(created.body.isAnonymous).toBe(true);
    expect(created.body.author.isAnonymous).toBe(true);
    expect(created.body.author.displayLabel).toBeTruthy();
    expect(created.body.author.id).toBeUndefined();
    expect(created.body.viewer.canConnect).toBe(false);

    const viewed = await request(app.getHttpServer())
      .get(`/api/v1/posts/${created.body.id}`)
      .set('Cookie', viewerCookie);
    expect(viewed.status).toBe(200);
    expect(JSON.stringify(viewed.body)).not.toContain(DEMO_ID);
    expect(viewed.body.author.isAnonymous).toBe(true);
    expect(viewed.body.author.id).toBeUndefined();
    expect(viewed.body.author.username).toBeUndefined();
  });

  it('returns anonymous quota and blocks the 11th contribution', async () => {
    const cookie = await login(app, 'member2@notonlyhere.local');
    await prisma.anonymousUsageDaily.deleteMany({ where: { userId: MEMBER2_ID } });

    const quotaBefore = await request(app.getHttpServer()).get('/api/v1/anonymous/quota').set('Cookie', cookie);
    expect(quotaBefore.status).toBe(200);
    expect(quotaBefore.body.remaining).toBe(10);

    for (let i = 0; i < 10; i += 1) {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .set('Cookie', cookie)
        .send({ body: `Anon post ${i}`, visibility: 'PUBLIC', isAnonymous: true });
      expect([200, 201]).toContain(response.status);
    }

    const blocked = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'One too many', visibility: 'PUBLIC', isAnonymous: true });
    expect(blocked.status).toBe(429);
    expect(blocked.body.code).toBe('ANONYMOUS_QUOTA_EXCEEDED');
    expect(blocked.body.quota.remaining).toBe(0);
  });

  it('allows admin reveal with audit and denies non-admin', async () => {
    const authorCookie = await login(app, 'demo@notonlyhere.local');
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'member2@notonlyhere.local');

    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', authorCookie)
      .send({ body: 'Need admin trace', visibility: 'PUBLIC', isAnonymous: true });
    const postId = created.body.id;

    const denied = await request(app.getHttpServer())
      .post(`/api/v1/admin/anonymous-authors/post/${postId}/reveal`)
      .set('Cookie', memberCookie)
      .send({ reason: 'Should not work' });
    expect(denied.status).toBe(403);

    const revealed = await request(app.getHttpServer())
      .post(`/api/v1/admin/anonymous-authors/post/${postId}/reveal`)
      .set('Cookie', adminCookie)
      .send({ reason: 'Safety review requested' });
    expect(revealed.status).toBe(201);
    expect(revealed.body.userId).toBe(DEMO_ID);
    expect(revealed.body.email).toBe('demo@notonlyhere.local');

    const audit = await prisma.auditLog.findFirst({
      where: { action: 'anonymous_identity.reveal', targetId: postId },
    });
    expect(audit).toBeTruthy();
    expect(audit?.actorUserId).toBe(ADMIN_ID);
  });

  it('supports anonymous comments without identity leak', async () => {
    const authorCookie = await login(app, 'demo@notonlyhere.local');
    const viewerCookie = await login(app, 'member2@notonlyhere.local');

    const post = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', authorCookie)
      .send({ body: 'Open thread', visibility: 'PUBLIC' });

    const comment = await request(app.getHttpServer())
      .post(`/api/v1/posts/${post.body.id}/comments`)
      .set('Cookie', authorCookie)
      .send({ body: 'Anonymous reply', isAnonymous: true });
    expect([200, 201]).toContain(comment.status);
    expect(comment.body.author.isAnonymous).toBe(true);
    expect(comment.body.author.id).toBeUndefined();

    const list = await request(app.getHttpServer())
      .get(`/api/v1/posts/${post.body.id}/comments`)
      .set('Cookie', viewerCookie);
    expect(list.status).toBe(200);
    expect(JSON.stringify(list.body)).not.toContain(DEMO_ID);
  });
});
