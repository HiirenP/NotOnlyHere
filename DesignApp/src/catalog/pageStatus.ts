export type PageDesignStatus = 'complete' | 'in-progress' | 'pending';

export type PageStatusEntry = {
  id: string;
  title: string;
  path: string;
  surface: 'catalog' | 'auth' | 'member' | 'admin';
  status: PageDesignStatus;
  reference: string;
};

/** Live tracker — update status as pages are redesigned */
export const pageDesignStatus: PageStatusEntry[] = [
  { id: 'catalog', title: 'Design catalog', path: '/design', surface: 'catalog', status: 'complete', reference: 'Stackbros Social' },
  { id: 'login', title: 'Login', path: '/design/auth/login', surface: 'auth', status: 'complete', reference: 'Stackbros Auth' },
  { id: 'register', title: 'Register', path: '/design/auth/register', surface: 'auth', status: 'complete', reference: 'Stackbros Auth' },
  { id: 'verify', title: 'Verify email', path: '/design/auth/verify-email', surface: 'auth', status: 'complete', reference: 'Stackbros Auth' },
  { id: 'forgot', title: 'Forgot password', path: '/design/auth/forgot-password', surface: 'auth', status: 'complete', reference: 'Stackbros Auth' },
  { id: 'onboarding', title: 'Welcome onboarding', path: '/design/app/onboarding', surface: 'member', status: 'complete', reference: 'NotOnlyHere onboarding' },
  { id: 'feed', title: 'Feed', path: '/design/app/feed', surface: 'member', status: 'complete', reference: 'Stackbros Home/Feed' },
  { id: 'composer', title: 'Post composer', path: '/design/app/composer', surface: 'member', status: 'complete', reference: 'Stackbros Create Post' },
  { id: 'post', title: 'Post detail', path: '/design/app/post', surface: 'member', status: 'complete', reference: 'Stackbros Post Detail' },
  { id: 'search', title: 'Search', path: '/design/app/search', surface: 'member', status: 'complete', reference: 'Stackbros Search' },
  { id: 'circles', title: 'Circle directory', path: '/design/app/circles', surface: 'member', status: 'complete', reference: 'Stackbros Groups' },
  { id: 'circle-detail', title: 'Circle detail', path: '/design/app/circles/detail', surface: 'member', status: 'complete', reference: 'Stackbros Group Detail' },
  { id: 'profile', title: 'Profile', path: '/design/app/profile', surface: 'member', status: 'complete', reference: 'Stackbros Profile' },
  { id: 'invite', title: 'Invite people', path: '/design/app/invite', surface: 'member', status: 'complete', reference: 'Referral sharing' },
  { id: 'messages', title: 'Messages', path: '/design/app/messages', surface: 'member', status: 'complete', reference: 'Stackbros Messaging' },
  { id: 'notifications', title: 'Notifications', path: '/design/app/notifications', surface: 'member', status: 'complete', reference: 'Stackbros Notifications' },
  { id: 'ava', title: 'Ava AI', path: '/design/app/ava', surface: 'member', status: 'complete', reference: 'Stackbros Chat' },
  { id: 'mood', title: 'Mood check-in', path: '/design/app/mood', surface: 'member', status: 'complete', reference: 'Stackbros Activity' },
  { id: 'events', title: 'Events', path: '/design/app/events', surface: 'member', status: 'complete', reference: 'Stackbros Events' },
  { id: 'resources', title: 'Resources', path: '/design/app/resources', surface: 'member', status: 'complete', reference: 'Stackbros Marketplace' },
  { id: 'explore', title: 'Explore hub', path: '/design/app/explore', surface: 'member', status: 'complete', reference: 'Stackbros Discover' },
  { id: 'settings', title: 'Settings', path: '/design/app/settings', surface: 'member', status: 'complete', reference: 'Stackbros Settings' },
  { id: 'admin-dashboard', title: 'Admin dashboard', path: '/design/admin', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-users', title: 'Admin users', path: '/design/admin/users', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-roles', title: 'Roles & permissions', path: '/design/admin/roles', surface: 'admin', status: 'complete', reference: 'RBAC admin' },
  { id: 'admin-user-detail', title: 'Admin user detail', path: '/design/admin/users/detail', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-circles', title: 'Admin circles', path: '/design/admin/circles', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-safety', title: 'Safety alerts', path: '/design/admin/safety', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-content', title: 'Content management', path: '/design/admin/content', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-donations', title: 'Donations', path: '/design/admin/donations', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-analytics', title: 'Analytics', path: '/design/admin/analytics', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
  { id: 'admin-audit', title: 'Audit log', path: '/design/admin/audit', surface: 'admin', status: 'complete', reference: 'Stackbros Admin' },
];

export function getStatusCounts() {
  const complete = pageDesignStatus.filter((p) => p.status === 'complete').length;
  const pending = pageDesignStatus.filter((p) => p.status === 'pending').length;
  const inProgress = pageDesignStatus.filter((p) => p.status === 'in-progress').length;
  return { complete, pending, inProgress, total: pageDesignStatus.length };
}
