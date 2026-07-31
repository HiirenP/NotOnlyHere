export const images = {
  coverAnxiety: 'https://readdy.ai/api/search-image?query=Calm%20abstract%20gradient%20waves%20soft%20blue%20teal%20purple%20peaceful%20mental%20health%20community%20banner%20wide&width=1200&height=400&seq=cover-anxiety&orientation=landscape',
  coverParents: 'https://readdy.ai/api/search-image?query=Warm%20family%20silhouette%20sunset%20soft%20pastel%20community%20support%20banner%20wide%20gentle&width=1200&height=400&seq=cover-parents&orientation=landscape',
  coverGrief: 'https://readdy.ai/api/search-image?query=Soft%20candlelight%20peaceful%20memorial%20warm%20tones%20support%20group%20banner%20wide&width=1200&height=400&seq=cover-grief&orientation=landscape',
  profileCover: 'https://readdy.ai/api/search-image?query=Soft%20abstract%20gradient%20blue%20cyan%20calm%20profile%20cover%20wide%20minimal&width=1200&height=400&seq=profile-cover&orientation=landscape',
  postNature: 'https://readdy.ai/api/search-image?query=Morning%20walk%20in%20nature%20peaceful%20path%20trees%20soft%20light%20wellness%20photography&width=800&height=600&seq=post-nature&orientation=landscape',
  postCoffee: 'https://readdy.ai/api/search-image?query=Cozy%20coffee%20cup%20journal%20morning%20self%20care%20warm%20light%20minimal&width=800&height=800&seq=post-coffee&orientation=squarish',
  postGroup: 'https://readdy.ai/api/search-image?query=Small%20support%20group%20circle%20discussion%20warm%20indoor%20light%20candid&width=800&height=500&seq=post-group&orientation=landscape',
  avatar1: 'https://readdy.ai/api/search-image?query=Friendly%20young%20woman%20portrait%20warm%20smile%20natural%20light%20headshot%20soft%20background&width=200&height=200&seq=avatar-1&orientation=squarish',
  avatar2: 'https://readdy.ai/api/search-image?query=Friendly%20young%20man%20portrait%20warm%20smile%20natural%20light%20headshot%20soft%20background&width=200&height=200&seq=avatar-2&orientation=squarish',
  avatar3: 'https://readdy.ai/api/search-image?query=Friendly%20person%20portrait%20warm%20gentle%20expression%20natural%20light%20headshot&width=200&height=200&seq=avatar-3&orientation=squarish',
  avatar4: 'https://readdy.ai/api/search-image?query=Diverse%20person%20portrait%20calm%20expression%20soft%20light%20headshot%20community&width=200&height=200&seq=avatar-4&orientation=squarish',
  circleThumb1: 'https://readdy.ai/api/search-image?query=Calm%20meditation%20circle%20icon%20soft%20blue%20gradient%20minimal%20round&width=120&height=120&seq=circle-1&orientation=squarish',
  circleThumb2: 'https://readdy.ai/api/search-image?query=Parents%20community%20icon%20warm%20soft%20gradient%20minimal%20round&width=120&height=120&seq=circle-2&orientation=squarish',
  circleThumb3: 'https://readdy.ai/api/search-image?query=Support%20group%20icon%20purple%20teal%20gradient%20minimal%20round&width=120&height=120&seq=circle-3&orientation=squarish',
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
  { id: 'c1', name: 'Anxiety Support', thumb: images.circleThumb1, hasNew: true },
  { id: 'c2', name: 'New Parents', thumb: images.circleThumb2, hasNew: true },
  { id: 'c3', name: 'Grief & Loss', thumb: images.circleThumb3, hasNew: false },
  { id: 'c4', name: 'Work Stress', thumb: images.circleThumb1, hasNew: false },
  { id: 'c5', name: 'Student Life', thumb: images.circleThumb2, hasNew: true },
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
    cover: images.coverAnxiety,
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
  { id: 'n1', title: 'New peer support resources added this week', time: '2hr' },
  { id: 'n2', title: 'Community check-in event this Saturday', time: '3hr' },
  { id: 'n3', title: 'Tips for supporting a friend in crisis', time: '5hr' },
  { id: 'n4', title: 'Anxiety Support circle reaches 2,000 members', time: '8hr' },
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
  { id: 'r1', title: 'Grounding Techniques', type: 'Article', access: 'Members', progress: 60 },
  { id: 'r2', title: 'Understanding Anxiety', type: 'Video', access: 'Paid', progress: 0 },
  { id: 'r3', title: 'Peer Support Basics', type: 'Article', access: 'Members', progress: 100 },
];

export const events = [
  { id: 'e1', title: 'Community Check-in', date: 'Aug 2, 2026', time: '6:00 PM UTC', location: 'Online — link in details', rsvp: 42 },
  { id: 'e2', title: 'Mindful Breathing Workshop', date: 'Aug 9, 2026', time: '4:00 PM UTC', location: 'Community Center, Room B', rsvp: 18 },
];
