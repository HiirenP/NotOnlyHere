import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const DEMO_ID = '00000000-0000-4000-8000-000000000001';
const MEMBER2_ID = '00000000-0000-4000-8000-000000000003';
const ADMIN_ID = '00000000-0000-4000-8000-000000000002';

async function login(app: INestApplication, email: string, password = 'Demo1234!') {
  const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ email, password });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 3 Feed (e2e)', () => {
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
    await prisma.post.deleteMany();
    await prisma.userBlock.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a text post and returns it on the feed', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'Hello from Phase 3', visibility: 'MEMBERS' });
    expect([200, 201]).toContain(created.status);
    expect(created.body.body).toBe('Hello from Phase 3');

    const feed = await request(app.getHttpServer()).get('/api/v1/feed').set('Cookie', cookie);
    expect(feed.status).toBe(200);
    expect(feed.body.items.some((item: { id: string }) => item.id === created.body.id)).toBe(true);
  });

  it('enforces visibility boundaries across three members', async () => {
    await prisma.post.deleteMany();

    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const member2Cookie = await login(app, 'member2@notonlyhere.local');
    const adminCookie = await login(app, 'admin@notonlyhere.local');

    const onlyMe = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', demoCookie)
      .send({ body: 'Only me post', visibility: 'ONLY_ME' });
    const connections = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', demoCookie)
      .send({ body: 'Connections post', visibility: 'CONNECTIONS' });
    const publicPost = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', demoCookie)
      .send({ body: 'Public post', visibility: 'PUBLIC' });

    const member2Feed = await request(app.getHttpServer()).get('/api/v1/feed').set('Cookie', member2Cookie);
    const bodies = member2Feed.body.items.map((item: { body: string }) => item.body);
    expect(bodies).toContain('Public post');
    expect(bodies).not.toContain('Only me post');

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

    const member2FeedConnected = await request(app.getHttpServer()).get('/api/v1/feed').set('Cookie', member2Cookie);
    const connectedBodies = member2FeedConnected.body.items.map((item: { body: string }) => item.body);
    expect(connectedBodies).toContain('Connections post');

    const adminFeed = await request(app.getHttpServer()).get('/api/v1/feed').set('Cookie', adminCookie);
    expect(adminFeed.body.items.some((item: { id: string }) => item.id === publicPost.body.id)).toBe(true);
    expect(adminFeed.body.items.some((item: { id: string }) => item.id === onlyMe.body.id)).toBe(false);
  });

  it('allows edit within 15 minutes and rejects afterward', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'Editable post', visibility: 'PUBLIC' });

    const edited = await request(app.getHttpServer())
      .patch(`/api/v1/posts/${created.body.id}`)
      .set('Cookie', cookie)
      .send({ body: 'Edited post', version: created.body.version });
    expect(edited.status).toBe(200);
    expect(edited.body.body).toBe('Edited post');
    expect(edited.body.isEdited).toBe(true);

    await prisma.post.update({
      where: { id: created.body.id },
      data: { createdAt: new Date(Date.now() - 16 * 60 * 1000) },
    });

    const stale = await request(app.getHttpServer())
      .patch(`/api/v1/posts/${created.body.id}`)
      .set('Cookie', cookie)
      .send({ body: 'Too late', version: edited.body.version });
    expect(stale.status).toBe(400);
    expect(stale.body.code).toBe('EDIT_WINDOW_EXPIRED');
  });

  it('soft-deletes a post and hides it from feed', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', cookie)
      .send({ body: 'Delete me', visibility: 'PUBLIC' });

    const deleted = await request(app.getHttpServer())
      .delete(`/api/v1/posts/${created.body.id}`)
      .set('Cookie', cookie);
    expect(deleted.status).toBe(200);

    const feed = await request(app.getHttpServer()).get('/api/v1/feed').set('Cookie', cookie);
    expect(feed.body.items.some((item: { id: string }) => item.id === created.body.id)).toBe(false);

    const hidden = await request(app.getHttpServer())
      .get(`/api/v1/posts/${created.body.id}`)
      .set('Cookie', cookie);
    expect(hidden.status).toBe(404);
  });

  it('paginates feed without duplicates', async () => {
    await prisma.post.deleteMany();
    const cookie = await login(app, 'demo@notonlyhere.local');

    for (let i = 0; i < 5; i += 1) {
      await request(app.getHttpServer())
        .post('/api/v1/posts')
        .set('Cookie', cookie)
        .send({ body: `Paginated post ${i}`, visibility: 'PUBLIC' });
      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    const page1 = await request(app.getHttpServer()).get('/api/v1/feed?limit=2').set('Cookie', cookie);
    expect(page1.body.items).toHaveLength(2);
    expect(page1.body.nextCursor).toBeTruthy();

    const page2 = await request(app.getHttpServer())
      .get(`/api/v1/feed?limit=2&cursor=${page1.body.nextCursor}`)
      .set('Cookie', cookie);
    expect(page2.body.items).toHaveLength(2);

    const ids = [...page1.body.items, ...page2.body.items].map((item: { id: string }) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ranks connected authors higher in relevant mode', async () => {
    await prisma.post.deleteMany();
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

    const member2Cookie = await login(app, 'member2@notonlyhere.local');
    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const adminCookie = await login(app, 'admin@notonlyhere.local');

    await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', demoCookie)
      .send({ body: 'Older connected post', visibility: 'PUBLIC' });
    await new Promise((resolve) => setTimeout(resolve, 10));
    await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Cookie', adminCookie)
      .send({ body: 'Newer unconnected post', visibility: 'PUBLIC' });

    const relevant = await request(app.getHttpServer())
      .get('/api/v1/feed?mode=RELEVANT&limit=10')
      .set('Cookie', member2Cookie);
    const firstBody = relevant.body.items[0]?.body;
    expect(firstBody).toBe('Older connected post');
  });
});
