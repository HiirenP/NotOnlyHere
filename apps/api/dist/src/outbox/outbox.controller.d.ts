import { OutboxService } from './outbox.service';
export declare class OutboxController {
    private readonly outbox;
    constructor(outbox: OutboxService);
    emitNoop(): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OutboxStatus;
    }>;
}
