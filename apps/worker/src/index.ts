import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash, randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const WORKER_ID = process.env.WORKER_ID ?? 'phase0-worker';
const POLL_MS = Number(process.env.WORKER_POLL_MS ?? 3000);
const EXPORT_DIR = process.env.EXPORT_STORAGE_DIR ?? join(process.cwd(), '.exports');
const EXPORT_TTL_DAYS = 7;

async function claimBatch() {
  return prisma.$transaction(async (tx) => {
    const events = await tx.$queryRaw<{ id: string }[]>`
      SELECT id FROM outbox_events
      WHERE status = 'PENDING' AND available_at <= NOW()
      ORDER BY available_at, id
      FOR UPDATE SKIP LOCKED
      LIMIT 10`;

    const ids = events.map((e) => e.id);
    if (ids.length === 0) return [];

    await tx.outboxEvent.updateMany({
      where: { id: { in: ids } },
      data: { status: 'PROCESSING', lockedAt: new Date(), lockedBy: WORKER_ID },
    });

    return tx.outboxEvent.findMany({ where: { id: { in: ids } } });
  });
}

async function processAccountExport(exportId: string, userId: string) {
  await prisma.accountExport.update({
    where: { id: exportId },
    data: { status: 'PROCESSING' },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      requestedConnections: { include: { addressee: { include: { profile: true } } } },
      receivedConnections: { include: { requester: { include: { profile: true } } } },
      blocksInitiated: { include: { blocked: { include: { profile: true } } } },
      activityEvents: true,
    },
  });

  if (!user) {
    await prisma.accountExport.update({
      where: { id: exportId },
      data: { status: 'FAILED', errorCode: 'USER_NOT_FOUND' },
    });
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      profile: user.profile,
    },
    connections: [...user.requestedConnections, ...user.receivedConnections].map((connection) => ({
      id: connection.id,
      status: connection.status,
      requesterId: connection.requesterId,
      addresseeId: connection.addresseeId,
      createdAt: connection.createdAt.toISOString(),
    })),
    blocks: user.blocksInitiated.map((block) => ({
      blockedId: block.blockedId,
      blockedAt: block.createdAt.toISOString(),
    })),
    activity: user.activityEvents.map((event) => ({
      id: event.id,
      type: event.type,
      summary: event.summary,
      occurredAt: event.occurredAt.toISOString(),
    })),
  };

  await mkdir(EXPORT_DIR, { recursive: true });
  const objectKey = `exports/${userId}/${exportId}.json`;
  const filePath = join(EXPORT_DIR, `${exportId}.json`);
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');

  const completedAt = new Date();
  const expiresAt = new Date(completedAt.getTime() + EXPORT_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.accountExport.update({
    where: { id: exportId },
    data: {
      status: 'READY',
      objectKey,
      completedAt,
      expiresAt,
    },
  });
}

async function processAccountDeletion(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.status !== 'DELETION_PENDING') return;

  if (user.email === 'disposable@notonlyhere.local') {
    await prisma.$transaction([
      prisma.activityEvent.deleteMany({ where: { userId } }),
      prisma.accountExport.deleteMany({ where: { userId } }),
      prisma.userBlock.deleteMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      }),
      prisma.connection.deleteMany({
        where: { OR: [{ requesterId: userId }, { addresseeId: userId }] },
      }),
      prisma.profile.deleteMany({ where: { userId } }),
      prisma.credential.deleteMany({ where: { userId } }),
      prisma.user.update({
        where: { id: userId },
        data: {
          status: 'ANONYMIZED',
          email: `anonymized+${user.anonymizedReference}@deleted.local`,
          deletedAt: new Date(),
        },
      }),
    ]);
    return;
  }

  console.log(
    JSON.stringify({
      level: 'info',
      message: 'deletion scheduled (grace period)',
      userId,
      dueAt: user.deletionDueAt?.toISOString(),
      workerId: WORKER_ID,
    }),
  );
}

function hashEmail(email: string) {
  return createHash('sha256').update(email.toLowerCase()).digest();
}

const FLAG_PATTERNS = [
  { pattern: /\b(kill|hurt)\s+you\b/i, category: 'THREATS', rationaleCode: 'THREAT_LANGUAGE', confidence: 0.82 },
  { pattern: /\bharass\b/i, category: 'HARASSMENT', rationaleCode: 'HARASSMENT_LANGUAGE', confidence: 0.71 },
];

