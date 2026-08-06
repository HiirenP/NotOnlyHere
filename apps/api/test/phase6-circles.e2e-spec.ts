import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { CircleInvitesService } from '../src/circles/circle-invites.service';
import { PrismaService } from '../src/prisma/prisma.service';

const OPEN_CIRCLE = '00000000-0000-5000-8000-000000000001';
const APPROVAL_CIRCLE = '00000000-0000-5000-8000-000000000002';
const HIDDEN_CIRCLE = '00000000-0000-5000-8000-000000000003';
const DEMO_ID = '00000000-0000-4000-8000-000000000001';
const MEMBER2_ID = '00000000-0000-4000-8000-000000000003';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 6 Circles (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let invites: CircleInvitesService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    invites = app.get(CircleInvitesService);
    await app.init();

    await prisma.circleInvite.deleteMany();
    await prisma.circleMember.deleteMany({ where: { userId: MEMBER2_ID } });
    await prisma.circleMember.updateMany({
      where: { circleId: OPEN_CIRCLE, userId: DEMO_ID },
      data: { status: 'ACTIVE', role: 'ADMIN', leftAt: null, joinedAt: new Date() },
    });
    await prisma.circle.update({
      where: { id: OPEN_CIRCLE },
      data: { memberCount: 1 },
    });
    await prisma.circle.update({
      where: { id: APPROVAL_CIRCLE },
      data: { memberCount: 1 },
    });
    await prisma.circle.update({
      where: { id: HIDDEN_CIRCLE },
      data: { memberCount: 1 },
    });
  });

  afterAll(async () => app.close());

  it('lists public/private circles but hides hidden circles from non-members', async () => {
    const cookie = await login(app, 'member2@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .get('/api/v1/circles?limit=50')
      .set('Cookie', cookie);
    expect(response.status).toBe(200);
    const ids = response.body.items.map((item: { id: string }) => item.id);
    expect(ids).toContain(OPEN_CIRCLE);
    expect(ids).toContain(APPROVAL_CIRCLE);
    expect(ids).not.toContain(HIDDEN_CIRCLE);
  });

  it('joins an open circle immediately', async () => {
    const cookie = await login(app, 'member2@notonlyhere.local');
    const joined = await request(app.getHttpServer())
      .post(`/api/v1/circles/${OPEN_CIRCLE}/membership`)
      .set('Cookie', cookie);
    expect([200, 201]).toContain(joined.status);
    expect(joined.body.status).toBe('ACTIVE');
  });

  it('submits approval request for approval-gated circle', async () => {
    const cookie = await login(app, 'member2@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post(`/api/v1/circles/${APPROVAL_CIRCLE}/membership`)
      .set('Cookie', cookie);
    expect([200, 201]).toContain(response.status);
    expect(response.body.status).toBe('PENDING');
  });

  it('blocks duplicate join attempts', async () => {
    const cookie = await login(app, 'member2@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post(`/api/v1/circles/${OPEN_CIRCLE}/membership`)
      .set('Cookie', cookie);
    expect(response.status).toBe(409);
  });

  it('accepts a valid invite to a hidden circle', async () => {
    const token = 'phase6-hidden-invite-token';
    await invites.createInviteForUser(HIDDEN_CIRCLE, DEMO_ID, MEMBER2_ID, token);
    const cookie = await login(app, 'member2@notonlyhere.local');
    const accepted = await request(app.getHttpServer())
      .post(`/api/v1/circle-invites/${token}/accept`)
      .set('Cookie', cookie);
    expect([200, 201]).toContain(accepted.status);
    expect(accepted.body.circleId).toBe(HIDDEN_CIRCLE);

    const detail = await request(app.getHttpServer())
      .get(`/api/v1/circles/${HIDDEN_CIRCLE}`)
      .set('Cookie', cookie);
    expect(detail.status).toBe(200);
  });

  it('rejects expired invites', async () => {
    const token = 'phase6-expired-invite';
    const tokenHash = invites.hashToken(token);
    await prisma.circleInvite.create({
      data: {
        circleId: HIDDEN_CIRCLE,
        inviterUserId: DEMO_ID,
        inviteeUserId: MEMBER2_ID,
        tokenHash,
        expiresAt: new Date(Date.now() - 60_000),
      },
    });
    const cookie = await login(app, 'member2@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .post(`/api/v1/circle-invites/${token}/accept`)
      .set('Cookie', cookie);
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVITE_EXPIRED');
  });

  it('prevents sole admin from leaving', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .delete(`/api/v1/circles/${HIDDEN_CIRCLE}/membership`)
      .set('Cookie', cookie);
    expect(response.status).toBe(403);
    expect(response.body.code).toBe('LAST_ADMIN');
  });

  it('restricts member list to members', async () => {
    await prisma.circleMember.deleteMany({ where: { circleId: OPEN_CIRCLE, userId: MEMBER2_ID } });
    const cookie = await login(app, 'member2@notonlyhere.local');
    const response = await request(app.getHttpServer())
      .get(`/api/v1/circles/${OPEN_CIRCLE}/members`)
      .set('Cookie', cookie);
    expect(response.status).toBe(404);
  });
});
