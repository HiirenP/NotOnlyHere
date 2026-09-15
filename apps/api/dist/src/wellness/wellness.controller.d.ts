import type { Request } from 'express';
import { WellnessService } from './wellness.service';
export declare class WellnessController {
    private readonly wellness;
    constructor(wellness: WellnessService);
    list(req: Request & {
        user: {
            id: string;
        };
    }, cursor?: string, limit?: string): Promise<{
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
    upsert(req: Request & {
        user: {
            id: string;
        };
    }, body: {
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
    get(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        mood: number;
        note: string | null;
        checkedInAt: string;
        localDate: string;
        timeZone: string;
        version: number;
    }>;
    update(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
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
    remove(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
    trends(req: Request & {
        user: {
            id: string;
        };
    }, window?: '7d' | '30d', timeZone?: string): Promise<{
        window: "7d" | "30d";
        timeZone: string;
        points: {
            date: string;
            mood: number | null;
        }[];
        average: number | null;
        checkInCount: number;
    }>;
}
