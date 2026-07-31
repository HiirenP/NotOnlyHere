/** Reliable preview images — Unsplash & Picsum */
export const images = {
  coverAnxiety: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
  coverParents: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=400&fit=crop',
  coverGrief: 'https://images.unsplash.com/photo-1517456793572-1d8aabeb110a?w=1200&h=400&fit=crop',
  coverWork: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=400&fit=crop',
  profileCover: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
  postNature: 'https://images.unsplash.com/photo-1441974231530-c6687ac0fe9e?w=800&h=600&fit=crop',
  postCoffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop',
  postGroup: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
  postSunset: 'https://images.unsplash.com/photo-1470252649378-9c29740c9e24?w=800&h=600&fit=crop',
  postJournal: 'https://images.unsplash.com/photo-1455390582260-0446debbcc77?w=800&h=600&fit=crop',
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
  topComments?: { author: string; text: string }[];
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
  access: 'Open' | 'Request' | 'Invite';
  joined: boolean;
  description: string;
  privacy: string;
  admins: string[];
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
    jobTitle: 'Peer supporter at NotOnlyHere',
    anonymous: false,
    circle: 'Anxiety Support',
    circleId: 'c1',
    time: '2h',
    content: 'Had a rough morning but writing it out helped. Grateful this space exists. Taking things one hour at a time today.',
    images: [{ src: images.postNature, alt: 'Peaceful morning walk in nature' }],
    reactions: 47,
    comments: 12,
    shares: 3,
    audience: 'Circle',
    liked: true,
    topComments: [
      { author: 'Sam R.', text: 'Proud of you for showing up today.' },
      { author: 'Morgan K.', text: 'One hour at a time — that really resonates.' },
    ],
  },
  {
    id: '2',
    author: 'Anonymous',
    username: 'anon',
    anonymous: true,
    circle: 'Members',
    circleId: 'global',
    time: '4h',
    content: 'Does anyone else feel guilty for taking a mental health day? Trying to unlearn that. Would love to hear how others reframe it.',
    images: [{ src: images.postJournal, alt: 'Journal and self-reflection' }],
    reactions: 128,
    comments: 34,
    shares: 8,
    audience: 'Members',
    topComments: [
      { author: 'Anonymous', text: 'Rest is productive. You are allowed to need it.' },
    ],
  },
  {
    id: '3',
    author: 'Sam Rivera',
    username: 'samr',
    avatar: images.avatar3,
    jobTitle: 'Community member',
    anonymous: false,
    circle: 'New Parents',
    circleId: 'c2',
    time: 'Yesterday',
    content: 'Small win today: asked for help instead of pushing through alone. The village showed up.',
    images: [
      { src: images.postCoffee, alt: 'Morning coffee and journal' },
      { src: images.postGroup, alt: 'Supportive group conversation' },
    ],
    reactions: 89,
    comments: 21,
    shares: 5,
    audience: 'Connections',
  },
  {
    id: '4',
    author: 'Taylor Brooks',
    username: 'taylorb',
    avatar: images.avatar4,
    anonymous: false,
    circle: 'Work Stress',
    circleId: 'c4',
    time: 'Yesterday',
    content: 'Reminder: you don\'t have to earn rest. Sharing this because I needed to hear it too.',
    images: [{ src: images.postSunset, alt: 'Peaceful sunset' }],
    reactions: 203,
    comments: 45,
    shares: 18,
    audience: 'Members',
    liked: true,
  },
];

export const circles: CircleGroup[] = [
  {
    id: 'c1',
    name: 'Anxiety Support',
    cover: images.coverAnxiety,
    thumb: images.circleThumb1,
    members: 8420,
    posts24h: 124,
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
    members: 5160,
    posts24h: 89,
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
    members: 3110,
    posts24h: 42,
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
    members: 6900,
    posts24h: 156,
    access: 'Open',
    joined: false,
    description: 'Boundaries, burnout, and finding balance. You are more than your job title.',
    privacy: 'Visible to members',
    admins: ['Dana W.', 'Chris P.'],
  },
];

