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

describe('Phase 10 Wellness (e2e)', () => {
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
    await prisma.wellnessCheckin.deleteMany();
  });

  afterAll(async () => app.close());

  it('creates and updates one check-in per local day', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const created = await request(app.getHttpServer())
      .post('/api/v1/wellness/checkins')
      .set('Cookie', cookie)
      .send({ mood: 3, note: 'Okay day', timeZone: 'UTC' });
    expect([200, 201]).toContain(created.status);
    expect(created.body.mood).toBe(3);
    expect(created.body.note).toBe('Okay day');

    const updated = await request(app.getHttpServer())
      .post('/api/v1/wellness/checkins')
      .set('Cookie', cookie)
      .send({ mood: 4, note: 'Better now', timeZone: 'UTC', version: created.body.version });
    expect(updated.body.mood).toBe(4);

    const count = await prisma.wellnessCheckin.count({ where: { userId: DEMO_ID } });
    expect(count).toBe(1);
  });

  it('isolates wellness data between users', async () => {
    const memberCookie = await login(app, 'member2@notonlyhere.local');
    const list = await request(app.getHttpServer())
      .get('/api/v1/wellness/checkins')
      .set('Cookie', memberCookie);
    expect(list.body.items).toHaveLength(0);
  });

  it('returns 7-day trends with gaps', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const trends = await request(app.getHttpServer())
      .get('/api/v1/wellness/trends?window=7d&timeZone=UTC')
      .set('Cookie', cookie);
    expect(trends.status).toBe(200);
    expect(trends.body.points).toHaveLength(7);
    expect(trends.body.checkInCount).toBeGreaterThanOrEqual(1);
    expect(trends.body.points.some((p: { mood: number | null }) => p.mood === null)).toBe(true);
  });

  it('rejects invalid mood values', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post('/api/v1/wellness/checkins')
      .set('Cookie', cookie)
      .send({ mood: 6, timeZone: 'UTC' });
    expect(response.status).toBe(400);
  });
});
