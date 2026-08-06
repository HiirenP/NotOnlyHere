import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { AnalyticsService } from '../src/analytics/analytics.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 17 Analytics (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let analytics: AnalyticsService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    analytics = app.get(AnalyticsService);
    await app.init();

    await prisma.analyticsExport.deleteMany();
    await prisma.analyticsEvent.deleteMany();
    await prisma.analyticsEventDedup.deleteMany();
    await prisma.analyticsDailyAggregate.deleteMany();

    const definitions = [
      { key: 'page.view', version: 1, description: 'Page view', allowedProperties: { path: 'string' } },
      { key: 'auth.register_completed', version: 1, description: 'Register', allowedProperties: { method: 'string' } },
      { key: 'feed.first_post_created', version: 1, description: 'First post', allowedProperties: { postId: 'string' } },
      { key: 'circle.first_joined', version: 1, description: 'Join circle', allowedProperties: { circleId: 'string' } },
    ];
    for (const definition of definitions) {
      await prisma.analyticsEventDefinition.upsert({
        where: { key: definition.key },
        update: definition,
        create: definition,
      });
    }
  });

  afterAll(async () => app.close());

  it('ingests allowlisted events and deduplicates by id', async () => {
    const dedupId = randomUUID();
    const payload = {
      dedupId,
      eventKey: 'page.view',
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      properties: { path: '/register' },
      source: 'web',
      anonymousId: 'anon-visitor-1',
    };

    const first = await request(app.getHttpServer()).post('/api/v1/analytics/events').send(payload);
    expect([200, 201]).toContain(first.status);
    expect(first.body.duplicate).toBe(false);

    const second = await request(app.getHttpServer()).post('/api/v1/analytics/events').send(payload);
    expect([200, 201]).toContain(second.status);
    expect(second.body.duplicate).toBe(true);

    const count = await prisma.analyticsEvent.count({ where: { eventKey: 'page.view' } });
    expect(count).toBe(1);
  });

  it('rejects unknown events and invalid properties', async () => {
    const unknown = await request(app.getHttpServer()).post('/api/v1/analytics/events').send({
      dedupId: randomUUID(),
      eventKey: 'secret.admin_action',
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      source: 'web',
    });
    expect(unknown.status).toBe(400);

    const invalid = await request(app.getHttpServer()).post('/api/v1/analytics/events').send({
      dedupId: randomUUID(),
      eventKey: 'page.view',
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      properties: { path: 123 },
      source: 'web',
      anonymousId: 'anon-2',
    });
    expect(invalid.status).toBe(400);
  });

  it('returns funnel metrics for analysts and blocks members', async () => {
    const demoUserId = '00000000-0000-4000-8000-000000000001';
    const now = new Date().toISOString();

    for (const [eventKey, props] of [
      ['page.view', { path: '/' }],
      ['auth.register_completed', { method: 'email' }],
      ['feed.first_post_created', { postId: randomUUID() }],
      ['circle.first_joined', { circleId: randomUUID() }],
    ] as const) {
      await analytics.ingestEvent({
        dedupId: randomUUID(),
        eventKey,
        eventVersion: 1,
        occurredAt: now,
        properties: props,
        source: 'test',
        userId: demoUserId,
      });
    }

    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'demo@notonlyhere.local');

    const funnel = await request(app.getHttpServer())
      .get('/api/v1/admin/analytics/funnel')
      .set('Cookie', adminCookie);
    expect(funnel.status).toBe(200);
    expect(funnel.body.steps).toHaveLength(4);
    expect(funnel.body.steps[3].count).toBe(1);

    const denied = await request(app.getHttpServer())
      .get('/api/v1/admin/analytics/funnel')
      .set('Cookie', memberCookie);
    expect(denied.status).toBe(403);
  });

  it('creates idempotent exports for admins', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'demo@notonlyhere.local');
    const idempotencyKey = `export-${randomUUID()}`;

    const created = await request(app.getHttpServer())
      .post('/api/v1/admin/analytics/exports')
      .set('Cookie', adminCookie)
      .send({ reportType: 'overview', filters: {}, idempotencyKey });
    expect([200, 201]).toContain(created.status);
    expect(created.body.status).toBe('READY');

    const duplicate = await request(app.getHttpServer())
      .post('/api/v1/admin/analytics/exports')
      .set('Cookie', adminCookie)
      .send({ reportType: 'overview', filters: {}, idempotencyKey });
    expect(duplicate.body.id).toBe(created.body.id);

    const denied = await request(app.getHttpServer())
      .post('/api/v1/admin/analytics/exports')
      .set('Cookie', memberCookie)
      .send({ reportType: 'overview', filters: {}, idempotencyKey: randomUUID() });
    expect(denied.status).toBe(403);
  });
});
