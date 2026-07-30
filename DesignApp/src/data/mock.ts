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

export const upcomingEvents = [
  { title: 'Community Check-in', date: 'Aug 2', time: '6:00 PM', attendees: 42 },
  { title: 'Mindful Breathing', date: 'Aug 9', time: '4:00 PM', attendees: 18 },
];

export const currentUser = {
  displayName: 'Alex Morgan',
  username: 'alexm',
  avatar: images.avatar1,
  cover: images.profileCover,
  bio: 'Finding calm in community. Here for peer support and honest conversations.',
  joinedAt: 'March 2025',
  connections: 48,
  circles: 6,
};

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
  { id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', status: 'Active', role: 'Member' },
  { id: 'u2', name: 'Jordan Lee', email: 'jordan@example.com', status: 'Suspended', role: 'Member' },
  { id: 'u3', name: 'Staff User', email: 'staff@notonlyhere.com', status: 'Active', role: 'Staff' },
];

export const safetyAlerts = [
  { id: 'a1', type: 'Policy concern', confidence: 'Medium', status: 'New', excerpt: 'Post in Anxiety Support may violate guidelines…' },
  { id: 'a2', type: 'Harassment signal', confidence: 'Low', status: 'In review', excerpt: 'Comment thread flagged for review…' },
];

export const donations = [
  { id: 'd1', donor: 'Member #1042', amount: '$25.00', cadence: 'Monthly', status: 'Succeeded' },
  { id: 'd2', donor: 'Member #883', amount: '$10.00', cadence: 'One-time', status: 'Pending' },
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
