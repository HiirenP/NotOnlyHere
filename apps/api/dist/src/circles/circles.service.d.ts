import type { MembershipStatus } from '@prisma/client';
import { CirclePolicyService } from './circle-policy.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class CirclesService {
    private readonly prisma;
    private readonly policy;
    constructor(prisma: PrismaService, policy: CirclePolicyService);
    listCircles(viewerId: string, options: {
        q?: string;
        cursor?: string;
        limit?: number;
    }): Promise<{
        query: string;
        items: {
            id: string;
            slug: string;
            name: string;
            description: string;
            visibility: string;
            joinPolicy: string;
            memberCount: number;
            createdAt: string;
            viewer: {
                membershipStatus: import(".prisma/client").$Enums.MembershipStatus | null;
                role: string | null;
                isMember: boolean;
                canJoin: boolean;
            };
        }[];
        nextCursor: string | null;
    }>;
    getCircle(circleId: string, viewerId: string): Promise<{
        id: string;
        slug: string;
        name: string;
        description: string;
        guidelines: string | null;
        visibility: string;
        joinPolicy: string;
        memberCount: number;
        version: number;
        createdAt: string;
        viewer: {
            membershipStatus: import(".prisma/client").$Enums.MembershipStatus | null;
            role: string | null;
            isMember: boolean;
            isAdmin: boolean;
            canJoin: boolean;
            canLeave: boolean;
            canViewMembers: boolean;
            canManage: boolean;
        };
    }>;
    listMembers(circleId: string, viewerId: string, options: {
        cursor?: string;
        limit?: number;
    }): Promise<{
        items: {
            userId: string;
            username: string;
            displayName: string;
            role: import(".prisma/client").$Enums.CircleRole;
            joinedAt: string | null;
        }[];
        nextCursor: string | null;
    }>;
    private loadMembershipMap;
    serializeSummary(circle: {
        id: string;
        slug: string;
        name: string;
        description: string;
        visibility: string;
        joinPolicy: string;
        memberCount: number;
        createdAt: Date;
    }, membership: {
        status: MembershipStatus;
        role: string;
    } | null): {
        id: string;
        slug: string;
        name: string;
        description: string;
        visibility: string;
        joinPolicy: string;
        memberCount: number;
        createdAt: string;
        viewer: {
            membershipStatus: import(".prisma/client").$Enums.MembershipStatus | null;
            role: string | null;
            isMember: boolean;
            canJoin: boolean;
        };
    };
    serializeDetail(circle: {
        id: string;
        slug: string;
        name: string;
        description: string;
        guidelines: string;
        visibility: string;
        joinPolicy: string;
        memberCount: number;
        version: number;
        createdAt: Date;
    }, membership: {
        status: MembershipStatus;
        role: string;
    } | null, isMember: boolean): {
        id: string;
        slug: string;
        name: string;
        description: string;
        guidelines: string | null;
        visibility: string;
        joinPolicy: string;
        memberCount: number;
        version: number;
        createdAt: string;
        viewer: {
            membershipStatus: import(".prisma/client").$Enums.MembershipStatus | null;
            role: string | null;
            isMember: boolean;
            isAdmin: boolean;
            canJoin: boolean;
            canLeave: boolean;
            canViewMembers: boolean;
            canManage: boolean;
        };
    };
}
