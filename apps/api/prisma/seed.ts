import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { seedDesignDemo } from './seed-design-demo';

const prisma = new PrismaClient();

const DOC_VERSION = '2026-07-30';
const DEMO_PASSWORD = 'Demo1234!';
const now = new Date();

async function main() {
  const demoUserId = '00000000-0000-4000-8000-000000000001';
  const adminUserId = '00000000-0000-4000-8000-000000000002';
  const member2UserId = '00000000-0000-4000-8000-000000000003';
  const disposableUserId = '00000000-0000-4000-8000-000000000099';
  const passwordHash = await argon2.hash(DEMO_PASSWORD, { type: argon2.argon2id });

  const roles = [
    { key: 'SUPER_ADMIN', displayName: 'Super Admin', permissions: ['*'] },
    { key: 'MODERATOR', displayName: 'Moderator', permissions: ['ai_flags.review'] },
    { key: 'STAFF', displayName: 'Staff', permissions: ['event.write'] },
    { key: 'CONTENT_EDITOR', displayName: 'Content Editor', permissions: ['blog.read', 'blog.write', 'blog.publish', 'resource.write'] },
    { key: 'ANALYST', displayName: 'Analyst', permissions: ['analytics.read', 'analytics.export'] },
  ];

  for (const role of roles) {
    const created = await prisma.adminRole.upsert({
      where: { key: role.key },
      update: { displayName: role.displayName },
      create: { id: randomUUID(), key: role.key, displayName: role.displayName },
    });

    for (const permission of role.permissions) {
      await prisma.adminRolePermission.upsert({
        where: { roleId_permission: { roleId: created.id, permission } },
        update: {},
        create: { roleId: created.id, permission },
      });
    }
  }

  const superAdminRole = await prisma.adminRole.findUniqueOrThrow({ where: { key: 'SUPER_ADMIN' } });

  const baseUser = {
    status: 'ACTIVE' as const,
    emailVerifiedAt: now,
    activatedAt: now,
    ageAttestedAt: now,
    termsVersion: DOC_VERSION,
    privacyVersion: DOC_VERSION,
    communityGuidelinesVersion: DOC_VERSION,
    termsAcceptedAt: now,
    privacyAcceptedAt: now,
    communityGuidelinesAcceptedAt: now,
  };

  await prisma.user.upsert({
    where: { id: demoUserId },
    update: {},
    create: {
      id: demoUserId,
      email: 'demo@notonlyhere.local',
      ...baseUser,
      profile: {
        create: {
          username: 'demo',
          displayName: 'Demo Member',
          bio: 'Phase 0 walking skeleton test user.',
        },
      },
      credential: {
        create: {
          passwordHash,
          passwordChangedAt: now,
        },
      },
    },
  });

  await prisma.credential.upsert({
    where: { userId: demoUserId },
    update: { passwordHash, passwordChangedAt: now },
    create: { userId: demoUserId, passwordHash, passwordChangedAt: now },
  });

  await prisma.user.upsert({
    where: { id: adminUserId },
    update: {},
    create: {
      id: adminUserId,
      email: 'admin@notonlyhere.local',
      ...baseUser,
      profile: {
        create: {
          username: 'admin',
          displayName: 'Admin User',
          bio: 'Seeded Super Admin for Phase 0.',
        },
      },
      credential: {
        create: {
          passwordHash,
          passwordChangedAt: now,
        },
      },
    },
  });

  await prisma.credential.upsert({
    where: { userId: adminUserId },
    update: { passwordHash, passwordChangedAt: now },
    create: { userId: adminUserId, passwordHash, passwordChangedAt: now },
  });

  await prisma.adminUserRole.upsert({
    where: { userId_roleId: { userId: adminUserId, roleId: superAdminRole.id } },
    update: {},
    create: { userId: adminUserId, roleId: superAdminRole.id },
  });

  await prisma.user.upsert({
    where: { id: member2UserId },
    update: {},
    create: {
      id: member2UserId,
      email: 'member2@notonlyhere.local',
      ...baseUser,
      profile: {
        create: {
          username: 'member2',
          displayName: 'Member Two',
          bio: 'Second seeded member for Phase 2 connection tests.',
        },
      },
      credential: {
        create: {
          passwordHash,
          passwordChangedAt: now,
        },
      },
    },
  });

  await prisma.credential.upsert({
    where: { userId: member2UserId },
    update: { passwordHash, passwordChangedAt: now },
    create: { userId: member2UserId, passwordHash, passwordChangedAt: now },
  });

  await prisma.user.upsert({
    where: { id: disposableUserId },
    update: {},
    create: {
      id: disposableUserId,
      email: 'disposable@notonlyhere.local',
      ...baseUser,
      profile: {
        create: {
          username: 'disposable',
          displayName: 'Disposable User',
          bio: 'Used for deletion dry-run tests.',
        },
      },
      credential: {
        create: {
          passwordHash,
          passwordChangedAt: now,
        },
      },
    },
  });

  await prisma.credential.upsert({
    where: { userId: disposableUserId },
    update: { passwordHash, passwordChangedAt: now },
    create: { userId: disposableUserId, passwordHash, passwordChangedAt: now },
  });

  await prisma.outboxEvent.create({
    data: {
      aggregateType: 'platform',
      aggregateId: demoUserId,
      eventType: 'platform.noop',
      payload: { message: 'seed-noop', emittedAt: now.toISOString() },
    },
  });

  console.log('Seed complete: demo@notonlyhere.local / member2@notonlyhere.local / disposable@notonlyhere.local (password: Demo1234!)');

  const openCircleId = '00000000-0000-5000-8000-000000000001';
  const approvalCircleId = '00000000-0000-5000-8000-000000000002';
  const hiddenCircleId = '00000000-0000-5000-8000-000000000003';

  await prisma.circle.upsert({
    where: { id: openCircleId },
    update: {},
    create: {
      id: openCircleId,
      slug: 'wellness-circle',
      name: 'Wellness Circle',
      description: 'An open community for daily wellness check-ins and support.',
      guidelines: 'Be kind. No medical advice.',
      visibility: 'PUBLIC',
      joinPolicy: 'OPEN',
      createdByUserId: demoUserId,
      status: 'ACTIVE',
      memberCount: 1,
      members: {
        create: {
          userId: demoUserId,
          role: 'ADMIN',
          status: 'ACTIVE',
          joinedAt: now,
        },
      },
    },
  });

  await prisma.circle.upsert({
    where: { id: approvalCircleId },
    update: {},
    create: {
      id: approvalCircleId,
      slug: 'mindful-requests',
      name: 'Mindful Requests',
      description: 'A private circle that reviews new members before joining.',
      guidelines: 'Respect confidentiality.',
      visibility: 'PRIVATE',
      joinPolicy: 'APPROVAL',
      createdByUserId: member2UserId,
      status: 'ACTIVE',
      memberCount: 1,
      members: {
        create: {
          userId: member2UserId,
          role: 'ADMIN',
          status: 'ACTIVE',
          joinedAt: now,
        },
      },
    },
  });

  await prisma.circle.upsert({
    where: { id: hiddenCircleId },
    update: {},
    create: {
      id: hiddenCircleId,
      slug: 'quiet-haven',
      name: 'Quiet Haven',
      description: 'A hidden circle for invited members only.',
      guidelines: 'Invite-only participation.',
      visibility: 'HIDDEN',
      joinPolicy: 'PRIVATE',
      createdByUserId: demoUserId,
      status: 'ACTIVE',
      memberCount: 1,
      members: {
        create: {
          userId: demoUserId,
          role: 'ADMIN',
          status: 'ACTIVE',
          joinedAt: now,
        },
      },
    },
  });

  const seededEventId = '00000000-0000-5000-8000-000000000004';
  const eventStarts = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const eventEnds = new Date(eventStarts.getTime() + 2 * 60 * 60 * 1000);

  await prisma.event.upsert({
    where: { id: seededEventId },
    update: {},
    create: {
      id: seededEventId,
      creatorUserId: adminUserId,
      slug: 'welcome-gathering',
      title: 'Welcome Gathering',
      description: 'A seeded community event for members to meet and connect.',
      startsAt: eventStarts,
      endsAt: eventEnds,
      timeZone: 'UTC',
      locationName: 'Community Lounge',
      status: 'PUBLISHED',
      scheduleVersion: 1,
      scheduleVersions: {
        create: {
          scheduleVersion: 1,
          startsAt: eventStarts,
          endsAt: eventEnds,
          timeZone: 'UTC',
        },
      },
    },
  });

  const resourceArticleId = '00000000-0000-5000-8000-000000000010';
  await prisma.resource.upsert({
    where: { id: resourceArticleId },
    update: {},
    create: {
      id: resourceArticleId,
      slug: 'grounding-basics',
      kind: 'ARTICLE',
      access: 'MEMBER',
      title: 'Grounding Basics',
      summary: 'A short article on grounding techniques for stressful moments.',
      bodyPlain: 'Take a breath. Notice five things you can see, four you can touch, three you can hear.',
      status: 'PUBLISHED',
      publishedAt: now,
      createdByUserId: adminUserId,
      updatedByUserId: adminUserId,
    },
  });

  const analyticsDefinitions = [
    {
      key: 'page.view',
      version: 1,
      description: 'Page view',
      allowedProperties: { path: 'string' },
    },
    {
      key: 'auth.register_completed',
      version: 1,
      description: 'Registration completed',
      allowedProperties: { method: 'string' },
    },
    {
      key: 'feed.first_post_created',
      version: 1,
      description: 'Member created first post',
      allowedProperties: { postId: 'string' },
    },
    {
      key: 'circle.first_joined',
      version: 1,
      description: 'Member joined first circle',
      allowedProperties: { circleId: 'string' },
    },
  ];

  for (const definition of analyticsDefinitions) {
    await prisma.analyticsEventDefinition.upsert({
      where: { key: definition.key },
      update: {
        version: definition.version,
        description: definition.description,
        allowedProperties: definition.allowedProperties,
        active: true,
      },
      create: definition,
    });
  }

  await seedDesignDemo(prisma, {
    now,
    passwordHash,
    baseUser,
    demoUserId,
    adminUserId,
    member2UserId,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
