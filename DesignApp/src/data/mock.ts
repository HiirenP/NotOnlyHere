export const currentUser = {
  displayName: 'Alex Morgan',
  username: 'alexm',
  avatar: null,
  bio: 'Finding calm in community. Here for peer support and honest conversations.',
  joinedAt: 'March 2025',
};

export const feedPosts = [
  {
    id: '1',
    author: 'Jordan Lee',
    anonymous: false,
    circle: 'Anxiety Support',
    time: '2h ago',
    content: 'Had a rough morning but writing it out helped. Grateful this space exists.',
    reactions: 12,
    comments: 4,
    audience: 'Circle',
  },
  {
    id: '2',
    author: 'Anonymous',
    anonymous: true,
    circle: 'Members',
    time: '4h ago',
    content: 'Does anyone else feel guilty for taking a mental health day? Trying to unlearn that.',
    reactions: 28,
    comments: 9,
    audience: 'Members',
  },
  {
    id: '3',
    author: 'Sam Rivera',
    anonymous: false,
    circle: 'New Parents',
    time: 'Yesterday',
    content: 'Small win today: asked for help instead of pushing through alone.',
    reactions: 19,
    comments: 6,
    audience: 'Connections',
  },
];

export const circles = [
  { id: 'c1', name: 'Anxiety Support', members: 842, access: 'Open', joined: true },
  { id: 'c2', name: 'New Parents', members: 516, access: 'Request', joined: true },
  { id: 'c3', name: 'Grief & Loss', members: 311, access: 'Open', joined: false },
  { id: 'c4', name: 'Work Stress', members: 690, access: 'Open', joined: false },
];

export const conversations = [
  { id: 'm1', name: 'Jordan Lee', preview: 'Thanks for checking in yesterday.', time: '10:42 AM', unread: true },
  { id: 'm2', name: 'Sam Rivera', preview: 'That resource you shared was helpful.', time: 'Yesterday', unread: false },
];

export const notifications = [
  { id: 'n1', text: 'Jordan Lee reacted to your post', time: '1h ago', unread: true },
  { id: 'n2', text: 'You were approved to join New Parents', time: '3h ago', unread: true },
  { id: 'n3', text: 'Event reminder: Community Check-in', time: 'Yesterday', unread: false },
];

export const events = [
  { id: 'e1', title: 'Community Check-in', date: 'Aug 2, 2026', time: '6:00 PM UTC', location: 'Online — link in details', rsvp: 42 },
  { id: 'e2', title: 'Mindful Breathing Workshop', date: 'Aug 9, 2026', time: '4:00 PM UTC', location: 'Community Center, Room B', rsvp: 18 },
];

export const resources = [
  { id: 'r1', title: 'Grounding Techniques', type: 'Article', access: 'Members', progress: 60 },
  { id: 'r2', title: 'Understanding Anxiety', type: 'Video', access: 'Paid', progress: 0 },
  { id: 'r3', title: 'Peer Support Basics', type: 'Article', access: 'Members', progress: 100 },
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
