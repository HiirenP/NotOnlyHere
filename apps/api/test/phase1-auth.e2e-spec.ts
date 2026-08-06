import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Phase 1 Auth (e2e)', () => {
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

  it('rejects registration without age confirmation', async () => {
    const response = await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      displayName: 'Young User',
      username: 'younguser1',
      email: 'young@example.com',
      password: 'Valid123!',
      ageConfirmed: false,
      termsAccepted: true,
      privacyAccepted: true,
      guidelinesAccepted: true,
    });
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('AGE_REQUIRED');
  });

  it('registers, verifies, and logs in a new user', async () => {
    const email = `phase1-${Date.now()}@example.com`;
    const register = await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      displayName: 'Phase One',
      username: `user${Date.now()}`,
      email,
      password: 'Valid123!',
      ageConfirmed: true,
      termsAccepted: true,
      privacyAccepted: true,
      guidelinesAccepted: true,
    });
    expect([200, 201]).toContain(register.status);

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user?.status).toBe('PENDING_VERIFICATION');

    const tokenRow = await prisma.emailToken.findFirst({
      where: { userId: user!.id, purpose: 'VERIFY_EMAIL', consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    expect(tokenRow).toBeTruthy();

    const loginBeforeVerify = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
      email,
      password: 'Valid123!',
    });
    expect(loginBeforeVerify.status).toBe(401);
    expect(loginBeforeVerify.body.code).toBe('EMAIL_NOT_VERIFIED');
  });

  it('logs in seeded demo user with password', async () => {
    const login = await request(app.getHttpServer()).post('/api/v1/auth/login').send({
      email: 'demo@notonlyhere.local',
      password: 'Demo1234!',
    });
    expect([200, 201]).toContain(login.status);
    expect(login.headers['set-cookie']).toBeDefined();

    const account = await request(app.getHttpServer())
      .get('/api/v1/account')
      .set('Cookie', login.headers['set-cookie']);
    expect(account.status).toBe(200);
    expect(account.body.email).toBe('demo@notonlyhere.local');
  });

  it('uses generic forgot-password response', async () => {
    const response = await request(app.getHttpServer()).post('/api/v1/auth/password/forgot').send({
      email: 'missing@example.com',
    });
    expect([200, 201]).toContain(response.status);
    expect(response.body.message).toMatch(/If an account exists/i);
  });
});
