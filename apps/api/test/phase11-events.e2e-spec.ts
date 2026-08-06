import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { EventsService } from '../src/events/events.service';
import { PrismaService } from '../src/prisma/prisma.service';

const DEMO_ID = '00000000-0000-4000-8000-000000000001';

async function login(app: INestApplication, email: string) {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password: 'Demo1234!' });
  expect([200, 201]).toContain(response.status);
  return response.headers['set-cookie'] as string[];
}

describe('Phase 11 Events (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let eventsService: EventsService;

  beforeAll(async () => {
    process.env.PHASE0_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', { exclude: ['health/(.*)'] });
    prisma = app.get(PrismaService);
    eventsService = app.get(EventsService);
    await app.init();
    await prisma.eventReminder.deleteMany();
    await prisma.eventRsvp.deleteMany();
    await prisma.eventScheduleVersion.deleteMany();
    await prisma.event.deleteMany();
  });

  afterAll(async () => app.close());

  it('allows staff to create events and blocks ordinary members', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const demoCookie = await login(app, 'demo@notonlyhere.local');

    const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const endsAt = new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString();

    const created = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Cookie', adminCookie)
      .send({
        title: 'Community Hangout',
        description: 'Open community event for members.',
        startsAt,
        endsAt,
        timeZone: 'UTC',
        locationName: 'Main Hall',
      });
    expect([200, 201]).toContain(created.status);
    expect(created.body.title).toBe('Community Hangout');

    const denied = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Cookie', demoCookie)
      .send({
        title: 'Member event',
        description: 'Should fail',
        startsAt,
        endsAt,
        timeZone: 'UTC',
      });
    expect(denied.status).toBe(403);
  });

  it('supports RSVP and creates reminder rows for eligible statuses', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const demoCookie = await login(app, 'demo@notonlyhere.local');

    const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const endsAt = new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString();
    const created = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Cookie', adminCookie)
      .send({
        title: 'RSVP Test Event',
        description: 'Testing RSVP flow.',
        startsAt,
        endsAt,
        timeZone: 'UTC',
      });
    const eventId = created.body.id;

    const rsvp = await request(app.getHttpServer())
      .put(`/api/v1/events/${eventId}/rsvp`)
      .set('Cookie', demoCookie)
      .send({ status: 'GOING' });
    expect(rsvp.status).toBe(200);
    expect(rsvp.body.status).toBe('GOING');

    const reminders = await prisma.eventReminder.count({
      where: { eventId, userId: DEMO_ID, cancelledAt: null },
    });
    expect(reminders).toBe(2);

    const detail = await request(app.getHttpServer())
      .get(`/api/v1/events/${eventId}`)
      .set('Cookie', demoCookie);
    expect(detail.body.viewer.rsvpStatus).toBe('GOING');
  });

  it('lists events in a date range for month/list views', async () => {
    const demoCookie = await login(app, 'demo@notonlyhere.local');
    const from = new Date().toISOString();
    const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const list = await request(app.getHttpServer())
      .get(`/api/v1/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&view=month`)
      .set('Cookie', demoCookie);
    expect(list.status).toBe(200);
    expect(list.body.view).toBe('month');
    expect(list.body.items.length).toBeGreaterThan(0);
  });

  it('sends event reminders idempotently', async () => {
    const adminCookie = await login(app, 'admin@notonlyhere.local');
    const demoCookie = await login(app, 'demo@notonlyhere.local');

    const startsAt = new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString();
    const endsAt = new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString();
    const created = await request(app.getHttpServer())
      .post('/api/v1/events')
      .set('Cookie', adminCookie)
      .send({
        title: 'Soon Event',
        description: 'Reminder test.',
        startsAt,
        endsAt,
        timeZone: 'UTC',
      });
    const eventId = created.body.id;

    await request(app.getHttpServer())
      .put(`/api/v1/events/${eventId}/rsvp`)
      .set('Cookie', demoCookie)
      .send({ status: 'MAYBE' });

    await prisma.eventReminder.updateMany({
      where: { eventId, userId: DEMO_ID, kind: 'HOURS_24' },
      data: { remindAt: new Date(Date.now() - 60_000) },
    });

    const first = await eventsService.processDueReminders();
    expect(first.sent).toBeGreaterThanOrEqual(1);

    const second = await eventsService.processDueReminders();
    expect(second.sent).toBe(0);

    const notifications = await prisma.notification.count({
      where: { recipientUserId: DEMO_ID, eventType: 'event.reminder', eventId },
    });
    expect(notifications).toBeGreaterThanOrEqual(1);
  });
});
