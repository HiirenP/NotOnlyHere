import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 4 Feed media (e2e)', () => {
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
    await prisma.postReaction.deleteMany();
    await prisma.commentReaction.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.postMedia.deleteMany();
    await prisma.postLinkPreview.deleteMany();
    await prisma.post.deleteMany();
    await prisma.userBlock.deleteMany();
  });

  afterAll(async () => app.close());

  it('creates a post with link preview', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({
        body: 'Check this out',
        visibility: 'PUBLIC',
        linkPreviewUrl: 'https://example.com/article',
      });
    expect([200, 201]).toContain(created.status);
    expect(created.body.linkPreview?.canonicalUrl).toContain('example.com');
  });

  it('rejects unsafe link preview URLs', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post('/api/v1/link-previews')
      .set('Cookie', cookie)
      .send({ url: 'http://localhost/secret' });
    expect(response.status).toBe(400);
  });

  it('adds comments and one-level replies', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const post = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'Discuss this', visibility: 'PUBLIC' });

    const top = await request(app.getHttpServer())
      .post(`/api/v1/posts/${post.body.id}/comments`)
      .set('Cookie', cookie)
      .send({ body: 'Great post' });
    expect([200, 201]).toContain(top.status);

    const reply = await request(app.getHttpServer())
      .post(`/api/v1/posts/${post.body.id}/comments`)
      .set('Cookie', cookie)
      .send({ body: 'Thanks!', parentCommentId: top.body.id });
    expect([200, 201]).toContain(reply.status);
    expect(reply.body.parentCommentId).toBe(top.body.id);

    const list = await request(app.getHttpServer())
      .get(`/api/v1/posts/${post.body.id}/comments`)
      .set('Cookie', cookie);
    expect(list.body).toHaveLength(2);
  });

  it('upserts and changes post reactions idempotently', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const member2Cookie = await login(app, 'member2@notonlyhere.local');
    const post = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', demoCookie)
      .send({ body: 'Reaction test', visibility: 'PUBLIC' });

    await request(app.getHttpServer())
      .put(`/api/v1/posts/${post.body.id}/reactions/SUPPORT`)
      .set('Cookie', member2Cookie);
    const changed = await request(app.getHttpServer())
      .put(`/api/v1/posts/${post.body.id}/reactions/HUG`)
      .set('Cookie', member2Cookie);
    expect(changed.body.viewerReaction).toBe('HUG');
    expect(changed.body.counts.HUG).toBe(1);
    expect(changed.body.counts.SUPPORT).toBe(0);
  });

  it('searches only visible posts', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const member2Cookie = await login(app, 'member2@notonlyhere.local');

    await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', demoCookie)
      .send({ body: 'UniqueSearchTermAlpha', visibility: 'ONLY_ME' });
    await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', demoCookie)
      .send({ body: 'UniqueSearchTermBeta public', visibility: 'PUBLIC' });

    const demoSearch = await request(app.getHttpServer())
      .get('/api/v1/feed/search?q=UniqueSearchTerm')
      .set('Cookie', demoCookie);
    expect(demoSearch.body.items.length).toBeGreaterThanOrEqual(2);

    const member2Search = await request(app.getHttpServer())
      .get('/api/v1/feed/search?q=UniqueSearchTerm')
      .set('Cookie', member2Cookie);
    const bodies = member2Search.body.items.map((item: { body: string }) => item.body);
    expect(bodies.some((body: string) => body.includes('Alpha'))).toBe(false);
    expect(bodies.some((body: string) => body.includes('Beta'))).toBe(true);
  });
});
