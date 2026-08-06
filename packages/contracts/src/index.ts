export type UserStatus =
  | 'PENDING_VERIFICATION'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'BANNED'
  | 'DELETION_PENDING'
  | 'ANONYMIZED';

export type AccountResponse = {
  id: string;
  email: string;
  status: UserStatus;
  displayName: string;
  username: string;
  roles: string[];
};

export type ApiErrorBody = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  code: string;
  requestId?: string;
  errors?: Record<string, string[]>;
};

export type HealthResponse = {
  status: 'ok' | 'degraded' | 'error';
  checks?: Record<string, { status: string; message?: string }>;
};

export type OutboxEventType =
  | 'platform.noop'
  | 'email.verification'
  | 'email.password_reset'
  | 'account.export'
  | 'account.deletion';

export type NoopOutboxPayload = {
  message: string;
  emittedAt: string;
};

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type ProfileMediaRef = {
  id: string;
  url: string;
};

export type ProfileSummary = {
  userId: string;
  username: string;
  displayName: string;
  bio: string | null;
  joinDate: string;
  avatar: ProfileMediaRef | null;
  cover: ProfileMediaRef | null;
  connectionCount: number;
  version: number;
};

export type ProfileViewerContext = {
  isSelf: boolean;
  connectionStatus: ConnectionStatus | null;
  connectionId: string | null;
  isBlocked: boolean;
  isBlockedBy: boolean;
  canConnect: boolean;
  canMessage: boolean;
};

export type ProfileResponse = ProfileSummary & {
  viewer: ProfileViewerContext;
};

export type UpdateProfileRequest = {
  displayName?: string;
  username?: string;
  bio?: string | null;
  avatarMediaId?: string | null;
  coverMediaId?: string | null;
  version: number;
};

export type ConnectionUser = {
  id: string;
  username: string;
  displayName: string;
  avatar: ProfileMediaRef | null;
};

export type ConnectionItem = {
  id: string;
  status: ConnectionStatus;
  requester: ConnectionUser;
  addressee: ConnectionUser;
  createdAt: string;
  respondedAt: string | null;
  direction: 'incoming' | 'outgoing' | 'connected';
};

export type BlockItem = {
  userId: string;
  username: string;
  displayName: string;
  blockedAt: string;
};

export type ActivityItem = {
  id: string;
  type: 'PROFILE_UPDATED' | 'CONNECTION_ACCEPTED' | 'POST_CREATED';
  summary: string;
  occurredAt: string;
};

export type MediaUploadResponse = {
  id: string;
  uploadToken: string;
  maxBytes: number;
  allowedMimeTypes: string[];
};

export type AccountExportStatus = 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED' | 'EXPIRED';

export type AccountExportResponse = {
  id: string;
  status: AccountExportStatus;
  requestedAt: string;
  completedAt: string | null;
  expiresAt: string | null;
  downloadUrl: string | null;
};

export type AccountDeletionResponse = {
  status: 'DELETION_PENDING';
  requestedAt: string;
  dueAt: string;
  message: string;
};

export type PostVisibility = 'PUBLIC' | 'MEMBERS' | 'CONNECTIONS' | 'ONLY_ME';
export type FeedMode = 'RELEVANT' | 'CHRONOLOGICAL';
export type ContentStatus = 'ACTIVE' | 'DELETED';

export type PostAuthor =
  | {
      isAnonymous: true;
      displayLabel: string;
    }
  | {
      isAnonymous: false;
      id: string;
      username: string;
      displayName: string;
      avatar: ProfileMediaRef | null;
    };

export type PostViewerContext = {
  isAuthor: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canConnect: boolean;
  canMessage: boolean;
};

export type PostItem = {
  id: string;
  body: string;
  visibility: PostVisibility;
  status: ContentStatus;
  version: number;
  isEdited: boolean;
  editedAt: string | null;
  createdAt: string;
  deletedAt: string | null;
  isAnonymous: boolean;
  author: PostAuthor;
  media: { id: string; position: number; altText: string | null; url: string | null }[];
  linkPreview: {
    sourceUrl: string;
    canonicalUrl: string;
    title: string | null;
    description: string | null;
    siteName: string | null;
    fetchStatus: string;
  } | null;
  reactions: {
    counts: Record<'SUPPORT' | 'HUG' | 'INSIGHTFUL', number>;
    viewerReaction: ReactionKind | null;
  };
  commentCount: number;
  viewer: PostViewerContext;
};

export type ReactionKind = 'SUPPORT' | 'HUG' | 'INSIGHTFUL';

export type CommentAuthor =
  | {
      isAnonymous: true;
      displayLabel: string;
    }
  | {
      isAnonymous: false;
      id: string;
      username: string;
      displayName: string;
    };

