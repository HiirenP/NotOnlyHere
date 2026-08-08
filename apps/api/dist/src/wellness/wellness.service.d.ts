import { PrismaService } from '../prisma/prisma.service';
export declare class WellnessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateCheckinById(checkinId: string, userId: string, input: {
        mood: number;
        note?: string | null;
        timeZone: string;
        version: number;
    }): Promise<{
        id: string;
        mood: number;
        note: string | null;
        checkedInAt: string;
        localDate: string;
        timeZone: string;
        version: number;
    }>;
    upsertCheckin(userId: string, input: {
        mood: number;
        note?: string | null;
        timeZone: string;
        version?: number;
    }): Promise<{
        id: string;
        mood: number;
        note: string | null;
        checkedInAt: string;
        localDate: string;
        timeZone: string;
        version: number;
    }>;
    getCheckin(checkinId: string, userId: string): Promise<{
        id: string;
        mood: number;
        note: string | null;
        checkedInAt: string;
        localDate: string;
        timeZone: string;
        version: number;
    }>;
    deleteCheckin(checkinId: string, userId: string): Promise<{
        ok: boolean;
    }>;
    listCheckins(userId: string, options: {
        cursor?: string;
        limit?: number;
    }): Promise<{
        items: {
            id: string;
            mood: number;
            note: string | null;
            checkedInAt: string;
            localDate: string;
            timeZone: string;
            version: number;
        }[];
        nextCursor: string | null;
    }>;
    trends(userId: string, window: '7d' | '30d', timeZone: string): Promise<{
        window: "7d" | "30d";
        timeZone: string;
        points: {
            date: string;
            mood: number | null;
        }[];
        average: number | null;
        checkInCount: number;
    }>;
    private serialize;
}
