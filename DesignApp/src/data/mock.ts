/** Reliable preview images — Unsplash & Picsum */
export const images = {
  coverAnxiety: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
  coverParents: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=400&fit=crop',
  coverGrief: 'https://images.unsplash.com/photo-1517456793572-1d8aabeb110a?w=1200&h=400&fit=crop',
  coverWork: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=400&fit=crop',
  profileCover: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
  postNature: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  postCoffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop',
  postGroup: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
  postSunset: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  postJournal: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
  avatar1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  avatar3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  avatar4: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  avatar5: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  circleThumb1: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=120&fit=crop',
  circleThumb2: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=120&h=120&fit=crop',
  circleThumb3: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&h=120&fit=crop',
  story1: 'https://images.unsplash.com/photo-1501785888041-af9ef94e21ba?w=200&h=320&fit=crop',
  story2: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=320&fit=crop',
  story3: 'https://images.unsplash.com/photo-1518241353330-bf5791f2f1eb?w=200&h=320&fit=crop',
  story4: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=320&fit=crop',
  story5: 'https://images.unsplash.com/photo-1418065460487-3e41a237cc7e?w=200&h=320&fit=crop',
  event1: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=300&fit=crop',
  event2: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=300&fit=crop',
  resource1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=240&fit=crop',
  resource2: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=240&fit=crop',
  resource3: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=240&fit=crop',
  news1: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=80&fit=crop',
  news2: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=120&h=80&fit=crop',
  news3: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=120&h=80&fit=crop',
  news4: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=80&fit=crop',
  exploreSearch: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=240&fit=crop',
  exploreCircles: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=240&fit=crop',
  exploreEvents: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=240&fit=crop',
  exploreResources: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=240&fit=crop',
  exploreAva: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop',
  exploreMood: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=240&fit=crop',
};

export type PostImage = { src: string; alt: string };

export type FeedPost = {
  id: string;
  author: string;
  username: string;
  avatar?: string;
  jobTitle?: string;
  anonymous: boolean;
  circle: string;
  circleId: string;
  time: string;
  content: string;
  images?: PostImage[];
  reactions: number;
  comments: number;
  shares: number;
  audience: string;
  liked?: boolean;
  foundingMember?: boolean;
  topComments?: { author: string; text: string; foundingMember?: boolean }[];
};

export type CircleHighlight = {
  id: string;
  name: string;
  thumb: string;
  storyImage?: string;
  hasNew: boolean;
  isYours?: boolean;
};

export type CircleGroup = {
  id: string;
  name: string;
  cover: string;
  thumb: string;
  members: number;
  posts24h: number;
  activeToday: number;
  identityLine: string;
  access: 'Open' | 'Request' | 'Invite';
  joined: boolean;
  description: string;
  privacy: string;
  admins: string[];
};

export type CheckInMood = {
  id: string;
  emoji: string;
  label: string;
  circle: string;
  circlePath: string;
  avaPrompt: string;
  discussion: string;
};

export const circleHighlights: CircleHighlight[] = [
  { id: 'create', name: 'Share moment', thumb: '', hasNew: false, isYours: true },
  { id: 'c1', name: 'Anxiety Support', thumb: images.circleThumb1, storyImage: images.story1, hasNew: true },
  { id: 'c2', name: 'New Parents', thumb: images.circleThumb2, storyImage: images.story2, hasNew: true },
  { id: 'c3', name: 'Grief & Loss', thumb: images.circleThumb3, storyImage: images.story3, hasNew: false },
  { id: 'c4', name: 'Work Stress', thumb: images.circleThumb1, storyImage: images.story4, hasNew: false },
  { id: 'c5', name: 'Student Life', thumb: images.circleThumb2, storyImage: images.story5, hasNew: true },
];

