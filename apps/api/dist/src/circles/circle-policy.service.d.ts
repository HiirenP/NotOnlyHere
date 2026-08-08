import type { CircleJoinPolicy, CircleVisibility, MembershipStatus } from '@prisma/client';
type Membership = {
    status: MembershipStatus;
    role: string;
} | null;
export declare class CirclePolicyService {
    isActiveMember(membership: Membership): boolean;
    canDiscoverInDirectory(circle: {
        visibility: CircleVisibility;
        status: string;
    }, membership: Membership): boolean;
    canViewDetail(circle: {
        visibility: CircleVisibility;
        status: string;
    }, membership: Membership): boolean;
    canViewMemberList(membership: Membership): boolean;
    canJoin(circle: {
        joinPolicy: CircleJoinPolicy;
        status: string;
    }, membership: Membership): boolean;
    canLeave(membership: Membership): boolean;
}
export {};