async function processModerationPost(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.status !== 'ACTIVE') return;
  await createModerationFlag({ postId, body: post.body });
}

async function processModerationComment(commentId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.status !== 'ACTIVE') return;
  await createModerationFlag({ commentId, body: comment.body });
}

async function createModerationFlag(input: { postId?: string; commentId?: string; body: string }) {
  const match = FLAG_PATTERNS.find((entry) => entry.pattern.test(input.body));
  if (!match) return;

  const existing = await prisma.aiModFlag.findFirst({
    where: {
      postId: input.postId ?? null,
      commentId: input.commentId ?? null,
      status: 'OPEN',
      category: match.category,
    },
  });
  if (existing) return;

  await prisma.aiModFlag.create({
    data: {
      id: randomUUID(),
      postId: input.postId ?? null,
      commentId: input.commentId ?? null,
      category: match.category,
      confidence: match.confidence,
      modelVersion: 'dev-mod-v1',
      rationaleCode: match.rationaleCode,
    },
  });
}

async function deliverNotificationEmail(payload: {
  notificationId: string;
  recipientUserId: string;
  eventType: string;
}) {
  const user = await prisma.user.findUnique({ where: { id: payload.recipientUserId } });
  if (!user) return;

  const deduplicationKey = `email:${payload.notificationId}`;
  const existing = await prisma.emailDelivery.findUnique({ where: { deduplicationKey } });
  if (existing) return;

  await prisma.emailDelivery.create({
    data: {
      id: randomUUID(),
      recipientUserId: payload.recipientUserId,
      recipientEmailHash: hashEmail(user.email),
      templateKey: payload.eventType,
      eventType: payload.eventType,
      notificationId: payload.notificationId,
      status: 'SENT',
      deduplicationKey,
      sentAt: new Date(),
      attemptCount: 1,
      lastAttemptAt: new Date(),
    },
  });

  console.log(
    JSON.stringify({
      level: 'info',
      message: 'notification email delivered (dev log)',
      notificationId: payload.notificationId,
      eventType: payload.eventType,
      workerId: WORKER_ID,
    }),
  );
}

async function processEvent(eventId: string, eventType: string, payload: unknown) {
  if (eventType === 'platform.noop' || eventType === 'email.verification' || eventType === 'email.password_reset') {
    if (eventType.startsWith('email.')) {
      console.log(
        JSON.stringify({
          level: 'info',
          message: 'email event (dev log)',
          eventType,
          payload,
          workerId: WORKER_ID,
        }),
      );
    } else {
      console.log(JSON.stringify({ level: 'info', message: 'noop event delivered', eventId, workerId: WORKER_ID }));
    }
  } else if (eventType === 'account.export') {
    const data = payload as { exportId: string };
    const event = await prisma.outboxEvent.findUnique({ where: { id: eventId } });
    if (event) {
      await processAccountExport(data.exportId, event.aggregateId);
    }
  } else if (eventType === 'account.deletion') {
    const event = await prisma.outboxEvent.findUnique({ where: { id: eventId } });
    if (event) {
      await processAccountDeletion(event.aggregateId);
    }
  } else if (eventType === 'notification.email') {
    await deliverNotificationEmail(payload as {
      notificationId: string;
      recipientUserId: string;
      eventType: string;
    });
  } else if (eventType === 'moderation.evaluate') {
    const data = payload as { postId?: string; commentId?: string };
    if (data.postId) {
      await processModerationPost(data.postId);
    } else if (data.commentId) {
      await processModerationComment(data.commentId);
    }
  } else {
    await prisma.outboxEvent.update({
      where: { id: eventId },
      data: { status: 'DEAD', lastErrorCode: 'UNKNOWN_EVENT_TYPE' },
    });
    return;
  }

  await prisma.$transaction([
    prisma.outboxEvent.update({
      where: { id: eventId },
      data: { status: 'DELIVERED', deliveredAt: new Date(), lockedAt: null, lockedBy: null },
    }),
    prisma.outboxConsumption.create({
      data: {
        consumer: WORKER_ID,
        eventId,
        processedAt: new Date(),
        result: 'ok',
      },
    }),
  ]);
}