export const feedPosts: FeedPost[] = [
  {
    id: '1',
    author: 'Jordan Lee',
    username: 'jordanl',
    avatar: images.avatar2,
    jobTitle: 'In Anxiety Support',
    anonymous: false,
    circle: 'Anxiety Support',
    circleId: 'c1',
    time: '2h',
    content: 'I finally got out of bed today.',
    images: [{ src: images.postNature, alt: 'Quiet morning light' }],
    reactions: 24,
    comments: 9,
    shares: 1,
    audience: 'Circle',
    liked: true,
    foundingMember: true,
    topComments: [
      { author: 'Sam R.', text: 'That counts. Really glad you shared it here.', foundingMember: true },
      { author: 'Morgan K.', text: 'Sitting with you in that — one step is enough.', foundingMember: true },
    ],
  },
  {
    id: '2',
    author: 'Anonymous',
    username: 'anon',
    anonymous: true,
    circle: 'Anxiety Support',
    circleId: 'c1',
    time: '4h',
    content: 'Today was my first panic-free morning in weeks.',
    images: [{ src: images.postJournal, alt: 'Open journal on a desk' }],
    reactions: 41,
    comments: 14,
    shares: 2,
    audience: 'Circle',
    topComments: [
      { author: 'Anonymous', text: 'I heard you. Holding that with you.' },
    ],
  },
  {
    id: '3',
    author: 'Sam Rivera',
    username: 'samr',
    avatar: images.avatar3,
    jobTitle: 'In New Parents',
    anonymous: false,
    circle: 'New Parents',
    circleId: 'c2',
    time: 'Yesterday',
    content: 'I don’t need advice today. I just needed someone to hear me.',
    images: [
      { src: images.postCoffee, alt: 'Quiet coffee moment' },
    ],
    reactions: 33,
    comments: 11,
    shares: 1,
    audience: 'Circle',
    topComments: [
      { author: 'Jamie L.', text: 'I’m here. No advice — just listening.' },
    ],
  },
  {
    id: '4',
    author: 'Taylor Brooks',
    username: 'taylorb',
    avatar: images.avatar4,
    jobTitle: 'In Work Stress',
    anonymous: false,
    circle: 'Work Stress',
    circleId: 'c4',
    time: 'Yesterday',
    content: 'The Late Night Lounge got me through a difficult week. Joining Work Stress again tonight.',
    images: [{ src: images.postSunset, alt: 'Soft evening sky' }],
    reactions: 28,
    comments: 8,
    shares: 2,
    audience: 'Members',
    liked: true,
    topComments: [
      { author: 'Chris P.', text: 'Glad that circle was there when you needed it.' },
    ],
  },
  {
    id: '5',
    author: 'Anonymous',
    username: 'anon2',
    anonymous: true,
    circle: 'Grief & Loss',
    circleId: 'c3',
    time: '2d',
    content: 'Some days the quiet feels too loud. Showing up anyway.',
    reactions: 19,
    comments: 7,
    shares: 0,
    audience: 'Circle',
    topComments: [
      { author: 'Riley N.', text: 'You’re welcome here exactly as you are.' },
    ],
  },
];

export const circles: CircleGroup[] = [
  {
    id: 'c1',
    name: 'Anxiety Support',
    cover: images.coverAnxiety,
    thumb: images.circleThumb1,
    members: 842,
    posts24h: 24,
    activeToday: 38,
    identityLine: 'A calm place when your mind won’t quiet down',
    access: 'Open',
    joined: true,
    description: 'A calm, moderated space to share experiences, coping strategies, and encouragement. No judgment — just peer support.',
    privacy: 'Visible to members',
    admins: ['Morgan K.', 'Priya S.', 'Alex T.'],
  },
  {
    id: 'c2',
    name: 'New Parents',
    cover: images.coverParents,
    thumb: images.circleThumb2,
    members: 516,
    posts24h: 18,
    activeToday: 22,
    identityLine: 'For the village you wish you already had',
    access: 'Request',
    joined: true,
    description: 'For parents navigating the beautiful chaos. Share wins, worries, and resources.',
    privacy: 'Visible to members',
    admins: ['Jamie L.', 'Casey M.'],
  },
  {
    id: 'c3',
    name: 'Grief & Loss',
    cover: images.coverGrief,
    thumb: images.circleThumb3,
    members: 311,
    posts24h: 12,
    activeToday: 14,
    identityLine: 'A gentle space that doesn’t rush your process',
    access: 'Open',
    joined: false,
    description: 'A gentle space for those processing loss. Move at your own pace.',
    privacy: 'Visible to members',
    admins: ['Riley N.'],
  },
  {
    id: 'c4',
    name: 'Work Stress',
    cover: images.coverWork,
    thumb: images.circleThumb1,
    members: 690,
    posts24h: 31,
    activeToday: 41,
    identityLine: 'I’m joining Work Stress Circle tonight',
    access: 'Open',
    joined: false,
    description: 'Boundaries, burnout, and finding balance. You are more than your job title.',
    privacy: 'Visible to members',
    admins: ['Dana W.', 'Chris P.'],
  },
];

