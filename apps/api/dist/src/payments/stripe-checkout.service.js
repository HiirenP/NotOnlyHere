"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeCheckoutService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const ALLOWED_AMOUNTS = new Set([500, 1000, 2500, 5000]);
let StripeCheckoutService = class StripeCheckoutService {
    isDevMode() {
        return process.env.STRIPE_MODE === 'dev' || !process.env.STRIPE_SECRET_KEY;
    }
    assertAllowedAmount(amountMinor, currency) {
        if (currency !== 'USD' || !ALLOWED_AMOUNTS.has(amountMinor)) {
            throw new Error('INVALID_AMOUNT');
        }
    }
    createCheckoutSessionId() {
        return `cs_dev_${(0, crypto_1.randomUUID)()}`;
    }
    createPaymentIntentId() {
        return `pi_dev_${(0, crypto_1.randomUUID)()}`;
    }
};
exports.StripeCheckoutService = StripeCheckoutService;
exports.StripeCheckoutService = StripeCheckoutService = __decorate([
    (0, common_1.Injectable)()
], StripeCheckoutService);
//# sourceMappingURL=stripe-checkout.service.js.map