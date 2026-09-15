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
exports.DonationsService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_checkout_service_1 = require("./stripe-checkout.service");
let DonationsService = class DonationsService {
    prisma;
    stripe;
    constructor(prisma, stripe) {
        this.prisma = prisma;
        this.stripe = stripe;
    }
    async createCheckoutSession(userId, input) {
        try {
            this.stripe.assertAllowedAmount(input.amountMinor, input.currency);
        }
        catch {
            throw new common_1.BadRequestException({ code: 'INVALID_AMOUNT', message: 'Donation amount is not allowed.' });
        }
        if (input.idempotencyKey) {
            const existing = await this.prisma.donation.findFirst({
                where: { idempotencyKey: input.idempotencyKey, ...(userId ? { userId } : {}) },
            });
            if (existing) {
                return this.serializeCheckout(existing);
            }
        }
        const sessionId = this.stripe.createCheckoutSessionId();
        const donation = await this.prisma.donation.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                publicId: (0, crypto_1.randomUUID)(),
                userId,
                donorReference: (0, crypto_1.randomUUID)(),
                frequency: input.frequency,
                amountMinor: BigInt(input.amountMinor),
                currency: input.currency,
                status: 'PENDING',
                stripeCheckoutSessionId: sessionId,
                idempotencyKey: input.idempotencyKey,
                startedAt: new Date(),
            },
        });
        return this.serializeCheckout(donation);
    }
    async getStatus(publicId) {
        const donation = await this.prisma.donation.findUnique({ where: { publicId } });
        if (!donation)
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Donation not found.' });
        return {
            publicId: donation.publicId,
            status: donation.status,
            frequency: donation.frequency,
            amountMinor: Number(donation.amountMinor),
            currency: donation.currency,
            succeededAt: donation.succeededAt?.toISOString() ?? null,
        };
    }
    async listForAdmin(options) {
        const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
        let cursorDate;
        let cursorId;
        if (options.cursor) {
            const [createdAt, id] = Buffer.from(options.cursor, 'base64url').toString('utf8').split('|');
            cursorDate = new Date(createdAt);
            cursorId = id;
        }
        const rows = await this.prisma.donation.findMany({
            where: cursorDate && cursorId
                ? {
                    OR: [
                        { createdAt: { lt: cursorDate } },
                        { createdAt: cursorDate, id: { lt: cursorId } },
                    ],
                }
                : {},
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
        });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        return {
            items: page.map((row) => ({
                id: row.id,
                publicId: row.publicId,
                status: row.status,
                frequency: row.frequency,
                amountMinor: Number(row.amountMinor),
                currency: row.currency,
                createdAt: row.createdAt.toISOString(),
            })),
            nextCursor: rows.length > limit && last
                ? Buffer.from(`${last.createdAt.toISOString()}|${last.id}`).toString('base64url')
                : null,
        };
    }
    serializeCheckout(donation) {
        const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
        return {
            publicId: donation.publicId,
            checkoutSessionId: donation.stripeCheckoutSessionId,
            status: donation.status,
            checkoutUrl: `${webUrl}/app/donations/return?publicId=${donation.publicId}`,
            devMode: this.stripe.isDevMode(),
        };
    }
};
exports.DonationsService = DonationsService;
exports.DonationsService = DonationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_checkout_service_1.StripeCheckoutService])
], DonationsService);
//# sourceMappingURL=donations.service.js.map