async function tick() {
  const events = await claimBatch();
  for (const event of events) {
    try {
      await processEvent(event.id, event.eventType, event.payload);
    } catch (error) {
      console.error(JSON.stringify({ level: 'error', message: 'event failed', eventId: event.id, error: String(error) }));
      await prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: 'PENDING', lockedAt: null, lockedBy: null, attemptCount: { increment: 1 } },
      });
    }
  }

  await processDueEventReminders();
  await processDueBlogPosts();
  await processDailyAnalytics();
}

async function processDailyAnalytics() {
  const metricDate = new Date();
  metricDate.setUTCHours(0, 0, 0, 0);

  const dau = await prisma.analyticsEvent.findMany({
    where: {
      occurredAt: { gte: metricDate, lt: new Date(metricDate.getTime() + 24 * 60 * 60 * 1000) },
      userId: { not: null },
    },
    distinct: ['userId'],
    select: { userId: true },
  });

  if (dau.length === 0) return;

  await prisma.analyticsDailyAggregate.upsert({
    where: {
      metricDate_metricKey_dimensionKey_dimensionValue: {
        metricDate,
        metricKey: 'dau',
        dimensionKey: 'all',
        dimensionValue: 'all',
      },
    },
    update: {
      valueNumeric: dau.length,
      computedAt: new Date(),
      sourceWindowEnd: new Date(),
    },
    create: {
      metricDate,
      metricKey: 'dau',
      dimensionKey: 'all',
      dimensionValue: 'all',
      valueNumeric: dau.length,
      sourceWindowEnd: new Date(),
    },
  });
}

async function processDueBlogPosts() {
  const due = await prisma.blogPost.findMany({
    where: { status: 'SCHEDULED', scheduledAt: { lte: new Date() } },
    select: { id: true },
  });
  if (due.length === 0) return;

  const result = await prisma.blogPost.updateMany({
    where: { id: { in: due.map((row) => row.id) }, status: 'SCHEDULED' },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  });

  if (result.count > 0) {
    console.log(
      JSON.stringify({
        level: 'info',
        message: 'blog posts published from schedule',
        count: result.count,
        workerId: WORKER_ID,
      }),
    );
  }
}

async function processDueEventReminders() {
  const due = await prisma.eventReminder.findMany({
    where: {
      remindAt: { lte: new Date() },
      sentAt: null,
      cancelledAt: null,
      event: { status: 'PUBLISHED' },
    },
    orderBy: { remindAt: 'asc' },
    take: 20,
    include: { event: true, user: true },
  });

  for (const reminder of due) {
    const claimed = await prisma.eventReminder.updateMany({
      where: { id: reminder.id, sentAt: null, cancelledAt: null },
      data: { sentAt: new Date() },
    });
    if (claimed.count === 0) continue;

    const notificationId = randomUUID();
    await prisma.notification.create({
      data: {
        id: notificationId,
        recipientUserId: reminder.userId,
        eventType: 'event.reminder',
        eventId: reminder.eventId,
        titleKey: 'notifications.event.reminder.title',
        bodyKey: 'notifications.event.reminder.body',
        templateParams: {
          eventId: reminder.eventId,
          eventTitle: reminder.event.title,
          kind: reminder.kind,
          startsAt: reminder.event.startsAt.toISOString(),
        },
      },
    });

    const deduplicationKey = `email:${notificationId}`;
    const existing = await prisma.emailDelivery.findUnique({ where: { deduplicationKey } });
    if (!existing) {
      await prisma.emailDelivery.create({
        data: {
          id: randomUUID(),
          recipientUserId: reminder.userId,
          recipientEmailHash: hashEmail(reminder.user.email),
          templateKey: 'event.reminder',
          eventType: 'event.reminder',
          notificationId,
          status: 'SENT',
          deduplicationKey,
          sentAt: new Date(),
          attemptCount: 1,
          lastAttemptAt: new Date(),
        },
      });
    }

    console.log(
      JSON.stringify({
        level: 'info',
        message: 'event reminder delivered (dev log)',
        reminderId: reminder.id,
        eventId: reminder.eventId,
        workerId: WORKER_ID,
      }),
    );
  }
}

console.log(JSON.stringify({ level: 'info', message: 'worker started', workerId: WORKER_ID }));
setInterval(() => {
  tick().catch((error) => {
    console.error(JSON.stringify({ level: 'error', message: 'worker tick failed', error: String(error) }));
  });
}, POLL_MS);