export const suggestedPeople = [
  { name: 'Morgan Kim', username: 'morgank', avatar: images.avatar1, sharedCircle: 'Anxiety Support', foundingMember: true },
  { name: 'Priya Shah', username: 'priyas', avatar: images.avatar4, sharedCircle: 'New Parents', foundingMember: true },
  { name: 'Chris Park', username: 'chrisp', avatar: images.avatar2, sharedCircle: 'Work Stress', foundingMember: false },
];

export const blockedMembers = [
  { id: 'b1', name: 'James Levin', username: 'jamesl', avatar: images.avatar2, blockedAt: 'Jul 12, 2026' },
];

export const referralStats = {
  inviteCode: 'alexm',
  inviteLink: 'https://notonlyhere.com/join/alexm',
  sent: 12,
  opened: 5,
  joined: 3,
  recent: [
    { name: 'Taylor Brooks', joinedAt: 'Aug 10, 2026' },
    { name: 'Chris Park', joinedAt: 'Aug 3, 2026' },
    { name: 'Riley N.', joinedAt: 'Jul 28, 2026' },
  ],
};

/** @deprecated use suggestedPeople */
export const suggestedConnections = suggestedPeople.map((p) => ({
  ...p,
  mutual: 2,
}));

export const friendRequests = [
  { name: 'Emerson Calzoni', avatar: images.avatar3, sharedCircle: 'Anxiety Support' },
  { name: 'James Levin', avatar: images.avatar2, sharedCircle: 'Work Stress' },
  { name: 'Taylor Brooks', avatar: images.avatar4, sharedCircle: 'New Parents' },
];

export const upcomingEvents = [
  { title: 'Community Check-in', date: 'Aug 2', time: '6:00 PM', attendees: 42 },
  { title: 'Mindful Breathing', date: 'Aug 9', time: '4:00 PM', attendees: 18 },
];

export const currentUser = {
  displayName: 'Alex Morgan',
  username: 'alexm',
  avatar: images.avatar1,
  cover: images.profileCover,
  title: 'Member of Anxiety Support · Work Stress',
  bio: 'Finding calm in community. Here for peer support and honest conversations.',
  joinedAt: 'March 2025',
  supportGiven: 47,
  kindResponses: 32,
  circlesJoined: 6,
  daysCheckedIn: 28,
  encouragementShared: 19,
  peopleWelcomed: 12,
  foundingMember: true,
  inviteCode: referralStats.inviteCode,
  inviteLink: referralStats.inviteLink,
};

export const todaysCommunity = [
  { id: 'c1', text: '38 people checked in today', meta: 'Today', to: '/design/app/mood' },
  { id: 'c2', text: 'Someone celebrated a new job', meta: 'Work Stress', to: '/design/app/circles/detail' },
  { id: 'c3', text: 'A new grief circle starts tonight', meta: 'Tonight · 7:00 PM', to: '/design/app/events' },
  { id: 'c4', text: 'Five members welcomed their first week', meta: 'Community', to: '/design/app/circles' },
];

/** @deprecated use todaysCommunity */
export const todaysNews = todaysCommunity.map((item, i) => ({
  id: item.id,
  title: item.text,
  time: item.meta,
  image: [images.news1, images.news2, images.news3, images.news4][i],
}));

