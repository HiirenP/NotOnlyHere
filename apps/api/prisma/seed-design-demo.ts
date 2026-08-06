import { createHash } from 'crypto';
import type { PrismaClient } from '@prisma/client';

type SeedCtx = {
  now: Date;
  passwordHash: string;
  baseUser: {
    status: 'ACTIVE';
    emailVerifiedAt: Date;
    activatedAt: Date;
    ageAttestedAt: Date;
    termsVersion: string;
    privacyVersion: string;
    communityGuidelinesVersion: string;
    termsAcceptedAt: Date;
    privacyAcceptedAt: Date;
    communityGuidelinesAcceptedAt: Date;
  };
  demoUserId: string;
  adminUserId: string;
  member2UserId: string;
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function hoursAgo(h: number, now: Date) {
  return new Date(now.getTime() - h * HOUR);
}

function daysAgo(d: number, now: Date) {
  return new Date(now.getTime() - d * DAY);
}

function pairKey(userA: string, userB: string) {
  const sorted = [userA, userB].sort();
  return createHash('sha256').update(sorted.join(':')).digest();
}

async function upsertMember(
  prisma: PrismaClient,
  ctx: SeedCtx,
  id: string,
  email: string,
  username: string,
  displayName: string,
  bio: string,
) {
  await prisma.user.upsert({
    where: { id },
    update: {
      profile: {
        update: { displayName, bio, username },
      },
    },
    create: {
      id,
      email,
      ...ctx.baseUser,
      profile: { create: { username, displayName, bio } },
      credential: { create: { passwordHash: ctx.passwordHash, passwordChangedAt: ctx.now } },
    },
  });
  await prisma.credential.upsert({
    where: { userId: id },
    update: { passwordHash: ctx.passwordHash, passwordChangedAt: ctx.now },
    create: { userId: id, passwordHash: ctx.passwordHash, passwordChangedAt: ctx.now },
  });
}

export async function seedDesignDemo(prisma: PrismaClient, ctx: SeedCtx) {
  const { now, demoUserId, adminUserId } = ctx;

  await prisma.aiUsageDaily.deleteMany({ where: { userId: demoUserId } });

  const jordanId = '00000000-0000-4000-8000-000000000010';
  const samId = '00000000-0000-4000-8000-000000000011';
  const morganId = '00000000-0000-4000-8000-000000000012';
  const taylorId = '00000000-0000-4000-8000-000000000013';
  const priyaId = '00000000-0000-4000-8000-000000000014';
  const chrisId = '00000000-0000-4000-8000-000000000015';

  await prisma.profile.update({
    where: { userId: demoUserId },
    data: {
      displayName: 'Alex Morgan',
      bio: 'Finding calm in community. Here for peer support and honest conversations.',
    },
  });

  const members = [
    [jordanId, 'jordan@notonlyhere.local', 'jordanl', 'Jordan Lee', 'Peer supporter at NotOnlyHere'],
    [samId, 'sam@notonlyhere.local', 'samr', 'Sam Rivera', 'Community member and new parent'],
    [morganId, 'morgan@notonlyhere.local', 'morgank', 'Morgan Kim', 'Circle admin and community builder'],
    [taylorId, 'taylor@notonlyhere.local', 'taylorb', 'Taylor Brooks', 'Advocate for work-life balance'],
    [priyaId, 'priya@notonlyhere.local', 'priyas', 'Priya Shah', 'Wellness enthusiast'],
    [chrisId, 'chris@notonlyhere.local', 'chrisp', 'Chris Park', 'Student life mentor'],
  ] as const;

  for (const [id, email, username, displayName, bio] of members) {
    await upsertMember(prisma, ctx, id, email, username, displayName, bio);
  }

  const anxietyCircleId = '00000000-0000-5000-8000-000000000011';
  const parentsCircleId = '00000000-0000-5000-8000-000000000012';
  const griefCircleId = '00000000-0000-5000-8000-000000000013';
  const workCircleId = '00000000-0000-5000-8000-000000000014';

  const circles = [
    {
      id: anxietyCircleId,
      slug: 'anxiety-support',
      name: 'Anxiety Support',
      description: 'A calm, moderated space to share experiences, coping strategies, and encouragement.',
      visibility: 'PUBLIC' as const,
      joinPolicy: 'OPEN' as const,
      memberCount: 4,
      members: [demoUserId, jordanId, morganId, priyaId],
    },
    {
      id: parentsCircleId,
      slug: 'new-parents',
      name: 'New Parents',
      description: 'For parents navigating the beautiful chaos. Share wins, worries, and resources.',
      visibility: 'PRIVATE' as const,
      joinPolicy: 'APPROVAL' as const,
      memberCount: 3,
      members: [demoUserId, samId, chrisId],
    },
    {
      id: griefCircleId,
      slug: 'grief-loss',
      name: 'Grief & Loss',
      description: 'A gentle space for those processing loss. Move at your own pace.',
      visibility: 'PUBLIC' as const,
      joinPolicy: 'OPEN' as const,
      memberCount: 2,
      members: [morganId, taylorId],
    },
    {
      id: workCircleId,
      slug: 'work-stress',
      name: 'Work Stress',
      description: 'Boundaries, burnout, and finding balance. You are more than your job title.',
      visibility: 'PUBLIC' as const,
      joinPolicy: 'OPEN' as const,
      memberCount: 3,
      members: [taylorId, priyaId, chrisId],
    },
  ];

  for (const circle of circles) {
    await prisma.circle.upsert({
      where: { id: circle.id },
      update: {
        name: circle.name,
        description: circle.description,
        memberCount: circle.memberCount,
      },
      create: {
        id: circle.id,
        slug: circle.slug,
        name: circle.name,
        description: circle.description,
        guidelines: 'Be kind. No medical advice.',
        visibility: circle.visibility,
        joinPolicy: circle.joinPolicy,
        createdByUserId: morganId,
        status: 'ACTIVE',
        memberCount: circle.memberCount,
      },
    });

    for (const userId of circle.members) {
      await prisma.circleMember.upsert({
        where: { circleId_userId: { circleId: circle.id, userId } },
        update: { status: 'ACTIVE' },
        create: {
          circleId: circle.id,
          userId,
          role: userId === morganId ? 'ADMIN' : 'MEMBER',
          status: 'ACTIVE',
          joinedAt: daysAgo(30, now),
        },
      });
    }
  }

  const post1Id = '00000000-0000-6000-8000-000000000001';
  const post2Id = '00000000-0000-6000-8000-000000000002';
  const post3Id = '00000000-0000-6000-8000-000000000003';
  const post4Id = '00000000-0000-6000-8000-000000000004';

  const posts = [
    {
      id: post1Id,
      authorUserId: jordanId,
      circleId: anxietyCircleId,
      body: 'Had a rough morning but writing it out helped. Grateful this space exists. Taking things one hour at a time today.',
      visibility: 'MEMBERS' as const,
      isAnonymous: false,
      createdAt: hoursAgo(2, now),
    },
    {
      id: post2Id,
      authorUserId: null,
      circleId: null,
      body: 'Does anyone else feel guilty for taking a mental health day? Trying to unlearn that. Would love to hear how others reframe it.',
      visibility: 'MEMBERS' as const,
      isAnonymous: true,
      createdAt: hoursAgo(4, now),
      anonUserId: demoUserId,
      anonLabel: 'Quiet River',
    },
    {
      id: post3Id,
      authorUserId: samId,
      circleId: parentsCircleId,
      body: 'Small win today: asked for help instead of pushing through alone. The village showed up.',
      visibility: 'CONNECTIONS' as const,
      isAnonymous: false,
      createdAt: daysAgo(1, now),
    },
    {
      id: post4Id,
      authorUserId: taylorId,
      circleId: workCircleId,
      body: "Reminder: you don't have to earn rest. Sharing this because I needed to hear it too.",
      visibility: 'MEMBERS' as const,
      isAnonymous: false,
      createdAt: daysAgo(1, now),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: { body: post.body, createdAt: post.createdAt },
      create: {
        id: post.id,
        authorUserId: post.authorUserId,
        circleId: post.circleId,
        body: post.body,
        visibility: post.visibility,
        isAnonymous: post.isAnonymous,
        createdAt: post.createdAt,
      },
    });

    if (post.isAnonymous && post.anonUserId) {
      await prisma.postAnonymousAuthor.upsert({
        where: { postId: post.id },
        update: { displayLabel: post.anonLabel! },
        create: {
          postId: post.id,
          userId: post.anonUserId,
          displayLabel: post.anonLabel!,
        },
      });
    }
  }

  const comment1Id = '00000000-0000-6000-8000-000000000101';
  const comment2Id = '00000000-0000-6000-8000-000000000102';

  await prisma.comment.upsert({
    where: { id: comment1Id },
    update: {},
    create: {
      id: comment1Id,
      postId: post1Id,
      authorUserId: samId,
      body: 'Proud of you for showing up today.',
      createdAt: hoursAgo(1, now),
    },
  });
  await prisma.comment.upsert({
    where: { id: comment2Id },
    update: {},
    create: {
      id: comment2Id,
      postId: post1Id,
      authorUserId: morganId,
      body: 'One hour at a time — that really resonates.',
      createdAt: hoursAgo(1, now),
    },
  });

  const reactions: { postId: string; userId: string; kind: 'SUPPORT' | 'HUG' | 'INSIGHTFUL' }[] = [
    { postId: post1Id, userId: demoUserId, kind: 'SUPPORT' },
    { postId: post1Id, userId: samId, kind: 'HUG' },
    { postId: post2Id, userId: jordanId, kind: 'INSIGHTFUL' },
    { postId: post4Id, userId: demoUserId, kind: 'SUPPORT' },
  ];

  for (const reaction of reactions) {
    await prisma.postReaction.upsert({
      where: { postId_userId: { postId: reaction.postId, userId: reaction.userId } },
      update: { kind: reaction.kind },
      create: reaction,
    });
  }

  const connections = [
    { requesterId: demoUserId, addresseeId: jordanId },
    { requesterId: demoUserId, addresseeId: samId },
    { requesterId: demoUserId, addresseeId: morganId },
    { requesterId: priyaId, addresseeId: demoUserId },
  ];

  for (const conn of connections) {
    await prisma.connection.upsert({
      where: { requesterId_addresseeId: { requesterId: conn.requesterId, addresseeId: conn.addresseeId } },
      update: { status: 'ACCEPTED', respondedAt: daysAgo(10, now) },
      create: {
        requesterId: conn.requesterId,
        addresseeId: conn.addresseeId,
        status: 'ACCEPTED',
        respondedAt: daysAgo(10, now),
      },
    });
  }

  const notifications = [
    {
      id: '00000000-0000-7000-8000-000000000001',
      titleKey: 'Jordan Lee reacted to your post',
      bodyKey: 'Your post in Anxiety Support received a new reaction.',
      eventType: 'post.reaction',
      actorUserId: jordanId,
      postId: post1Id,
      readAt: null,
      createdAt: hoursAgo(1, now),
    },
    {
      id: '00000000-0000-7000-8000-000000000002',
      titleKey: 'You were approved to join New Parents',
      bodyKey: 'You can now post and participate in the circle.',
      eventType: 'circle.membership.approved',
      circleId: parentsCircleId,
      readAt: null,
      createdAt: hoursAgo(3, now),
    },
    {
      id: '00000000-0000-7000-8000-000000000003',
      titleKey: 'Event reminder: Community Check-in',
      bodyKey: 'Your community event starts soon.',
      eventType: 'event.reminder',
      readAt: daysAgo(1, now),
      createdAt: daysAgo(1, now),
    },
  ];

  for (const n of notifications) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: {},
      create: {
        id: n.id,
        recipientUserId: demoUserId,
        eventType: n.eventType,
        titleKey: n.titleKey,
        bodyKey: n.bodyKey,
        actorUserId: n.actorUserId ?? null,
        postId: n.postId ?? null,
        circleId: n.circleId ?? null,
        readAt: n.readAt ?? null,
        createdAt: n.createdAt,
        templateParams: {},
      },
    });
  }

  const convJordanId = '00000000-0000-8000-8000-000000000001';
  const convSamId = '00000000-0000-8000-8000-000000000002';
  const convMorganId = '00000000-0000-8000-8000-000000000003';

  const conversations = [
    {
      id: convJordanId,
      otherId: jordanId,
      messageIds: [
        '00000000-0000-8001-8000-000000000001',
        '00000000-0000-8001-8000-000000000002',
        '00000000-0000-8001-8000-000000000003',
      ],
      messages: [
        { sender: jordanId, body: 'Thanks for checking in yesterday.', at: hoursAgo(2, now) },
        { sender: demoUserId, body: "Glad you're doing better today.", at: hoursAgo(1, now) },
        { sender: jordanId, body: 'That resource was helpful 🙏', at: hoursAgo(1, now) },
      ],
    },
    {
      id: convSamId,
      otherId: samId,
      messageIds: ['00000000-0000-8001-8000-000000000004'],
      messages: [{ sender: samId, body: 'That resource you shared was helpful.', at: daysAgo(1, now) }],
    },
    {
      id: convMorganId,
      otherId: morganId,
      messageIds: ['00000000-0000-8001-8000-000000000005'],
      messages: [{ sender: morganId, body: 'See you at the event!', at: daysAgo(2, now) }],
    },
  ];

  for (const conv of conversations) {
    const key = pairKey(demoUserId, conv.otherId);
    await prisma.conversation.upsert({
      where: { id: conv.id },
      update: {},
      create: { id: conv.id, pairKey: key, kind: 'DIRECT' },
    });
    for (const userId of [demoUserId, conv.otherId]) {
      await prisma.conversationParticipant.upsert({
        where: { conversationId_userId: { conversationId: conv.id, userId } },
        update: {},
        create: { conversationId: conv.id, userId },
      });
    }

    let lastMessageId: string | null = null;
    let lastMessageAt: Date | null = null;
    for (let i = 0; i < conv.messages.length; i++) {
      const msg = conv.messages[i];
      const msgId = conv.messageIds[i];
      await prisma.message.upsert({
        where: { id: msgId },
        update: { body: msg.body },
        create: {
          id: msgId,
          conversationId: conv.id,
          senderUserId: msg.sender,
          clientMessageId: msgId,
          body: msg.body,
          createdAt: msg.at,
        },
      });
      lastMessageId = msgId;
      lastMessageAt = msg.at;
    }

    if (lastMessageId && lastMessageAt) {
      await prisma.conversation.update({
        where: { id: conv.id },
        data: { lastMessageId, lastMessageAt },
      });
    }
  }

  const eventCheckinId = '00000000-0000-5000-8000-000000000005';
  const eventBreathingId = '00000000-0000-5000-8000-000000000006';
  const checkinStart = new Date(now.getTime() + 2 * DAY);
  const breathingStart = new Date(now.getTime() + 9 * DAY);

  await prisma.event.upsert({
    where: { id: eventCheckinId },
    update: {},
    create: {
      id: eventCheckinId,
      creatorUserId: adminUserId,
      slug: 'community-check-in',
      title: 'Community Check-in',
      description: 'A warm virtual space to connect, share, and support one another.',
      startsAt: checkinStart,
      endsAt: new Date(checkinStart.getTime() + 90 * 60 * 1000),
      timeZone: 'UTC',
      locationName: 'Online — Community Lounge',
      status: 'PUBLISHED',
      scheduleVersion: 1,
      scheduleVersions: {
        create: {
          scheduleVersion: 1,
          startsAt: checkinStart,
          endsAt: new Date(checkinStart.getTime() + 90 * 60 * 1000),
          timeZone: 'UTC',
        },
      },
    },
  });

  await prisma.event.upsert({
    where: { id: eventBreathingId },
    update: {},
    create: {
      id: eventBreathingId,
      creatorUserId: adminUserId,
      slug: 'mindful-breathing',
      title: 'Mindful Breathing Workshop',
      description: 'Guided breathing exercises for stress relief and grounding.',
      startsAt: breathingStart,
      endsAt: new Date(breathingStart.getTime() + 60 * 60 * 1000),
      timeZone: 'UTC',
      locationName: 'Online',
      status: 'PUBLISHED',
      scheduleVersion: 1,
      scheduleVersions: {
        create: {
          scheduleVersion: 1,
          startsAt: breathingStart,
          endsAt: new Date(breathingStart.getTime() + 60 * 60 * 1000),
          timeZone: 'UTC',
        },
      },
    },
  });

  await prisma.eventRsvp.upsert({
    where: { eventId_userId: { eventId: eventCheckinId, userId: demoUserId } },
    update: { status: 'GOING' },
    create: { eventId: eventCheckinId, userId: demoUserId, status: 'GOING' },
  });

  const resource2Id = '00000000-0000-5000-8000-000000000011';
  const resource3Id = '00000000-0000-5000-8000-000000000012';

  await prisma.resource.upsert({
    where: { id: resource2Id },
    update: {},
    create: {
      id: resource2Id,
      slug: 'understanding-anxiety',
      kind: 'VIDEO',
      access: 'MEMBER',
      title: 'Understanding Anxiety',
      summary: 'A short video on recognizing anxiety patterns and gentle coping tools.',
      bodyPlain: 'Learn to notice anxiety signals and practice grounding in daily life.',
      externalVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'PUBLISHED',
      publishedAt: now,
      createdByUserId: adminUserId,
      updatedByUserId: adminUserId,
    },
  });

  await prisma.resource.upsert({
    where: { id: resource3Id },
    update: {},
    create: {
      id: resource3Id,
      slug: 'peer-support-basics',
      kind: 'ARTICLE',
      access: 'PUBLIC_FREE',
      title: 'Peer Support Basics',
      summary: 'How to show up for others while protecting your own wellbeing.',
      bodyPlain: 'Peer support is about listening, validating, and connecting — not fixing.',
      status: 'PUBLISHED',
      publishedAt: now,
      createdByUserId: adminUserId,
      updatedByUserId: adminUserId,
    },
  });

  for (let i = 0; i < 7; i++) {
    const date = daysAgo(6 - i, now);
    const localDate = new Date(date.toISOString().slice(0, 10));
    const checkinId = `00000000-0000-8000-8000-00000000010${i}`;
    await prisma.wellnessCheckin.upsert({
      where: {
        userId_localDate: {
          userId: demoUserId,
          localDate,
        },
      },
      update: { mood: 2 + (i % 4) },
      create: {
        id: checkinId,
        userId: demoUserId,
        mood: 2 + (i % 4),
        checkedInAt: date,
        localDate,
        timeZone: 'UTC',
      },
    });
  }

  const donations = [
    { id: '00000000-0000-9000-8000-000000000001', amount: 2500, frequency: 'MONTHLY' as const, status: 'SUCCEEDED' as const },
    { id: '00000000-0000-9000-8000-000000000002', amount: 1000, frequency: 'ONE_TIME' as const, status: 'PENDING' as const },
    { id: '00000000-0000-9000-8000-000000000003', amount: 5000, frequency: 'MONTHLY' as const, status: 'SUCCEEDED' as const },
  ];

  for (const d of donations) {
    await prisma.donation.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        publicId: d.id,
        userId: demoUserId,
        donorReference: d.id,
        frequency: d.frequency,
        amountMinor: BigInt(d.amount),
        currency: 'USD',
        status: d.status,
        succeededAt: d.status === 'SUCCEEDED' ? now : null,
      },
    });
  }

  await prisma.aiModFlag.upsert({
    where: { id: '00000000-0000-a000-8000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-a000-8000-000000000001',
      postId: post2Id,
      category: 'SELF_HARM',
      confidence: 0.92,
      status: 'OPEN',
      modelVersion: 'ava-mod-v1',
      rationaleCode: 'language_pattern',
    },
  });

  await prisma.aiModFlag.upsert({
    where: { id: '00000000-0000-a000-8000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-a000-8000-000000000002',
      postId: post1Id,
      category: 'POLICY',
      confidence: 0.55,
      status: 'OPEN',
      modelVersion: 'ava-mod-v1',
      rationaleCode: 'borderline_content',
    },
  });

  console.log('Design demo data seeded: members, circles, posts, messages, events, resources.');
}
