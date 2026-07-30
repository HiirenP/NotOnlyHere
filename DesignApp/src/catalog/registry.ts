export type ScreenEntry = {
  id: string;
  title: string;
  path: string;
  batch: string;
  surface: 'auth' | 'member' | 'admin';
  prdRefs?: string[];
};

export const designScreens: ScreenEntry[] = [
  { id: 'login', title: 'Login', path: '/design/auth/login', batch: '1 — Foundation', surface: 'auth', prdRefs: ['AUTH-02'] },
  { id: 'register', title: 'Register', path: '/design/auth/register', batch: '1 — Foundation', surface: 'auth', prdRefs: ['AUTH-01'] },
  { id: 'verify', title: 'Verify email', path: '/design/auth/verify-email', batch: '1 — Foundation', surface: 'auth', prdRefs: ['AUTH-03'] },
  { id: 'forgot', title: 'Forgot password', path: '/design/auth/forgot-password', batch: '1 — Foundation', surface: 'auth', prdRefs: ['AUTH-04'] },
  { id: 'feed', title: 'Feed', path: '/design/app/feed', batch: '2 — Community', surface: 'member', prdRefs: ['FEED-01'] },
  { id: 'composer', title: 'Post composer', path: '/design/app/composer', batch: '2 — Community', surface: 'member', prdRefs: ['FEED-02', 'ANON-01'] },
  { id: 'post', title: 'Post detail', path: '/design/app/post', batch: '2 — Community', surface: 'member', prdRefs: ['FEED-03'] },
  { id: 'search', title: 'Search', path: '/design/app/search', batch: '2 — Community', surface: 'member', prdRefs: ['SRCH-01'] },
  { id: 'circles', title: 'Circle directory', path: '/design/app/circles', batch: '3 — People & circles', surface: 'member', prdRefs: ['CIRC-01'] },
  { id: 'circle-detail', title: 'Circle detail', path: '/design/app/circles/detail', batch: '3 — People & circles', surface: 'member', prdRefs: ['CIRC-02'] },
  { id: 'profile', title: 'Profile', path: '/design/app/profile', batch: '3 — People & circles', surface: 'member', prdRefs: ['PROF-01'] },
  { id: 'messages', title: 'Messages', path: '/design/app/messages', batch: '4 — Communication', surface: 'member', prdRefs: ['MSG-01'] },
  { id: 'notifications', title: 'Notifications', path: '/design/app/notifications', batch: '4 — Communication', surface: 'member', prdRefs: ['NOTIF-01'] },
  { id: 'ava', title: 'Ava AI', path: '/design/app/ava', batch: '5 — Support tools', surface: 'member', prdRefs: ['AI-01'] },
  { id: 'mood', title: 'Mood check-in', path: '/design/app/mood', batch: '5 — Support tools', surface: 'member', prdRefs: ['WELL-01'] },
  { id: 'events', title: 'Events', path: '/design/app/events', batch: '5 — Support tools', surface: 'member', prdRefs: ['EVENT-01'] },
  { id: 'resources', title: 'Resources', path: '/design/app/resources', batch: '6 — Content & payments', surface: 'member', prdRefs: ['RES-01'] },
  { id: 'explore', title: 'Explore hub', path: '/design/app/explore', batch: '6 — Content & payments', surface: 'member' },
  { id: 'settings', title: 'Settings', path: '/design/app/settings', batch: '7 — Settings', surface: 'member', prdRefs: ['SET-01', 'GDPR-01'] },
  { id: 'admin-dashboard', title: 'Admin dashboard', path: '/design/admin', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-01'] },
  { id: 'admin-users', title: 'Admin users', path: '/design/admin/users', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-02'] },
  { id: 'admin-user-detail', title: 'Admin user detail', path: '/design/admin/users/detail', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-03'] },
  { id: 'admin-circles', title: 'Admin circles', path: '/design/admin/circles', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-04'] },
  { id: 'admin-safety', title: 'Safety alerts', path: '/design/admin/safety', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-05'] },
  { id: 'admin-content', title: 'Content management', path: '/design/admin/content', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-06'] },
  { id: 'admin-donations', title: 'Donations', path: '/design/admin/donations', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-07'] },
  { id: 'admin-analytics', title: 'Analytics', path: '/design/admin/analytics', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-08'] },
  { id: 'admin-audit', title: 'Audit log', path: '/design/admin/audit', batch: '8 — Admin', surface: 'admin', prdRefs: ['ADM-09'] },
];

export const designBatches = [
  '1 — Foundation',
  '2 — Community',
  '3 — People & circles',
  '4 — Communication',
  '5 — Support tools',
  '6 — Content & payments',
  '7 — Settings',
  '8 — Admin',
] as const;
