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
exports.PurchasesService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_checkout_service_1 = require("./stripe-checkout.service");
let PurchasesService = class PurchasesService {
    prisma;
    stripe;
    constructor(prisma, stripe) {
        this.prisma = prisma;
        this.stripe = stripe;
    }
    async createPurchaseSession(userId, resourceId, idempotencyKey) {
        const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } });
        if (!resource || resource.status !== 'PUBLISHED' || resource.access !== 'PAID_ONCE') {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Paid resource not found.' });
        }
        if (!resource.priceMinor || !resource.currency) {
            throw new common_1.BadRequestException({ code: 'INVALID_PRICE', message: 'Resource price is not configured.' });
        }
        const entitled = await this.prisma.resourceEntitlement.findFirst({
            where: { resourceId, userId, revokedAt: null },
        });
        if (entitled) {
            throw new common_1.ConflictException({ code: 'ALREADY_OWNED', message: 'You already own this resource.' });
        }
        if (idempotencyKey) {
            const existing = await this.prisma.resourcePurchase.findFirst({
                where: { userId, stripeCheckoutSessionId: { startsWith: 'cs_' }, status: 'PENDING' },
                orderBy: { createdAt: 'desc' },
            });
            if (existing && existing.resourceId === resourceId) {
                return this.serializeCheckout(existing, resource.slug);
            }
        }
        const sessionId = this.stripe.createCheckoutSessionId();
        const purchase = await this.prisma.resourcePurchase.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                resourceId,
                userId,
                purchaserReference: (0, crypto_1.randomUUID)(),
                amountMinor: resource.priceMinor,
                currency: resource.currency,
                status: 'PENDING',
                stripeCheckoutSessionId: sessionId,
                priceSnapshot: {
                    title: resource.title,
                    amountMinor: Number(resource.priceMinor),
                    currency: resource.currency,
                },
            },
        });
        return this.serializeCheckout(purchase, resource.slug);
    }
    serializeCheckout(purchase, slug) {
        const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
        return {
            purchaseId: purchase.id,
            checkoutSessionId: purchase.stripeCheckoutSessionId,
            status: purchase.status,
            checkoutUrl: `${webUrl}/app/resources/${slug}?purchase=pending`,
            devMode: this.stripe.isDevMode(),
        };
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_checkout_service_1.StripeCheckoutService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map