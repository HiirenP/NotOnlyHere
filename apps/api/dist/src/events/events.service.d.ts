import type { EventStatus, RsvpStatus } from '@prisma/client';
import { AdminPermissionsService } from '../admin/admin-permissions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class EventsService {
    private readonly prisma;
    private readonly permissions;
    private readonly notifications;
    constructor(prisma: PrismaService, permissions: AdminPermissionsService, notifications: NotificationsService);
    private assertCanWrite;
    createEvent(userId: string, input: {
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
    updateEvent(userId: string, eventId: string, input: {
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
    cancelEvent(userId: string, eventId: string, version: number): Promise<{
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
    deleteEvent(userId: string, eventId: string): Promise<{
        ok: boolean;
    }>;
    listEvents(userId: string, options: {
        from?: string;
        to?: string;
        q?: string;
        view?: 'month' | 'list';
        cursor?: string;
        limit?: number;
    }): Promise<{
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
    getEvent(eventId: string, userId: string): Promise<{
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
    upsertRsvp(eventId: string, userId: string, status: RsvpStatus): Promise<{
        eventId: string;
        status: import(".prisma/client").$Enums.RsvpStatus;
        updatedAt: string;
    }>;
    deleteRsvp(eventId: string, userId: string): Promise<{
        ok: boolean;
    }>;
    listAttendees(eventId: string, viewerId: string, options: {
        status?: RsvpStatus;
        cursor?: string;
        limit?: number;
    }): Promise<{
        items: {
            userId: string;
            username: string;
            displayName: string;
            status: import(".prisma/client").$Enums.RsvpStatus;
            respondedAt: string;
        }[];
        nextCursor: string | null;
    }>;
    processDueReminders(limit?: number): Promise<{
        processed: number;
        sent: number;
    }>;
    private refreshRemindersForEvent;
    private syncRemindersForUser;
    private serializeEvent;
}
