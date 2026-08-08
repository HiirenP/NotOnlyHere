import type { HealthResponse } from '@notonlyhere/contracts';
import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    live(): HealthResponse;
    startup(): HealthResponse;
    ready(): Promise<HealthResponse>;
}
