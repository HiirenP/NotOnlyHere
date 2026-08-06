import type {
  CircleSummary,
  CommentItem,
  ConnectionItem,
  EventSummary,
  NotificationItem,
  PostItem,
  ProfileResponse,
  ResourceSummary,
} from '@notonlyhere/contracts';
import type { CircleGroup, FeedPost } from '@/design/data/mock';
import { images } from '@/design/data/mock';

const circleCovers: Record<string, { cover: string; thumb: string }> = {
  'anxiety-support': { cover: images.coverAnxiety, thumb: images.circleThumb1 },
  'new-parents': { cover: images.coverParents, thumb: images.circleThumb2 },
  'grief-loss': { cover: images.coverGrief, thumb: images.circleThumb3 },
  'work-stress': { cover: images.coverWork, thumb: images.circleThumb1 },
};

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

export function postItemToFeedPost(post: PostItem, circleName?: string, commentCount?: number): FeedPost {
  const reactionTotal =
    (post.reactions?.counts?.SUPPORT ?? 0) +
    (post.reactions?.counts?.HUG ?? 0) +
    (post.reactions?.counts?.INSIGHTFUL ?? 0);
  const comments = commentCount ?? post.commentCount ?? 0;

  if (post.author.isAnonymous) {
    return {
      id: post.id,
      author: post.author.displayLabel,
      username: 'anon',
      anonymous: true,
      circle: circleName ?? 'Members',
      circleId: 'global',
      time: timeAgo(post.createdAt),
      content: post.body,
      images: post.media[0]?.url ? [{ src: post.media[0].url, alt: post.media[0].altText ?? '' }] : undefined,
      reactions: reactionTotal,
      comments,
      shares: 0,
      audience: post.visibility,
      liked: post.reactions?.viewerReaction === 'SUPPORT',
    };
  }

  return {
    id: post.id,
    author: post.author.displayName,
    username: post.author.username,
    avatar: post.author.avatar?.url ?? images.avatar2,
    anonymous: false,
    circle: circleName ?? 'Members',
    circleId: 'global',
    time: timeAgo(post.createdAt),
    content: post.body,
    images: post.media[0]?.url ? [{ src: post.media[0].url, alt: post.media[0].altText ?? '' }] : undefined,
    reactions: reactionTotal,
    comments,
    shares: 0,
    audience: post.visibility,
    liked: Boolean(post.reactions?.viewerReaction),
  };
}

export function commentToPreview(comment: CommentItem) {
  const author = comment.author.isAnonymous
    ? comment.author.displayLabel
    : comment.author.displayName;
  return { author, text: comment.body };
}

export function circleSummaryToGroup(circle: CircleSummary): CircleGroup {
  const access =
    circle.joinPolicy === 'OPEN' ? 'Open' : circle.joinPolicy === 'APPROVAL' ? 'Request' : 'Invite';
  const visuals = circleCovers[circle.slug] ?? { cover: images.coverAnxiety, thumb: images.circleThumb1 };
  return {
    id: circle.id,
    name: circle.name,
    cover: visuals.cover,
    thumb: visuals.thumb,
    members: circle.memberCount,
    posts24h: Math.max(1, Math.floor(circle.memberCount / 50)),
    access,
    joined: circle.viewer.membershipStatus === 'ACTIVE',
    description: circle.description,
    privacy: circle.visibility === 'PUBLIC' ? 'Visible to members' : 'Private',
    admins: ['Circle Admin'],
  };
}

const NOTIFICATION_LABELS: Record<string, string> = {
  'notification.broadcast.title': 'Community announcement',
  'notification.broadcast.body': 'You have a new community broadcast.',
  'notification.reaction.title': 'New reaction on your post',
  'notification.reaction.body': 'Someone reacted to your post.',
  'notification.circle_approved.title': 'Circle request approved',
  'notification.circle_approved.body': 'Your circle join request was approved.',
  'notification.event_reminder.title': 'Event reminder',
  'notification.event_reminder.body': 'An event you RSVPd to is coming up soon.',
};

export function notificationToListItem(item: NotificationItem) {
  const text = NOTIFICATION_LABELS[item.bodyKey] ?? NOTIFICATION_LABELS[item.titleKey] ?? item.bodyKey ?? item.titleKey;
  return {
    id: item.id,
    text,
    time: timeAgo(item.createdAt),
    unread: !item.readAt,
    avatar: undefined as string | undefined,
    postId: item.targets.postId,
    circleId: item.targets.circleId,
    conversationId: item.targets.conversationId,
    eventType: item.eventType,
  };
}

export function eventToCard(event: EventSummary) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startsAt: event.startsAt,
    timeZone: event.timeZone,
    locationName: event.locationName,
    going: event.counts.going,
    viewerRsvp: event.viewer.rsvpStatus,
    canRsvp: event.viewer.canRsvp,
  };
}

export function resourceToCard(resource: ResourceSummary, index: number) {
  const thumbs = [images.resource1, images.resource2, images.resource3];
  return {
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    summary: resource.summary,
    kind: resource.kind,
    image: thumbs[index % thumbs.length],
  };
}

export function connectionToSuggestion(conn: ConnectionItem, viewerId: string) {
  const other =
    conn.requester.id === viewerId
      ? conn.addressee
      : conn.requester;
  return {
    name: other.displayName,
    username: other.username,
    avatar: other.avatar?.url ?? images.avatar1,
    mutual: 0,
    userId: other.id,
  };
}

export function profileToCurrentUser(profile: ProfileResponse, postCount = 0, circleCount = 0) {
  return {
    displayName: profile.displayName,
    username: profile.username,
    avatar: profile.avatar?.url ?? images.avatar1,
    cover: profile.cover?.url ?? images.profileCover,
    title: 'Community member at NotOnlyHere',
    bio: profile.bio ?? '',
    joinedAt: new Date(profile.joinDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    connections: profile.connectionCount,
    circles: circleCount,
    posts: postCount,
    followers: profile.connectionCount,
    following: profile.connectionCount,
    isSelf: profile.viewer.isSelf,
    canConnect: profile.viewer.canConnect,
    canMessage: profile.viewer.canMessage,
    connectionStatus: profile.viewer.connectionStatus,
    userId: profile.userId,
  };
}

export function conversationToListItem(conv: {
  id: string;
  otherUser: { displayName: string; username: string; id?: string } | null;
  lastMessage: { body: string | null; createdAt: string } | null;
  updatedAt: string;
}) {
  const avatars = [images.avatar2, images.avatar3, images.avatar1];
  const idx = conv.id.charCodeAt(conv.id.length - 1) % avatars.length;
  return {
    id: conv.id,
    name: conv.otherUser?.displayName ?? 'Member',
    username: conv.otherUser?.username,
    userId: conv.otherUser?.id,
    avatar: avatars[idx],
    preview: conv.lastMessage?.body ?? 'Start a conversation',
    time: timeAgo(conv.updatedAt),
    unread: false,
    online: false,
  };
}
