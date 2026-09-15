"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const admin_module_1 = require("../admin/admin.module");
const auth_module_1 = require("../auth/auth.module");
const donations_controller_1 = require("./donations.controller");
const donations_service_1 = require("./donations.service");
const purchases_service_1 = require("./purchases.service");
const stripe_checkout_service_1 = require("./stripe-checkout.service");
const stripe_webhook_controller_1 = require("./stripe-webhook.controller");
const stripe_webhook_service_1 = require("./stripe-webhook.service");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, admin_module_1.AdminModule],
        controllers: [donations_controller_1.DonationsController, donations_controller_1.AdminDonationsController, stripe_webhook_controller_1.StripeWebhookController],
        providers: [donations_service_1.DonationsService, purchases_service_1.PurchasesService, stripe_checkout_service_1.StripeCheckoutService, stripe_webhook_service_1.StripeWebhookService],
        exports: [purchases_service_1.PurchasesService, stripe_webhook_service_1.StripeWebhookService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map