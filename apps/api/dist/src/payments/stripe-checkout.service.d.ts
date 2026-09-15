export declare class StripeCheckoutService {
    isDevMode(): boolean;
    assertAllowedAmount(amountMinor: number, currency: string): void;
    createCheckoutSessionId(): string;
    createPaymentIntentId(): string;
}