export type CommentItem = {
  id: string;
  postId: string;
  parentCommentId: string | null;
  body: string;
  status: ContentStatus;
  version: number;
  isEdited: boolean;
  createdAt: string;
  isAnonymous: boolean;
  author: CommentAuthor;
  reactions: {
    counts: Record<ReactionKind, number>;
    viewerReaction: ReactionKind | null;
  };
  viewer: PostViewerContext;
};

export type SearchResponse = {
  query: string;
  items: PostItem[];
  nextCursor: string | null;
};

export type FeedResponse = {
  mode: FeedMode;
  items: PostItem[];
  nextCursor: string | null;
};

export type AnonymousQuotaResponse = {
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string;
};

export type CircleVisibility = 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
export type CircleJoinPolicy = 'OPEN' | 'APPROVAL' | 'PRIVATE';
export type CircleRole = 'MEMBER' | 'ADMIN';
export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'DECLINED' | 'LEFT' | 'REMOVED';

export type CircleSummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  visibility: CircleVisibility;
  joinPolicy: CircleJoinPolicy;
  memberCount: number;
  createdAt: string;
  viewer: {
    membershipStatus: MembershipStatus | null;
    role: CircleRole | null;
    isMember: boolean;
    canJoin: boolean;
  };
};

export type CircleDetail = CircleSummary & {
  guidelines: string | null;
  version: number;
  viewer: CircleSummary['viewer'] & {
    canLeave: boolean;
    canViewMembers: boolean;
    isAdmin: boolean;
    canManage: boolean;
  };
};

export type CircleDirectoryResponse = {
  query: string;
  items: CircleSummary[];
  nextCursor: string | null;
};

export type CircleMemberItem = {
  userId: string;
  username: string;
  displayName: string;
  role: CircleRole;
  joinedAt: string | null;
};

export type CircleMembersResponse = {
  items: CircleMemberItem[];
  nextCursor: string | null;
};

export type NotificationItem = {
  id: string;
  eventType: string;
  titleKey: string;
  bodyKey: string;
  templateParams: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
  targets: {
    actorUserId: string | null;
    postId: string | null;
    commentId: string | null;
    connectionId: string | null;
    circleId: string | null;
    conversationId: string | null;
    targetUserId: string | null;
  };
};

export type NotificationsResponse = {
  unreadCount: number;
  items: NotificationItem[];
  nextCursor: string | null;
};

export type WellnessCheckin = {
  id: string;
  mood: number;
  note: string | null;
  checkedInAt: string;
  localDate: string;
  timeZone: string;
  version: number;
};

export type WellnessCheckinsResponse = {
  items: WellnessCheckin[];
  nextCursor: string | null;
};

export type WellnessTrendPoint = {
  date: string;
  mood: number | null;
};

export type WellnessTrendsResponse = {
  window: '7d' | '30d';
  timeZone: string;
  points: WellnessTrendPoint[];
  average: number | null;
  checkInCount: number;
};

export type AiQuotaResponse = {
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string;
};

export type AiMessageItem = {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
};

export type ResourceAccess = 'PUBLIC_FREE' | 'MEMBER' | 'PAID_ONCE';
export type ResourceKind = 'ARTICLE' | 'VIDEO' | 'WORKSHEET';

export type ResourceSummary = {
  id: string;
  slug: string;
  kind: ResourceKind;
  access: ResourceAccess;
  title: string;
  summary: string;
  publishedAt: string | null;
  viewer: {
    canAccess: boolean;
    progressPercent: number;
  };
};

export type ResourcesListResponse = {
  query: string;
  items: ResourceSummary[];
  nextCursor: string | null;
};

export type ResourceDetail = ResourceSummary & {
  bodyPlain: string | null;
  externalVideoUrl: string | null;
  priceMinor: number | null;
  currency: string | null;
  status: string;
  version: number;
  viewer: {
    canAccess: boolean;
    requiresPurchase: boolean;
  };
};

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
export type RsvpStatus = 'GOING' | 'MAYBE' | 'NOT_GOING';

export type EventSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  timeZone: string;
  locationName: string | null;
  status: EventStatus;
  scheduleVersion: number;
  version: number;
  createdAt: string;
  counts: { going: number };
  viewer: {
    rsvpStatus: RsvpStatus | null;
    canRsvp: boolean;
  };
};

export type EventsListResponse = {
  view: 'month' | 'list';
  from: string;
  to: string;
  items: EventSummary[];
  nextCursor: string | null;
};

export type EventAttendee = {
  userId: string;
  username: string;
  displayName: string;
  status: RsvpStatus;
  respondedAt: string;
};

export type EventAttendeesResponse = {
  items: EventAttendee[];
  nextCursor: string | null;
};
