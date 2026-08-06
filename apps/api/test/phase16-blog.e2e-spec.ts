import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { BlogService } from '../src/blog/blog.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 16 Blog (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let blog: BlogService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    blog = app.get(BlogService);
    await app.init();

    await prisma.blogPostTag.deleteMany();
    await prisma.blogPostCategory.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.blogTag.deleteMany();
    await prisma.blogCategory.deleteMany();

    await prisma.blogCategory.create({
      data: {
        id: '00000000-0000-6000-8000-000000000001',
        slug: 'wellness',
        name: 'Wellness',
        description: 'Wellness topics',
      },
    });
    await prisma.blogTag.create({
      data: {
        id: '00000000-0000-6000-8000-000000000002',
        slug: 'community',
        name: 'Community',
      },
    });
  });

  afterAll(async () => app.close());

  it('hides drafts from public list and shows published posts', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');

    const draft = await request(app.getHttpServer())
      .post('/api/v1/admin/blogs')
      .set('Cookie', adminCookie)
      .send({
        title: 'Draft Story',
        excerpt: 'Not visible yet',
        bodyPlain: 'Draft body content.',
        categorySlugs: ['wellness'],
        tagSlugs: ['community'],
      });
    expect([200, 201]).toContain(draft.status);

    const publicList = await request(app.getHttpServer()).get('/api/v1/blogs');
    expect(publicList.status).toBe(200);
    expect(publicList.body.items.some((item: { slug: string }) => item.slug === draft.body.slug)).toBe(false);

    const published = await request(app.getHttpServer())
      .post(`/api/v1/admin/blogs/${draft.body.id}/publish`)
      .set('Cookie', adminCookie);
    expect([200, 201]).toContain(published.status);

    const visible = await request(app.getHttpServer()).get('/api/v1/blogs');
    expect(visible.body.items.some((item: { slug: string }) => item.slug === draft.body.slug)).toBe(true);

    const detail = await request(app.getHttpServer()).get(`/api/v1/blogs/${draft.body.slug}`);
    expect(detail.status).toBe(200);
    expect(detail.body.bodyPlain).toContain('Draft body');
  });

  it('publishes scheduled posts idempotently', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/blogs')
      .set('Cookie', adminCookie)
      .send({
        title: 'Scheduled Story',
        excerpt: 'Future post',
        bodyPlain: 'Scheduled body.',
      });
    expect([200, 201]).toContain(created.status);

    await prisma.blogPost.update({
      where: { id: created.body.id },
      data: { status: 'SCHEDULED', scheduledAt: new Date(Date.now() - 60_000) },
    });

    const first = await blog.publishDueScheduled();
    const second = await blog.publishDueScheduled();
    expect(first.published).toBe(1);
    expect(second.published).toBe(0);

    const detail = await request(app.getHttpServer()).get(`/api/v1/blogs/${created.body.slug}`);
    expect(detail.status).toBe(200);
  });

  it('escapes RSS entities and blocks members from admin routes', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'demo@notonlyhere.local');

    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/blogs')
      .set('Cookie', adminCookie)
      .send({
        title: 'Tips & Tricks <script>',
        excerpt: 'Read about "community" & care',
        bodyPlain: 'Safe body.',
      });
    await request(app.getHttpServer())
      .post(`/api/v1/admin/blogs/${created.body.id}/publish`)
      .set('Cookie', adminCookie);

    const rss = await request(app.getHttpServer()).get('/api/v1/blogs/rss.xml');
    expect(rss.status).toBe(200);
    expect(rss.text).toContain('Tips &amp; Tricks &lt;script&gt;');
    expect(rss.text).toContain('&quot;community&quot; &amp; care');
    expect(rss.text).not.toContain('<script>');

    const denied = await request(app.getHttpServer())
      .get('/api/v1/admin/blogs')
      .set('Cookie', memberCookie);
    expect(denied.status).toBe(403);
  });

  it('enforces optimistic versioning on updates', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/blogs')
      .set('Cookie', adminCookie)
      .send({
        title: 'Versioned Post',
        excerpt: 'Version test',
        bodyPlain: 'Original body.',
      });
    expect([200, 201]).toContain(created.status);

    const stale = await request(app.getHttpServer())
      .patch(`/api/v1/admin/blogs/${created.body.id}`)
      .set('Cookie', adminCookie)
      .send({ bodyPlain: 'Updated body.', version: 99 });
    expect(stale.status).toBe(409);
  });
});