export const suggestedConnections = [
  { name: 'Morgan Kim', username: 'morgank', avatar: images.avatar1, mutual: 3 },
  { name: 'Priya Shah', username: 'priyas', avatar: images.avatar4, mutual: 5 },
  { name: 'Chris Park', username: 'chrisp', avatar: images.avatar2, mutual: 2 },
];

export const friendRequests = [
  { name: 'Emerson Calzoni', avatar: images.avatar3, mutual: 4 },
  { name: 'James Levin', avatar: images.avatar2, mutual: 2 },
  { name: 'Taylor Brooks', avatar: images.avatar4, mutual: 6 },
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
  title: 'Community member at NotOnlyHere',
  bio: 'Finding calm in community. Here for peer support and honest conversations.',
  joinedAt: 'March 2025',
  connections: 48,
  circles: 6,
  posts: 256,
  followers: 2500,
  following: 365,
};

export const todaysNews = [
  { id: 'n1', title: 'New peer support resources added this week', time: '2hr', image: images.news1 },
  { id: 'n2', title: 'Community check-in event this Saturday', time: '3hr', image: images.news2 },
  { id: 'n3', title: 'Tips for supporting a friend in crisis', time: '5hr', image: images.news3 },
  { id: 'n4', title: 'Anxiety Support circle reaches 2,000 members', time: '8hr', image: images.news4 },
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
  { id: 'u3', name: 'Staff User', email: 'staff@notonlyhere.com', username: 'staff', status: 'Active', role: 'Staff', joined: '2024-11-01', lastActive: '2026-07-31', posts: 0, avatar: images.avatar3 },
  { id: 'u4', name: 'Sam Rivera', email: 'sam@example.com', username: 'samr', status: 'Active', role: 'Member', joined: '2025-05-20', lastActive: '2026-07-31', posts: 67, avatar: images.avatar3 },
  { id: 'u5', name: 'Morgan Kim', email: 'morgan@example.com', username: 'morgank', status: 'Active', role: 'Circle Admin', joined: '2025-02-14', lastActive: '2026-07-29', posts: 124, avatar: images.avatar1 },
  { id: 'u6', name: 'Priya Shah', email: 'priya@example.com', username: 'priyas', status: 'Active', role: 'Member', joined: '2025-06-03', lastActive: '2026-07-27', posts: 9, avatar: images.avatar4 },
  { id: 'u7', name: 'Chris Park', email: 'chris@example.com', username: 'chrisp', status: 'Pending', role: 'Member', joined: '2026-07-25', lastActive: '2026-07-25', posts: 0, avatar: images.avatar2 },
  { id: 'u8', name: 'Taylor Brooks', email: 'taylor@example.com', username: 'taylorb', status: 'Active', role: 'Member', joined: '2025-08-11', lastActive: '2026-07-30', posts: 31, avatar: images.avatar4 },
  { id: 'u9', name: 'Emerson Calzoni', email: 'emerson@example.com', username: 'emersonc', status: 'Active', role: 'Member', joined: '2025-04-22', lastActive: '2026-07-28', posts: 55, avatar: images.avatar3 },
  { id: 'u10', name: 'James Levin', email: 'james@example.com', username: 'jamesl', status: 'Suspended', role: 'Member', joined: '2025-01-30', lastActive: '2026-07-15', posts: 3, avatar: images.avatar2 },
  { id: 'u11', name: 'Content Admin', email: 'content@notonlyhere.com', username: 'content', status: 'Active', role: 'Staff', joined: '2024-09-01', lastActive: '2026-07-31', posts: 0, avatar: images.avatar1 },
  { id: 'u12', name: 'Super Admin', email: 'admin@notonlyhere.com', username: 'admin', status: 'Active', role: 'Super Admin', joined: '2024-01-01', lastActive: '2026-07-31', posts: 0, avatar: images.avatar2 },
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