export const checkInMoods: CheckInMood[] = [
  {
    id: 'hopeful',
    emoji: '🙂',
    label: 'Hopeful',
    circle: 'Anxiety Support',
    circlePath: '/design/app/circles/detail',
    avaPrompt: 'Share what’s giving you hope today with Ava',
    discussion: 'People celebrating small wins this week',
  },
  {
    id: 'okay',
    emoji: '😐',
    label: 'Okay',
    circle: 'Anxiety Support',
    circlePath: '/design/app/circles/detail',
    avaPrompt: 'A gentle check-in with Ava — no pressure',
    discussion: 'Quiet company: members just sitting together',
  },
  {
    id: 'struggling',
    emoji: '😔',
    label: 'Struggling',
    circle: 'Anxiety Support',
    circlePath: '/design/app/circles/detail',
    avaPrompt: 'Talk it through gently with Ava',
    discussion: '“I don’t need advice — just hearing me”',
  },
  {
    id: 'overwhelmed',
    emoji: '😰',
    label: 'Overwhelmed',
    circle: 'Work Stress',
    circlePath: '/design/app/circles/detail',
    avaPrompt: 'Ground with Ava for a few calm minutes',
    discussion: 'Work Stress Circle meets tonight',
  },
  {
    id: 'exhausted',
    emoji: '😴',
    label: 'Exhausted',
    circle: 'Late Night Lounge',
    circlePath: '/design/app/circles',
    avaPrompt: 'Rest-forward conversation with Ava',
    discussion: 'Soft evening check-ins in Circles',
  },
];

export const conversations = [
  { id: 'm1', name: 'Jordan Lee', avatar: images.avatar2, preview: 'Thanks for checking in yesterday.', time: '10:42 AM', unread: true, online: true },
  { id: 'm2', name: 'Sam Rivera', avatar: images.avatar3, preview: 'That resource you shared was helpful.', time: 'Yesterday', unread: false, online: false },
  { id: 'm3', name: 'Morgan Kim', avatar: images.avatar1, preview: 'See you at the event!', time: 'Mon', unread: false, online: true },
];

export const notifications = [
  { id: 'n1', text: 'Jordan Lee reacted to your post', time: '1h', unread: true, avatar: images.avatar2 },
  { id: 'n2', text: 'You were approved to join New Parents', time: '3h', unread: true, avatar: images.circleThumb2 },
  { id: 'n3', text: 'Event reminder: Community Check-in', time: 'Yesterday', unread: false },
];

export const adminUsers = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', username: 'alexm', status: 'Active', role: 'Member', joined: '2025-03-12', lastActive: '2026-07-30', posts: 42, avatar: images.avatar1 },
  { id: 'u2', name: 'Jordan Lee', email: 'jordan@example.com', username: 'jordanl', status: 'Suspended', role: 'Member', joined: '2025-01-08', lastActive: '2026-07-28', posts: 18, avatar: images.avatar2 },
  { id: 'u3', name: 'Maya Chen', email: 'maya@notonlyhere.com', username: 'mayac', status: 'Active', role: 'Moderator', joined: '2024-11-01', lastActive: '2026-07-31', posts: 0, avatar: images.avatar3 },
  { id: 'u4', name: 'Sam Rivera', email: 'sam@example.com', username: 'samr', status: 'Active', role: 'Member', joined: '2025-05-20', lastActive: '2026-07-31', posts: 67, avatar: images.avatar3 },
  { id: 'u5', name: 'Morgan Kim', email: 'morgan@example.com', username: 'morgank', status: 'Active', role: 'Community Guide', joined: '2025-02-14', lastActive: '2026-07-29', posts: 124, avatar: images.avatar1 },
  { id: 'u6', name: 'Priya Shah', email: 'priya@example.com', username: 'priyas', status: 'Active', role: 'Member', joined: '2025-06-03', lastActive: '2026-07-27', posts: 9, avatar: images.avatar4 },
  { id: 'u7', name: 'Chris Park', email: 'chris@example.com', username: 'chrisp', status: 'Pending', role: 'Member', joined: '2026-07-25', lastActive: '2026-07-25', posts: 0, avatar: images.avatar2 },
  { id: 'u8', name: 'Taylor Brooks', email: 'taylor@example.com', username: 'taylorb', status: 'Active', role: 'Member', joined: '2025-08-11', lastActive: '2026-07-30', posts: 31, avatar: images.avatar4 },
  { id: 'u9', name: 'Emerson Calzoni', email: 'emerson@example.com', username: 'emersonc', status: 'Active', role: 'Member', joined: '2025-04-22', lastActive: '2026-07-28', posts: 55, avatar: images.avatar3 },
  { id: 'u10', name: 'James Levin', email: 'james@example.com', username: 'jamesl', status: 'Suspended', role: 'Member', joined: '2025-01-30', lastActive: '2026-07-15', posts: 3, avatar: images.avatar2 },
  { id: 'u11', name: 'Content Admin', email: 'content@notonlyhere.com', username: 'content', status: 'Active', role: 'Admin', joined: '2024-09-01', lastActive: '2026-07-31', posts: 0, avatar: images.avatar1 },
  { id: 'u12', name: 'Platform Owner', email: 'admin@notonlyhere.com', username: 'admin', status: 'Active', role: 'Owner', joined: '2024-01-01', lastActive: '2026-07-31', posts: 0, avatar: images.avatar2 },
];

