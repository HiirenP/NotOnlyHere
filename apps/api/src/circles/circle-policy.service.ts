import { Injectable } from '@nestjs/common';
import type { CircleJoinPolicy, CircleVisibility, MembershipStatus } from '@prisma/client';

type Membership = {
  status: MembershipStatus;
  role: string;
} | null;

@Injectable()
export class CirclePolicyService {
  isActiveMember(membership: Membership) {
    return membership?.status === 'ACTIVE';
  }

  canDiscoverInDirectory(
    circle: { visibility: CircleVisibility; status: string },
    membership: Membership,
  ) {
    if (circle.status !== 'ACTIVE') return false;
    if (circle.visibility === 'HIDDEN') return this.isActiveMember(membership);
    return true;
  }

  canViewDetail(
    circle: { visibility: CircleVisibility; status: string },
    membership: Membership,
  ) {
    if (circle.status !== 'ACTIVE') return this.isActiveMember(membership);
    if (circle.visibility === 'HIDDEN') return this.isActiveMember(membership);
    return true;
  }

  canViewMemberList(membership: Membership) {
    return this.isActiveMember(membership);
  }

  canJoin(
    circle: { joinPolicy: CircleJoinPolicy; status: string },
    membership: Membership,
  ) {
    if (circle.status !== 'ACTIVE') return false;
    if (membership?.status === 'ACTIVE' || membership?.status === 'PENDING') return false;
    if (circle.joinPolicy === 'PRIVATE') return false;
    return true;
  }

  canLeave(membership: Membership) {
    return membership?.status === 'ACTIVE';
  }
}
