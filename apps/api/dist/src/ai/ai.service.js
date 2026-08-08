"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const ai_crypto_1 = require("./ai-crypto");
const ai_provider_service_1 = require("./ai-provider.service");
const prisma_service_1 = require("../prisma/prisma.service");
const DOC_VERSION = '2026-07-30';
const DAILY_LIMIT = 50;
const ALLOWED_PREFERENCE_KEYS = new Set(['tone', 'topics']);
const STARTERS = [
    'How are you feeling today?',
    'What would help you feel more supported right now?',
    'Is there something on your mind you want to talk through?',
];
let AiService = class AiService {
    prisma;
    provider;
    constructor(prisma, provider) {
        this.prisma = prisma;
        this.provider = provider;
    }
    async getConsentStatus(userId) {
        const types = ['AI_USE', 'PERSONALIZATION', 'CIRCLE_RECOMMENDATIONS'];
        const statuses = {};
        for (const type of types) {
            statuses[type] = await this.hasConsent(userId, type);
        }
        return { documentVersion: DOC_VERSION, consents: statuses };
    }
    async updateConsent(userId, input) {
        const row = await this.prisma.aiConsent.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
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
    async getPreferences(userId) {
        await this.requireConsent(userId, 'PERSONALIZATION');
        const rows = await this.prisma.aiPreference.findMany({ where: { userId } });
        const preferences = {};
        for (const row of rows) {
            if (row.valueNonce) {
                preferences[row.preferenceKey] = (0, ai_crypto_1.decryptText)(Buffer.from(row.valueCiphertext), Buffer.from(row.valueNonce));
            }
        }
        return { preferences };
    }
    async updatePreferences(userId, preferences) {
        const consent = await this.requireConsent(userId, 'PERSONALIZATION');
        const consentRow = await this.latestConsentRow(userId, 'PERSONALIZATION');
        if (!consentRow?.granted) {
            throw new common_1.ForbiddenException({ code: 'CONSENT_REQUIRED', message: 'Personalization consent required.' });
        }
        for (const [key, value] of Object.entries(preferences)) {
            if (!ALLOWED_PREFERENCE_KEYS.has(key)) {
                throw new common_1.BadRequestException({ code: 'INVALID_PREFERENCE', message: `Preference ${key} is not allowed.` });
            }
            const encrypted = (0, ai_crypto_1.encryptText)(value);
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
                    id: (0, crypto_1.randomUUID)(),
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
    async listConversations(userId) {
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
    async createConversation(userId) {
        await this.requireConsent(userId, 'AI_USE');
        const row = await this.prisma.aiConversation.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                userId,
                promptTemplateVersion: 'phase12-v1',
            },
        });
        return { id: row.id, createdAt: row.createdAt.toISOString() };
    }
    async getConversation(conversationId, userId) {
        const row = await this.assertConversationOwner(conversationId, userId);
        return {
            id: row.id,
            lastMessageAt: row.lastMessageAt?.toISOString() ?? null,
            createdAt: row.createdAt.toISOString(),
        };
    }
    async deleteConversation(conversationId, userId) {
        await this.assertConversationOwner(conversationId, userId);
        await this.prisma.aiConversation.update({
            where: { id: conversationId },
            data: { deletedAt: new Date() },
        });
        return { ok: true };
    }
    async listMessages(conversationId, userId, options) {
        await this.assertConversationOwner(conversationId, userId);
        const limit = Math.min(Math.max(options.limit ?? 30, 1), 100);
        let cursorDate;
        let cursorId;
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
            nextCursor: rows.length > limit && last
                ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
                : null,
        };
    }
    async sendMessage(conversationId, userId, content) {
        const trimmed = content.trim();
        if (!trimmed) {
            throw new common_1.BadRequestException({ code: 'EMPTY_MESSAGE', message: 'Message cannot be empty.' });
        }
        if (trimmed.length > 4000) {
            throw new common_1.BadRequestException({ code: 'MESSAGE_TOO_LONG', message: 'Message is too long.' });
        }
        const consentRow = await this.requireConsentRow(userId, 'AI_USE');
        const conversation = await this.assertConversationOwner(conversationId, userId);
        await this.consumeQuota(userId);
        const history = await this.prisma.aiMessage.findMany({
            where: { conversationId },
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            take: 20,
        });
        const userEncrypted = (0, ai_crypto_1.encryptText)(trimmed);
        const userMessage = await this.prisma.aiMessage.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
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
                        ? (0, ai_crypto_1.decryptText)(Buffer.from(row.contentCiphertext), Buffer.from(row.contentNonce))
                        : '',
                })),
            });
        }
        catch {
            throw new common_1.HttpException({
                code: 'AI_UNAVAILABLE',
                message: 'Ava is temporarily unavailable. Please try again or use the crisis resources on this page.',
            }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        const assistantEncrypted = (0, ai_crypto_1.encryptText)(reply.content);
        const assistantMessage = await this.prisma.aiMessage.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
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
    async getQuota(userId) {
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
    async getCircleRecommendations(userId) {
        const allowed = await this.hasConsent(userId, 'CIRCLE_RECOMMENDATIONS');
        if (!allowed) {
            throw new common_1.ForbiddenException({
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
    async consumeQuota(userId) {
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
            throw new common_1.HttpException({
                code: 'AI_QUOTA_EXCEEDED',
                message: 'Daily Ava message limit reached.',
                resetsAt: resetAt.toISOString(),
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    utcDate() {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }
    async hasConsent(userId, type) {
        const row = await this.latestConsentRow(userId, type);
        return Boolean(row?.granted);
    }
    async latestConsentRow(userId, type) {
        return this.prisma.aiConsent.findFirst({
            where: { userId, consentType: type },
            orderBy: [{ recordedAt: 'desc' }, { id: 'desc' }],
        });
    }
    async requireConsent(userId, type) {
        const allowed = await this.hasConsent(userId, type);
        if (!allowed) {
            throw new common_1.ForbiddenException({ code: 'CONSENT_REQUIRED', message: `${type} consent is required.` });
        }
        return allowed;
    }
    async requireConsentRow(userId, type) {
        const row = await this.latestConsentRow(userId, type);
        if (!row?.granted) {
            throw new common_1.ForbiddenException({ code: 'CONSENT_REQUIRED', message: `${type} consent is required.` });
        }
        return row;
    }
    async assertConversationOwner(conversationId, userId) {
        const row = await this.prisma.aiConversation.findUnique({ where: { id: conversationId } });
        if (!row || row.deletedAt || row.userId !== userId) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Conversation not found.' });
        }
        return row;
    }
    serializeMessage(row) {
        const content = row.contentNonce !== null
            ? (0, ai_crypto_1.decryptText)(Buffer.from(row.contentCiphertext), Buffer.from(row.contentNonce))
            : '';
        return {
            id: row.id,
            role: row.role,
            content,
            createdAt: row.createdAt.toISOString(),
        };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_provider_service_1.AiProviderService])
], AiService);
//# sourceMappingURL=ai.service.js.map