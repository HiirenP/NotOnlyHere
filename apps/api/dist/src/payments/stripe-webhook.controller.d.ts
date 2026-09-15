import type { Request } from 'express';
import { StripeWebhookService } from './stripe-webhook.service';
export declare class StripeWebhookController {
    private readonly webhooks;
    constructor(webhooks: StripeWebhookService);
    webhook(req: Request & {
        body: unknown;
    }, signature?: string): Promise<{
        ok: boolean;
        duplicate: boolean;
    }>;
}