export const adminCircles = [
  { id: 'c1', name: 'Anxiety Support', members: 1842, status: 'Active', access: 'Open', submitted: '2024-06-01', posts24h: 24, thumb: images.circleThumb1 },
  { id: 'c2', name: 'New Parents', members: 956, status: 'Active', access: 'Request', submitted: '2024-08-15', posts24h: 18, thumb: images.circleThumb2 },
  { id: 'c3', name: 'Grief & Loss', members: 0, status: 'Pending', access: 'Open', submitted: '2026-07-28', posts24h: 0, thumb: images.circleThumb3 },
  { id: 'c4', name: 'Work Stress', members: 0, status: 'Pending', access: 'Open', submitted: '2026-07-27', posts24h: 0, thumb: images.circleThumb1 },
  { id: 'c5', name: 'Student Support', members: 0, status: 'Pending', access: 'Invite', submitted: '2026-07-26', posts24h: 0, thumb: images.circleThumb2 },
  { id: 'c6', name: 'Grief & Loss (archived)', members: 412, status: 'Archived', access: 'Open', submitted: '2023-11-10', posts24h: 0, thumb: images.circleThumb3 },
];

export const safetyAlerts = [
  { id: 'a1', type: 'Policy concern', confidence: 'Medium', status: 'New', excerpt: 'Post in Anxiety Support may violate guidelines…', reported: '2026-07-31 08:12', reporter: 'AI System', priority: 'High' },
  { id: 'a2', type: 'Harassment signal', confidence: 'Low', status: 'In review', excerpt: 'Comment thread flagged for review…', reported: '2026-07-30 22:45', reporter: 'Member #1042', priority: 'Medium' },
  { id: 'a3', type: 'Self-harm indicator', confidence: 'High', status: 'New', excerpt: 'Post contains language requiring immediate review…', reported: '2026-07-31 06:30', reporter: 'AI System', priority: 'Critical' },
  { id: 'a4', type: 'Spam detection', confidence: 'High', status: 'Dismissed', excerpt: 'Repeated promotional links in comments…', reported: '2026-07-29 14:20', reporter: 'AI System', priority: 'Low' },
  { id: 'a5', type: 'Policy concern', confidence: 'Medium', status: 'In review', excerpt: 'Circle description may need moderation…', reported: '2026-07-28 11:05', reporter: 'staff@notonlyhere.com', priority: 'Medium' },
  { id: 'a6', type: 'Harassment signal', confidence: 'Medium', status: 'New', excerpt: 'Direct message reported by member…', reported: '2026-07-31 09:18', reporter: 'Member #883', priority: 'High' },
];

export const donations = [
  { id: 'd1', donor: 'Member #1042', email: 'member1042@example.com', amount: 25, cadence: 'Monthly', status: 'Succeeded', date: '2026-07-30' },
  { id: 'd2', donor: 'Member #883', email: 'member883@example.com', amount: 10, cadence: 'One-time', status: 'Pending', date: '2026-07-29' },
  { id: 'd3', donor: 'Member #2104', email: 'member2104@example.com', amount: 50, cadence: 'Monthly', status: 'Succeeded', date: '2026-07-28' },
  { id: 'd4', donor: 'Member #556', email: 'member556@example.com', amount: 15, cadence: 'One-time', status: 'Succeeded', date: '2026-07-27' },
  { id: 'd5', donor: 'Member #992', email: 'member992@example.com', amount: 100, cadence: 'Annual', status: 'Succeeded', date: '2026-07-25' },
  { id: 'd6', donor: 'Member #331', email: 'member331@example.com', amount: 5, cadence: 'Monthly', status: 'Failed', date: '2026-07-24' },
  { id: 'd7', donor: 'Member #1788', email: 'member1788@example.com', amount: 20, cadence: 'One-time', status: 'Succeeded', date: '2026-07-22' },
  { id: 'd8', donor: 'Member #445', email: 'member445@example.com', amount: 30, cadence: 'Monthly', status: 'Succeeded', date: '2026-07-20' },
];

