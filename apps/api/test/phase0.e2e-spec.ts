import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Phase 0 API (e2e)', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health/ready checks database', async () => {
    const response = await request(app.getHttpServer()).get('/health/ready');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('dev session + GET /api/v1/account returns seeded user', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'demo@notonlyhere.local' } });
    expect(user).toBeTruthy();

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/dev-session')
      .send({ email: 'demo@notonlyhere.local' });

    expect(login.status).toBe(201);
    const cookie = login.headers['set-cookie'];

    const account = await request(app.getHttpServer())
      .get('/api/v1/account')
      .set('Cookie', cookie);

    expect(account.status).toBe(200);
    expect(account.body.email).toBe('demo@notonlyhere.local');
    expect(account.body.username).toBe('demo');
  });
});
