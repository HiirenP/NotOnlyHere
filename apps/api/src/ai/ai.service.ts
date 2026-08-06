import { randomUUID } from 'crypto';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AiConsentType, Prisma } from '@prisma/client';
import { decryptText, encryptText } from './ai-crypto';
import { AiProviderService } from './ai-provider.service';
import { PrismaService } from '../prisma/prisma.service';

const DOC_VERSION = '2026-07-30';
const DAILY_LIMIT = 50;
const ALLOWED_PREFERENCE_KEYS = new Set(['tone', 'topics']);

const STARTERS = [
  'How are you feeling today?',
  'What would help you feel more supported right now?',
  'Is there something on your mind you want to talk through?',
];

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly provider: AiProviderService,
  ) {}

  async getConsentStatus(userId: string) {
    const types: AiConsentType[] = ['AI_USE', 'PERSONALIZATION', 'CIRCLE_RECOMMENDATIONS'];
    const statuses: Record<string, boolean> = {};
    for (const type of types) {
      statuses[type] = await this.hasConsent(userId, type);
    }
    return { documentVersion: DOC_VERSION, consents: statuses };
  }

  async updateConsent(
    userId: string,
    input: { consentType: AiConsentType; granted: boolean; source?: string },
  ) {
    const row = await this.prisma.aiConsent.create({
      data: {
        id: randomUUID(),
        userId,
        consentType: input.consentType,
        documentVersion: DOC_VERSION,
        granted: input.granted,
        recordedAt: new Date(),
        source: input.source ?? 'member_app',
      },
    });

    if (input.consentType === 'PERSONALIZATION' && !input.granted) {
      await this.prisma.aiPreference.deleteMany({ where: { userId } });
    }

    return { consentType: row.consentType, granted: row.granted, recordedAt: row.recordedAt.toISOString() };
  }

  async getPreferences(userId: string) {
    await this.requireConsent(userId, 'PERSONALIZATION');
    const rows = await this.prisma.aiPreference.findMany({ where: { userId } });
    const preferences: Record<string, string> = {};
    for (const row of rows) {
      if (row.valueNonce) {
        preferences[row.preferenceKey] = decryptText(Buffer.from(row.valueCiphertext), Buffer.from(row.valueNonce));
      }
    }
    return { preferences };
  }

  async updatePreferences(userId: string, preferences: Record<string, string>) {
    const consent = await this.requireConsent(userId, 'PERSONALIZATION');
    const consentRow = await this.latestConsentRow(userId, 'PERSONALIZATION');
    if (!consentRow?.granted) {
      throw new ForbiddenException({ code: 'CONSENT_REQUIRED', message: 'Personalization consent required.' });
    }

    for (const [key, value] of Object.entries(preferences)) {
      if (!ALLOWED_PREFERENCE_KEYS.has(key)) {
        throw new BadRequestException({ code: 'INVALID_PREFERENCE', message: `Preference ${key} is not allowed.` });
      }
      const encrypted = encryptText(value);
      await this.prisma.aiPreference.upsert({
        where: { userId_preferenceKey: { userId, preferenceKey: key } },
        update: {
          valueCiphertext: encrypted.ciphertext,
          valueKeyVersion: encrypted.keyVersion,
          valueNonce: encrypted.nonce,
          consentId: consentRow.id,
          version: { increment: 1 },
        },
        create: {
          id: randomUUID(),
          userId,
          preferenceKey: key,
          valueCiphertext: encrypted.ciphertext,
          valueKeyVersion: encrypted.keyVersion,
          valueNonce: encrypted.nonce,
          consentId: consentRow.id,
        },
      });
    }

    return this.getPreferences(userId);
  }

  async listConversations(userId: string) {
    const rows = await this.prisma.aiConversation.findMany({
      where: { userId, deletedAt: null },
      orderBy: { lastMessageAt: 'desc' },
      take: 50,
    });
    return {
      items: rows.map((row) => ({
        id: row.id,
        lastMessageAt: row.lastMessageAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  }

  async createConversation(userId: string) {
    await this.requireConsent(userId, 'AI_USE');
    const row = await this.prisma.aiConversation.create({
      data: {
        id: randomUUID(),
        userId,
        promptTemplateVersion: 'phase12-v1',
      },
    });
    return { id: row.id, createdAt: row.createdAt.toISOString() };
  }

  async getConversation(conversationId: string, userId: string) {
    const row = await this.assertConversationOwner(conversationId, userId);
    return {
      id: row.id,
      lastMessageAt: row.lastMessageAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async deleteConversation(conversationId: string, userId: string) {
    await this.assertConversationOwner(conversationId, userId);
    await this.prisma.aiConversation.update({
      where: { id: conversationId },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  }

  async listMessages(conversationId: string, userId: string, options: { cursor?: string; limit?: number }) {
    await this.assertConversationOwner(conversationId, userId);
    const limit = Math.min(Math.max(options.limit ?? 30, 1), 100);
    let cursorDate: Date | undefined;
    let cursorId: string | undefined;
    if (options.cursor) {
      const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
      cursorDate = new Date(createdAt);
      cursorId = id;
    }

    const rows = await this.prisma.aiMessage.findMany({
      where: {
        conversationId,
        ...(cursorDate && cursorId
          ? {
              OR: [
                { createdAt: { lt: cursorDate } },
                { createdAt: cursorDate, id: { lt: cursorId } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const page = rows.slice(0, limit).reverse();
    const last = rows[limit];
    return {
      items: page.map((row) => this.serializeMessage(row)),
      nextCursor:
        rows.length > limit && last
          ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
          : null,
    };
  }

  async sendMessage(conversationId: string, userId: string, content: string) {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new BadRequestException({ code: 'EMPTY_MESSAGE', message: 'Message cannot be empty.' });
    }
    if (trimmed.length > 4000) {
      throw new BadRequestException({ code: 'MESSAGE_TOO_LONG', message: 'Message is too long.' });
    }

    const consentRow = await this.requireConsentRow(userId, 'AI_USE');
    const conversation = await this.assertConversationOwner(conversationId, userId);

    await this.consumeQuota(userId);

    const history = await this.prisma.aiMessage.findMany({
      where: { conversationId },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: 20,
    });

    const userEncrypted = encryptText(trimmed);
    const userMessage = await this.prisma.aiMessage.create({
      data: {
        id: randomUUID(),
        conversationId,
        role: 'USER',
        contentCiphertext: userEncrypted.ciphertext,
        contentKeyVersion: userEncrypted.keyVersion,
        contentNonce: userEncrypted.nonce,
        consentId: consentRow.id,
      },
    });

    let reply;
    try {
      reply = await this.provider.generateReply({
        userMessage: trimmed,
        conversationHistory: history.map((row) => ({
          role: row.role,
          content: row.contentNonce
            ? decryptText(Buffer.from(row.contentCiphertext), Buffer.from(row.contentNonce))
            : '',
        })),
      });
    } catch {
      throw new HttpException(
        {
          code: 'AI_UNAVAILABLE',
          message: 'Ava is temporarily unavailable. Please try again or use the crisis resources on this page.',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const assistantEncrypted = encryptText(reply.content);
    const assistantMessage = await this.prisma.aiMessage.create({
      data: {
        id: randomUUID(),
        conversationId,
        role: 'ASSISTANT',
        contentCiphertext: assistantEncrypted.ciphertext,
        contentKeyVersion: assistantEncrypted.keyVersion,
        contentNonce: assistantEncrypted.nonce,
        provider: reply.provider,
        model: reply.model,
        providerRequestId: reply.providerRequestId,
        inputTokens: reply.inputTokens,
        outputTokens: reply.outputTokens,
        latencyMs: reply.latencyMs,
        consentId: consentRow.id,
      },
    });

    await this.prisma.aiConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return {
      userMessage: this.serializeMessage(userMessage),
      assistantMessage: this.serializeMessage(assistantMessage),
    };
  }

  async getQuota(userId: string) {
    const usageDate = this.utcDate();
    const row = await this.prisma.aiUsageDaily.findUnique({
      where: { userId_usageDate: { userId, usageDate } },
    });
    const used = row?.acceptedMessageCount ?? 0;
    const resetAt = new Date(usageDate);
    resetAt.setUTCDate(resetAt.getUTCDate() + 1);
    return { limit: DAILY_LIMIT, used, remaining: Math.max(DAILY_LIMIT - used, 0), resetsAt: resetAt.toISOString() };
  }

  getStarters() {
    return { items: STARTERS };
  }

  async getCircleRecommendations(userId: string) {
    const allowed = await this.hasConsent(userId, 'CIRCLE_RECOMMENDATIONS');
    if (!allowed) {
      throw new ForbiddenException({
        code: 'CONSENT_REQUIRED',
        message: 'Circle recommendations require opt-in consent.',
      });
    }

    const memberships = await this.prisma.circleMember.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { circleId: true },
    });
    const memberIds = new Set(memberships.map((row) => row.circleId));

    const circles = await this.prisma.circle.findMany({
      where: {
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        joinPolicy: { in: ['OPEN', 'APPROVAL'] },
        id: { notIn: [...memberIds] },
      },
      orderBy: { memberCount: 'desc' },
      take: 5,
    });

    return {
      items: circles.map((circle) => ({
        id: circle.id,
        slug: circle.slug,
        name: circle.name,
        description: circle.description,
        memberCount: circle.memberCount,
        reason: 'Based on your profile and public circles you have not joined yet.',
      })),
    };
  }

  private async consumeQuota(userId: string) {
    const usageDate = this.utcDate();
    const updated = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.aiUsageDaily.findUnique({
        where: { userId_usageDate: { userId, usageDate } },
      });
      if (existing && existing.acceptedMessageCount >= DAILY_LIMIT) {
        return null;
      }
      return tx.aiUsageDaily.upsert({
        where: { userId_usageDate: { userId, usageDate } },
        update: { acceptedMessageCount: { increment: 1 } },
        create: { userId, usageDate, acceptedMessageCount: 1 },
      });
    });

    if (!updated || updated.acceptedMessageCount > DAILY_LIMIT) {
      const resetAt = new Date(usageDate);
      resetAt.setUTCDate(resetAt.getUTCDate() + 1);
      throw new HttpException(
        {
          code: 'AI_QUOTA_EXCEEDED',
          message: 'Daily Ava message limit reached.',
          resetsAt: resetAt.toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private utcDate() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }

  private async hasConsent(userId: string, type: AiConsentType) {
    const row = await this.latestConsentRow(userId, type);
    return Boolean(row?.granted);
  }

  private async latestConsentRow(userId: string, type: AiConsentType) {
    return this.prisma.aiConsent.findFirst({
      where: { userId, consentType: type },
      orderBy: [{ recordedAt: 'desc' }, { id: 'desc' }],
    });
  }

  private async requireConsent(userId: string, type: AiConsentType) {
    const allowed = await this.hasConsent(userId, type);
    if (!allowed) {
      throw new ForbiddenException({ code: 'CONSENT_REQUIRED', message: `${type} consent is required.` });
    }
    return allowed;
  }

  private async requireConsentRow(userId: string, type: AiConsentType) {
    const row = await this.latestConsentRow(userId, type);
    if (!row?.granted) {
      throw new ForbiddenException({ code: 'CONSENT_REQUIRED', message: `${type} consent is required.` });
    }
    return row;
  }

  private async assertConversationOwner(conversationId: string, userId: string) {
    const row = await this.prisma.aiConversation.findUnique({ where: { id: conversationId } });
    if (!row || row.deletedAt || row.userId !== userId) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Conversation not found.' });
    }
    return row;
  }

  private serializeMessage(row: {
    id: string;
    role: 'USER' | 'ASSISTANT';
    contentCiphertext: Uint8Array | Buffer;
    contentNonce: Uint8Array | Buffer | null;
    createdAt: Date;
  }) {
    const content =
      row.contentNonce !== null
        ? decryptText(Buffer.from(row.contentCiphertext), Buffer.from(row.contentNonce))
        : '';
    return {
      id: row.id,
      role: row.role,
      content,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
