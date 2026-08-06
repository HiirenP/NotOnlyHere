import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

async function login(app: INestApplication, email: string, password: string) {
  const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ email, password });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 2 Social (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    process.env.EXPORT_STORAGE_DIR = join(process.cwd(), '.exports-test');
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

  it('updates own profile fields', async () => {
    const cookie = await login(app, 'demo@notonlyhere.local', 'Demo1234!');
    const current = await request(app.getHttpServer())
      .get('/api/v1/profiles/me')
      .set('Cookie', cookie);
    expect(current.status).toBe(200);

    const updated = await request(app.getHttpServer())
      .patch('/api/v1/profiles/me')
      .set('Cookie', cookie)
      .send({
        displayName: 'Demo Updated',
        bio: 'Phase 2 profile bio',
        version: current.body.version,
      });
    expect(updated.status).toBe(200);
    expect(updated.body.displayName).toBe('Demo Updated');
    expect(updated.body.bio).toBe('Phase 2 profile bio');
  });

  it('sends, accepts, and lists a connection', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local', 'Demo1234!');
    const member2Cookie = await login(app, 'member2@notonlyhere.local', 'Demo1234!');

    await prisma.connection.deleteMany({
      where: {
        OR: [
          { requesterId: '00000000-0000-4000-8000-000000000001', addresseeId: '00000000-0000-4000-8000-000000000003' },
          { requesterId: '00000000-0000-4000-8000-000000000003', addresseeId: '00000000-0000-4000-8000-000000000001' },
        ],
      },
    });
    await prisma.userBlock.deleteMany({
      where: {
        OR: [
          { blockerId: '00000000-0000-4000-8000-000000000001', blockedId: '00000000-0000-4000-8000-000000000003' },
          { blockerId: '00000000-0000-4000-8000-000000000003', blockedId: '00000000-0000-4000-8000-000000000001' },
        ],
      },
    });

    const requestConnection = await request(app.getHttpServer())
      .post('/api/v1/connections/requests')
      .set('Cookie', demoCookie)
      .send({ username: 'member2' });
    expect(requestConnection.status).toBe(201);
    expect(requestConnection.body.status).toBe('PENDING');

    const accept = await request(app.getHttpServer())
      .post(`/api/v1/connections/${requestConnection.body.id}/accept`)
      .set('Cookie', member2Cookie);
    expect(accept.status).toBe(201);
    expect(accept.body.status).toBe('ACCEPTED');

    const list = await request(app.getHttpServer())
      .get('/api/v1/connections')
      .set('Cookie', demoCookie);
    expect(list.status).toBe(200);
    expect(list.body.some((item: { status: string }) => item.status === 'ACCEPTED')).toBe(true);
  });

  it('converges crossed connection requests to accepted', async () => {
    await prisma.connection.deleteMany({
      where: {
        OR: [
          { requesterId: '00000000-0000-4000-8000-000000000001', addresseeId: '00000000-0000-4000-8000-000000000003' },
          { requesterId: '00000000-0000-4000-8000-000000000003', addresseeId: '00000000-0000-4000-8000-000000000001' },
        ],
      },
    });

    const demoCookie = await login(app, 'demo@notonlyhere.local', 'Demo1234!');
    const member2Cookie = await login(app, 'member2@notonlyhere.local', 'Demo1234!');

    await request(app.getHttpServer())
      .post('/api/v1/connections/requests')
      .set('Cookie', demoCookie)
      .send({ username: 'member2' });

    const crossed = await request(app.getHttpServer())
      .post('/api/v1/connections/requests')
      .set('Cookie', member2Cookie)
      .send({ username: 'demo' });

    expect([200, 201]).toContain(crossed.status);
    expect(crossed.body.status).toBe('ACCEPTED');
  });

  it('block wins over connection eligibility', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local', 'Demo1234!');
    const member2Cookie = await login(app, 'member2@notonlyhere.local', 'Demo1234!');

    await prisma.connection.deleteMany({
      where: {
        OR: [
          { requesterId: '00000000-0000-4000-8000-000000000001', addresseeId: '00000000-0000-4000-8000-000000000003' },
          { requesterId: '00000000-0000-4000-8000-000000000003', addresseeId: '00000000-0000-4000-8000-000000000001' },
        ],
      },
    });
    await prisma.userBlock.deleteMany({
      where: {
        OR: [
          { blockerId: '00000000-0000-4000-8000-000000000001', blockedId: '00000000-0000-4000-8000-000000000003' },
          { blockerId: '00000000-0000-4000-8000-000000000003', blockedId: '00000000-0000-4000-8000-000000000001' },
        ],
      },
    });

    await request(app.getHttpServer())
      .post('/api/v1/connections/requests')
      .set('Cookie', demoCookie)
      .send({ username: 'member2' });

    await request(app.getHttpServer())
      .post('/api/v1/blocks')
      .set('Cookie', member2Cookie)
      .send({ username: 'demo' });

    const blockedRequest = await request(app.getHttpServer())
      .post('/api/v1/connections/requests')
      .set('Cookie', demoCookie)
      .send({ username: 'member2' });
    expect(blockedRequest.status).toBe(403);

    const hiddenProfile = await request(app.getHttpServer())
      .get('/api/v1/profiles/member2')
      .set('Cookie', demoCookie);
    expect(hiddenProfile.status).toBe(404);
  });

  it('requests account export and allows download for requester only', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local', 'Demo1234!');
    const member2Cookie = await login(app, 'member2@notonlyhere.local', 'Demo1234!');

    const exportRequest = await request(app.getHttpServer())
      .post('/api/v1/account/export')
      .set('Cookie', demoCookie)
      .send({ password: 'Demo1234!', idempotencyKey: `phase2-${Date.now()}` });
    expect([200, 201]).toContain(exportRequest.status);
    const exportId = exportRequest.body.id;

    const exportDir = process.env.EXPORT_STORAGE_DIR!;
    await mkdir(exportDir, { recursive: true });
    await writeFile(join(exportDir, `${exportId}.json`), JSON.stringify({ account: { email: 'demo@notonlyhere.local' } }));
    await prisma.accountExport.update({
      where: { id: exportId },
      data: {
        status: 'READY',
        objectKey: `exports/demo/${exportId}.json`,
        completedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const download = await request(app.getHttpServer())
      .get(`/api/v1/account/export/${exportId}/download`)
      .set('Cookie', demoCookie);
    expect(download.status).toBe(200);
    expect(download.text).toContain('demo@notonlyhere.local');

    const denied = await request(app.getHttpServer())
      .get(`/api/v1/account/export/${exportId}/download`)
      .set('Cookie', member2Cookie);
    expect(denied.status).toBe(404);
  });

  it('schedules account deletion with re-authentication', async () => {
    await prisma.user.update({
      where: { id: '00000000-0000-4000-8000-000000000099' },
      data: {
        status: 'ACTIVE',
        deletionRequestedAt: null,
        deletionDueAt: null,
        deletedAt: null,
        email: 'disposable@notonlyhere.local',
      },
    });
    await prisma.profile.upsert({
      where: { userId: '00000000-0000-4000-8000-000000000099' },
      update: {},
      create: {
        userId: '00000000-0000-4000-8000-000000000099',
        username: 'disposable',
        displayName: 'Disposable User',
      },
    });

    const cookie = await login(app, 'disposable@notonlyhere.local', 'Demo1234!');
    const deletion = await request(app.getHttpServer())
      .delete('/api/v1/account')
      .set('Cookie', cookie)
      .send({ password: 'Demo1234!' });
    expect([200, 201]).toContain(deletion.status);
    expect(deletion.body.status).toBe('DELETION_PENDING');

    const user = await prisma.user.findUnique({ where: { id: '00000000-0000-4000-8000-000000000099' } });
    expect(user?.status).toBe('DELETION_PENDING');
  });
});
