import type { CircleJoinPolicy, CircleVisibility } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { OutboxService } from '../outbox/outbox.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class CircleAdminService {
    private readonly prisma;
    private readonly outbox;
    private readonly audit;
    constructor(prisma: PrismaService, outbox: OutboxService, audit: AuditService);
    assertCircleAdmin(circleId: string, userId: string): Promise<{
        userId: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MembershipStatus;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.CircleRole;
        circleId: string;
        requestedAt: Date | null;
        joinedAt: Date | null;
        decidedAt: Date | null;
        leftAt: Date | null;
        invitedByUserId: string | null;
        decidedByUserId: string | null;
    }>;
    createCircle(userId: string, input: {
        name: string;
        description: string;
        guidelines: string;
        visibility: CircleVisibility;
        joinPolicy: CircleJoinPolicy;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.CircleStatus;
        version: number;
        updatedAt: Date;
        avatarMediaId: string | null;
        visibility: import(".prisma/client").$Enums.CircleVisibility;
        description: string;
        createdByUserId: string | null;
        slug: string;
        guidelines: string;
        joinPolicy: import(".prisma/client").$Enums.CircleJoinPolicy;
        adminFeatured: boolean;
        memberCount: number;
    }>;
    updateCircle(circleId: string, adminId: string, input: {
        name?: string;
        description?: string;
        guidelines?: string;
        visibility?: CircleVisibility;
        joinPolicy?: CircleJoinPolicy;
        version: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.CircleStatus;
        version: number;
        updatedAt: Date;
        avatarMediaId: string | null;
        visibility: import(".prisma/client").$Enums.CircleVisibility;
        description: string;
        createdByUserId: string | null;
        slug: string;
        guidelines: string;
        joinPolicy: import(".prisma/client").$Enums.CircleJoinPolicy;
        adminFeatured: boolean;
        memberCount: number;
    }>;
    archiveCircle(circleId: string, adminId: string): Promise<{
        ok: boolean;
    }>;
    listPendingRequests(circleId: string, adminId: string): Promise<{
        userId: string;
        username: string;
        displayName: string;
        requestedAt: string | null;
    }[]>;
    approveRequest(circleId: string, adminId: string, userId: string): Promise<{
        ok: boolean;
        status: string;
    }>;
    declineRequest(circleId: string, adminId: string, userId: string): Promise<{
        ok: boolean;
        status: string;
    }>;
    removeMember(circleId: string, adminId: string, userId: string): Promise<{
        ok: boolean;
    }>;
    muteMember(circleId: string, adminId: string, userId: string, reason?: string): Promise<{
        ok: boolean;
    }>;
    unmuteMember(circleId: string, adminId: string, userId: string): Promise<{
        ok: boolean;
    }>;
    removeCirclePost(circleId: string, adminId: string, postId: string, reason: string): Promise<{
        ok: boolean;
        deletedAt: string;
    }>;
}
