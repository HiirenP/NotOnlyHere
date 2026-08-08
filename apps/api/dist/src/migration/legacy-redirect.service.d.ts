import { PrismaService } from '../prisma/prisma.service';
export declare class LegacyRedirectService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    normalizePath(path: string): string;
    resolve(sourcePath: string): Promise<{
        sourcePath: string;
        targetPath: string;
        statusCode: number;
    }>;
    list(): Promise<{
        items: {
            id: string;
            sourcePath: string;
            targetPath: string;
            statusCode: number;
        }[];
    }>;
    upsert(input: {
        sourcePath: string;
        targetPath: string;
        statusCode?: number;
    }): Promise<{
        id: string;
        sourcePath: string;
        targetPath: string;
        statusCode: number;
    }>;
}
