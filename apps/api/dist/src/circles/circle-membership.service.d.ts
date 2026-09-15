import { OutboxService } from '../outbox/outbox.service';
import { CirclePolicyService } from './circle-policy.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class CircleMembershipService {
    private readonly prisma;
    private readonly policy;
    private readonly outbox;
    constructor(prisma: PrismaService, policy: CirclePolicyService, outbox: OutboxService);
    join(circleId: string, userId: string): Promise<{
        status: "ACTIVE";
        message: string;
    } | {
        status: "PENDING";
        message: string;
    }>;
    leave(circleId: string, userId: string): Promise<{
        ok: boolean;
        leftAt: string;
    }>;
}
