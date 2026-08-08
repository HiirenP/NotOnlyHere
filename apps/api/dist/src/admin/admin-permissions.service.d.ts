import { PrismaService } from '../prisma/prisma.service';
export declare class AdminPermissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPermissions(userId: string): Promise<Set<string>>;
    hasPermission(userId: string, permission: string): Promise<boolean>;
}
