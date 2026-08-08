import type { EventStatus, RsvpStatus } from '@prisma/client';
import type { Request } from 'express';
import { EventsService } from './events.service';
export declare class EventsController {
    private readonly events;
    constructor(events: EventsService);
    list(req: Request & {
        user: {
            id: string;
        };
    }, from?: string, to?: string, q?: string, view?: 'month' | 'list', cursor?: string, limit?: string): Promise<{
        view: "list" | "month";
        from: string;
        to: string;
        items: {
            id: string;
            slug: string;
            title: string;
            description: string;
            startsAt: string;
            endsAt: string;
            timeZone: string;
            locationName: string | null;
            status: import(".prisma/client").$Enums.EventStatus;
            scheduleVersion: number;
            version: number;
            createdAt: string;
            counts: {
                going: number;
            };
            viewer: {
                rsvpStatus: import(".prisma/client").$Enums.RsvpStatus | null;
                canRsvp: boolean;
            };
        }[];
        nextCursor: string | null;
    }>;
    create(req: Request & {
        user: {
            id: string;
        };
    }, body: {
        title: string;
        description: string;
        startsAt: string;
        endsAt: string;
        timeZone: string;
        locationName?: string | null;
        status?: EventStatus;
    }): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        startsAt: string;
        endsAt: string;
        timeZone: string;
        locationName: string | null;
        status: import(".prisma/client").$Enums.EventStatus;
        scheduleVersion: number;
        version: number;
        createdAt: string;
        counts: {
            going: number;
        };
        viewer: {
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus | null;
            canRsvp: boolean;
        };
    }>;
    get(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        startsAt: string;
        endsAt: string;
        timeZone: string;
        locationName: string | null;
        status: import(".prisma/client").$Enums.EventStatus;
        scheduleVersion: number;
        version: number;
        createdAt: string;
        counts: {
            going: number;
        };
        viewer: {
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus | null;
            canRsvp: boolean;
        };
    }>;
    update(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        title?: string;
        description?: string;
        startsAt?: string;
        endsAt?: string;
        timeZone?: string;
        locationName?: string | null;
        status?: EventStatus;
        version: number;
    }): Promise<{
        id: string;
        slug: string;
        title: string;
        description: string;
        startsAt: string;
        endsAt: string;
        timeZone: string;
        locationName: string | null;
        status: import(".prisma/client").$Enums.EventStatus;
        scheduleVersion: number;
        version: number;
        createdAt: string;
        counts: {
            going: number;
        };
        viewer: {
            rsvpStatus: import(".prisma/client").$Enums.RsvpStatus | null;
            canRsvp: boolean;
        };
    }>;
    remove(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
    rsvp(req: Request & {
        user: {
            id: string;
        };
    }, id: string, body: {
        status: RsvpStatus;
    }): Promise<{
        eventId: string;
        status: import(".prisma/client").$Enums.RsvpStatus;
        updatedAt: string;
    }>;
    clearRsvp(req: Request & {
        user: {
            id: string;
        };
    }, id: string): Promise<{
        ok: boolean;
    }>;
    attendees(req: Request & {
        user: {
            id: string;
        };
    }, id: string, status?: RsvpStatus, cursor?: string, limit?: string): Promise<{
        items: {
            userId: string;
            username: string;
            displayName: string;
            status: import(".prisma/client").$Enums.RsvpStatus;
            respondedAt: string;
        }[];
        nextCursor: string | null;
    }>;
}
