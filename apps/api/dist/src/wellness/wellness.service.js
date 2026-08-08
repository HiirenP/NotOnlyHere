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
exports.WellnessService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const crypto_2 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const NOTE_KEY_VERSION = 'dev-v1';
const NOTE_MAX = 2000;
function noteKey() {
    const secret = process.env.WELLNESS_NOTE_KEY ?? 'phase10-dev-wellness-key-32bytes!!';
    return (0, crypto_1.createHash)('sha256').update(secret).digest();
}
function encryptNote(plaintext) {
    const nonce = (0, crypto_1.randomBytes)(12);
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', noteKey(), nonce);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        noteCiphertext: Buffer.concat([encrypted, tag]),
        noteNonce: nonce,
        noteKeyVersion: NOTE_KEY_VERSION,
    };
}
function decryptNote(ciphertext, nonce) {
    const tag = ciphertext.subarray(ciphertext.length - 16);
    const data = ciphertext.subarray(0, ciphertext.length - 16);
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', noteKey(), nonce);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
function localDateForTimeZone(timeZone, at = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(at);
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
}
let WellnessService = class WellnessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateCheckinById(checkinId, userId, input) {
        const existing = await this.prisma.wellnessCheckin.findUnique({ where: { id: checkinId } });
        if (!existing)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Check-in not found.' });
        if (existing.userId !== userId)
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Not your check-in.' });
        if (existing.version !== input.version) {
            throw new common_1.BadRequestException({ code: 'VERSION_CONFLICT', message: 'Check-in was updated elsewhere.' });
        }
        return this.upsertCheckin(userId, { ...input, version: input.version });
    }
    async upsertCheckin(userId, input) {
        if (!Number.isInteger(input.mood) || input.mood < 1 || input.mood > 5) {
            throw new common_1.BadRequestException({ code: 'INVALID_MOOD', message: 'Mood must be between 1 and 5.' });
        }
        const timeZone = input.timeZone?.trim() || 'UTC';
        try {
            Intl.DateTimeFormat(undefined, { timeZone });
        }
        catch {
            throw new common_1.BadRequestException({ code: 'INVALID_TIMEZONE', message: 'Invalid timezone.' });
        }
        const note = input.note?.trim() ?? null;
        if (note && note.length > NOTE_MAX) {
            throw new common_1.BadRequestException({ code: 'NOTE_TOO_LONG', message: 'Note is too long.' });
        }
        const localDate = localDateForTimeZone(timeZone);
        const existing = await this.prisma.wellnessCheckin.findUnique({
            where: { userId_localDate: { userId, localDate } },
        });
        if (existing && input.version !== undefined && input.version !== existing.version) {
            throw new common_1.BadRequestException({ code: 'VERSION_CONFLICT', message: 'Check-in was updated elsewhere.' });
        }
        const encrypted = note ? encryptNote(note) : null;
        const row = await this.prisma.wellnessCheckin.upsert({
            where: { userId_localDate: { userId, localDate } },
            update: {
                mood: input.mood,
                noteCiphertext: encrypted?.noteCiphertext ?? null,
                noteKeyVersion: encrypted?.noteKeyVersion ?? null,
                noteNonce: encrypted?.noteNonce ?? null,
                checkedInAt: new Date(),
                timeZone,
                version: { increment: 1 },
            },
            create: {
                id: (0, crypto_2.randomUUID)(),
                userId,
                mood: input.mood,
                noteCiphertext: encrypted?.noteCiphertext ?? null,
                noteKeyVersion: encrypted?.noteKeyVersion ?? null,
                noteNonce: encrypted?.noteNonce ?? null,
                localDate,
                timeZone,
            },
        });
        return this.serialize(row, userId, note);
    }
    async getCheckin(checkinId, userId) {
        const row = await this.prisma.wellnessCheckin.findUnique({ where: { id: checkinId } });
        if (!row)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Check-in not found.' });
        if (row.userId !== userId)
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Not your check-in.' });
        return this.serialize(row, userId);
    }
    async deleteCheckin(checkinId, userId) {
        const row = await this.prisma.wellnessCheckin.findUnique({ where: { id: checkinId } });
        if (!row)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Check-in not found.' });
        if (row.userId !== userId)
            throw new common_1.ForbiddenException({ code: 'FORBIDDEN', message: 'Not your check-in.' });
        await this.prisma.wellnessCheckin.delete({ where: { id: checkinId } });
        return { ok: true };
    }
    async listCheckins(userId, options) {
        const limit = Math.min(Math.max(options.limit ?? 30, 1), 100);
        let cursorDate;
        if (options.cursor) {
            cursorDate = new Date(Buffer.from(options.cursor, 'base64url').toString('utf8'));
        }
        const rows = await this.prisma.wellnessCheckin.findMany({
            where: {
                userId,
                ...(cursorDate ? { checkedInAt: { lt: cursorDate } } : {}),
            },
            orderBy: { checkedInAt: 'desc' },
            take: limit + 1,
        });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        return {
            items: page.map((row) => this.serialize(row, userId)),
            nextCursor: rows.length > limit && last
                ? Buffer.from(last.checkedInAt.toISOString()).toString('base64url')
                : null,
        };
    }
    async trends(userId, window, timeZone) {
        const days = window === '30d' ? 30 : 7;
        const end = localDateForTimeZone(timeZone);
        const start = new Date(end);
        start.setUTCDate(start.getUTCDate() - (days - 1));
        const rows = await this.prisma.wellnessCheckin.findMany({
            where: { userId, localDate: { gte: start, lte: end } },
            orderBy: { localDate: 'asc' },
        });
        const byDate = new Map(rows.map((row) => [row.localDate.toISOString().slice(0, 10), row.mood]));
        const points = [];
        for (let i = 0; i < days; i += 1) {
            const date = new Date(start);
            date.setUTCDate(start.getUTCDate() + i);
            const key = date.toISOString().slice(0, 10);
            points.push({ date: key, mood: byDate.get(key) ?? null });
        }
        const values = points.map((p) => p.mood).filter((m) => m !== null);
        const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
        return { window, timeZone, points, average, checkInCount: values.length };
    }
    serialize(row, viewerId, noteOverride) {
        let note = noteOverride ?? null;
        if (noteOverride === undefined && row.noteCiphertext && row.noteNonce && row.userId === viewerId) {
            note = decryptNote(Buffer.from(row.noteCiphertext), Buffer.from(row.noteNonce));
        }
        return {
            id: row.id,
            mood: row.mood,
            note,
            checkedInAt: row.checkedInAt.toISOString(),
            localDate: row.localDate.toISOString().slice(0, 10),
            timeZone: row.timeZone,
            version: row.version,
        };
    }
};
exports.WellnessService = WellnessService;
exports.WellnessService = WellnessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WellnessService);
//# sourceMappingURL=wellness.service.js.map