export const auditLog = [
  { id: 'l1', actor: 'staff@notonlyhere.com', action: 'Suspended user', target: '@jordanl', category: 'Enforcement', time: '2026-07-28 14:22 UTC' },
  { id: 'l2', actor: 'admin@notonlyhere.com', action: 'Approved circle', target: 'Grief & Loss', category: 'Moderation', time: '2026-07-27 09:10 UTC' },
  { id: 'l3', actor: 'content@notonlyhere.com', action: 'Published blog post', target: 'Grounding Techniques', category: 'Content', time: '2026-07-26 16:45 UTC' },
  { id: 'l4', actor: 'admin@notonlyhere.com', action: 'Updated role', target: '@morgank → Circle Admin', category: 'Users', time: '2026-07-25 11:30 UTC' },
  { id: 'l5', actor: 'staff@notonlyhere.com', action: 'Dismissed alert', target: 'Alert #a4', category: 'Safety', time: '2026-07-24 08:15 UTC' },
  { id: 'l6', actor: 'content@notonlyhere.com', action: 'Created event', target: 'Community Check-in', category: 'Content', time: '2026-07-23 13:00 UTC' },
  { id: 'l7', actor: 'admin@notonlyhere.com', action: 'Exported analytics', target: 'Growth report Q2', category: 'Analytics', time: '2026-07-22 17:45 UTC' },
  { id: 'l8', actor: 'staff@notonlyhere.com', action: 'Restored user', target: '@jamesl', category: 'Enforcement', time: '2026-07-21 10:20 UTC' },
  { id: 'l9', actor: 'admin@notonlyhere.com', action: 'Archived circle', target: 'Old Support Group', category: 'Moderation', time: '2026-07-20 15:55 UTC' },
  { id: 'l10', actor: 'content@notonlyhere.com', action: 'Updated resource', target: 'Understanding Anxiety', category: 'Content', time: '2026-07-19 09:40 UTC' },
];

export const adminContentItems = [
  { id: 'ct1', title: 'Grounding Techniques for Anxiety', type: 'Blog', status: 'Published', author: 'content@notonlyhere.com', updated: '2026-07-26', views: 1240 },
  { id: 'ct2', title: 'Understanding Anxiety (Video)', type: 'Resource', status: 'Draft', author: 'content@notonlyhere.com', updated: '2026-07-24', views: 0 },
  { id: 'ct3', title: 'Community Check-in', type: 'Event', status: 'Published', author: 'content@notonlyhere.com', updated: '2026-07-23', views: 420 },
  { id: 'ct4', title: 'Peer Support Basics', type: 'Article', status: 'Published', author: 'content@notonlyhere.com', updated: '2026-07-20', views: 890 },
  { id: 'ct5', title: 'Mindful Breathing Workshop', type: 'Event', status: 'Scheduled', author: 'content@notonlyhere.com', updated: '2026-07-18', views: 180 },
  { id: 'ct6', title: 'Crisis Resources Page', type: 'Resource', status: 'Published', author: 'admin@notonlyhere.com', updated: '2026-07-15', views: 2100 },
];

export const resources = [
  { id: 'r1', title: 'Grounding Techniques', type: 'Article', access: 'Members', progress: 60, cover: images.resource1 },
  { id: 'r2', title: 'Understanding Anxiety', type: 'Video', access: 'Paid', progress: 0, cover: images.resource2 },
  { id: 'r3', title: 'Peer Support Basics', type: 'Article', access: 'Members', progress: 100, cover: images.resource3 },
];

export const events = [
  { id: 'e1', title: 'Community Check-in', date: 'Aug 2, 2026', time: '6:00 PM UTC', location: 'Online — link in details', rsvp: 42, cover: images.event1 },
  { id: 'e2', title: 'Mindful Breathing Workshop', date: 'Aug 9, 2026', time: '4:00 PM UTC', location: 'Community Center, Room B', rsvp: 18, cover: images.event2 },
];
