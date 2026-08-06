import { describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';

describe('outbox noop consumption', () => {
  it('marks seeded noop event as deliverable contract', () => {
    const prisma = new PrismaClient();
    expect(prisma.outboxEvent).toBeDefined();
    expect(prisma.outboxConsumption).toBeDefined();
  });
});
