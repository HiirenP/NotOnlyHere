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
exports.StripeWebhookService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StripeWebhookService = class StripeWebhookService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleRawBody(rawBody, signature) {
        const devMode = process.env.STRIPE_MODE === 'dev' || !process.env.STRIPE_WEBHOOK_SECRET;
        if (!devMode && signature !== process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('INVALID_SIGNATURE');
        }
        const event = JSON.parse(rawBody);
        const existing = await this.prisma.stripeEvent.findUnique({
            where: { stripeEventId: event.id },
        });
        if (existing?.processedAt) {
            return { ok: true, duplicate: true };
        }
        if (!existing) {
            await this.prisma.stripeEvent.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    stripeEventId: event.id,
                    eventType: event.type,
                    livemode: event.livemode ?? false,
                    payload: event,
                    providerCreatedAt: new Date(event.created * 1000),
                },
            });
        }
        if (event.type === 'checkout.session.completed') {
            await this.handleCheckoutCompleted(event.data.object);
        }
        await this.prisma.stripeEvent.update({
            where: { stripeEventId: event.id },
            data: { processedAt: new Date(), processingAttempts: { increment: 1 } },
        });
        return { ok: true, duplicate: false };
    }
    async handleCheckoutCompleted(session) {
        const donation = await this.prisma.donation.findUnique({
            where: { stripeCheckoutSessionId: session.id },
        });
        if (donation) {
            const paymentIntentId = session.payment_intent ?? `pi_dev_${session.id}`;
            await this.prisma.$transaction([
                this.prisma.donation.update({
                    where: { id: donation.id },
                    data: {
                        status: donation.frequency === 'MONTHLY' ? 'ACTIVE' : 'SUCCEEDED',
                        stripePaymentIntentId: paymentIntentId,
                        succeededAt: new Date(),
                    },
                }),
                this.prisma.donationPayment.upsert({
                    where: { stripePaymentIntentId: paymentIntentId },
                    update: { status: 'PAID', paidAt: new Date() },
                    create: {
                        id: (0, crypto_1.randomUUID)(),
                        donationId: donation.id,
                        stripePaymentIntentId: paymentIntentId,
                        amountMinor: donation.amountMinor,
                        currency: donation.currency,
                        status: 'PAID',
                        paidAt: new Date(),
                    },
                }),
            ]);
            return;
        }
        const purchase = await this.prisma.resourcePurchase.findUnique({
            where: { stripeCheckoutSessionId: session.id },
            include: { resource: true },
        });
        if (!purchase || !purchase.userId)
            return;
        const userId = purchase.userId;
        const paymentIntentId = session.payment_intent ?? `pi_dev_${session.id}`;
        await this.prisma.$transaction(async (tx) => {
            await tx.resourcePurchase.update({
                where: { id: purchase.id },
                data: {
                    status: 'PAID',
                    stripePaymentIntentId: paymentIntentId,
                    paidAt: new Date(),
                },
            });
            const existing = await tx.resourceEntitlement.findUnique({
                where: { resourceId_userId: { resourceId: purchase.resourceId, userId } },
            });
            if (!existing) {
                await tx.resourceEntitlement.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        resourceId: purchase.resourceId,
                        userId,
                        purchaseId: purchase.id,
                        grantedAt: new Date(),
                    },
                });
            }
        });
    }
};
exports.StripeWebhookService = StripeWebhookService;
exports.StripeWebhookService = StripeWebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StripeWebhookService);
//# sourceMappingURL=stripe-webhook.service.js.map