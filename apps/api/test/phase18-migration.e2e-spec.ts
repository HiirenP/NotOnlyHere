import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { EmailTokenService } from '../src/auth/email-token.service';
import { MigrationImportService } from '../src/migration/migration-import.service';
import { PrismaService } from '../src/prisma/prisma.service';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 18 Migration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let imports: MigrationImportService;
  let emailTokens: EmailTokenService;

  const fixture = {
    users: [
      {
        sourceId: 'wp-user-1',
        email: 'migrated@notonlyhere.local',
        username: 'migrated',
        displayName: 'Migrated Member',
      },
    ],
    circles: [
      {
        sourceId: 'bb-group-1',
        name: 'Legacy Support Circle',
        slug: 'legacy-support',
        description: 'Imported from BuddyBoss',
      },
    ],
    posts: [
      {
        sourceId: 'bb-post-1',
        authorSourceId: 'wp-user-1',
        body: 'Hello from the legacy community.',
        circleSourceId: 'bb-group-1',
      },
    ],
  };

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    imports = app.get(MigrationImportService);
    emailTokens = app.get(EmailTokenService);
    await app.init();

    await prisma.post.deleteMany({ where: { body: { contains: 'legacy community' } } });
    await prisma.migrationSourceMap.deleteMany();
    await prisma.migrationRun.deleteMany();
    await prisma.legacyRedirect.deleteMany();
    await prisma.user.deleteMany({ where: { email: 'migrated@notonlyhere.local' } });
  });

  afterAll(async () => {
    await prisma.post.deleteMany({ where: { body: { contains: 'legacy community' } } });
    await prisma.circle.deleteMany({ where: { slug: { startsWith: 'legacy-support' } } });
    await prisma.migrationSourceMap.deleteMany();
    await prisma.migrationRun.deleteMany();
    await prisma.legacyRedirect.deleteMany();
    await prisma.user.deleteMany({ where: { email: 'migrated@notonlyhere.local' } });
    await app.close();
  });

  it('imports fixture idempotently and reconciles counts', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');

    const first = await request(app.getHttpServer())
      .post('/api/v1/admin/migration/runs')
      .set('Cookie', adminCookie)
      .send({ sourceSystem: 'buddyboss-dev', dryRun: false, fixture });
    expect([200, 201]).toContain(first.status);
    expect(first.body.status).toBe('COMPLETED');
    expect(first.body.counts.USER.imported).toBe(1);

    const second = await imports.runImport('00000000-0000-4000-8000-000000000002', {
      sourceSystem: 'buddyboss-dev',
      dryRun: false,
      fixture,
    });
    expect(second.counts.USER.skipped).toBe(1);

    const report = await request(app.getHttpServer())
      .get(`/api/v1/admin/migration/runs/${first.body.runId}/reconciliation`)
      .set('Cookie', adminCookie);
    expect(report.status).toBe(200);
    expect(report.body.status).toBe('COMPLETED');
  });

  it('supports account claim for imported users without credentials', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'migrated@notonlyhere.local' },
      include: { credential: true },
    });
    expect(user).toBeTruthy();
    expect(user?.credential).toBeNull();

    const claim = await request(app.getHttpServer())
      .post('/api/v1/auth/migration/claim-request')
      .send({ email: 'migrated@notonlyhere.local' });
    expect([200, 201]).toContain(claim.status);

    const rawToken = await emailTokens.create(user!.id, 'RESET_PASSWORD');
    const reset = await request(app.getHttpServer())
      .post('/api/v1/auth/password/reset')
      .send({ token: rawToken, password: 'ClaimPass1!' });
    expect([200, 201]).toContain(reset.status);

    const loginAttempt = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'migrated@notonlyhere.local', password: 'ClaimPass1!' });
    expect([200, 201]).toContain(loginAttempt.status);
  });

  it('resolves legacy redirects and blocks members from migration admin', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const memberCookie = await login(app, 'demo@notonlyhere.local');

    await request(app.getHttpServer())
      .post('/api/v1/admin/migration/redirects')
      .set('Cookie', adminCookie)
      .send({ sourcePath: '/groups/legacy-support', targetPath: '/app/circles' });

    const resolved = await request(app.getHttpServer()).get(
      '/api/v1/legacy/resolve?path=/groups/legacy-support',
    );
    expect(resolved.status).toBe(200);
    expect(resolved.body.targetPath).toBe('/app/circles');

    const denied = await request(app.getHttpServer())
      .get('/api/v1/admin/migration/reconciliation')
      .set('Cookie', memberCookie);
    expect(denied.status).toBe(403);
  });

  it('reports release readiness with migration checks', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const readiness = await request(app.getHttpServer())
      .get('/api/v1/admin/migration/release-readiness')
      .set('Cookie', adminCookie);
    expect(readiness.status).toBe(200);
    expect(Array.isArray(readiness.body.checks)).toBe(true);
    expect(readiness.body.checks.some((check: { key: string }) => check.key === 'migration.completed')).toBe(
      true,
    );
  });
});
