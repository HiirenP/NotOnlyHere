'use client';

import type { AccountResponse } from '@notonlyhere/contracts';
import {
  Bell,
  Calendar,
  ChevronDown,
  Circle,
  Compass,
  Globe,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Moon,
  Search,
  Settings,
  Shield,
  Sparkles,
  Sun,
  User,
  Users,
  Video,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/AppLink';
import { iconColors, type IconColor } from '@/design/components/template';
import { FeedRightRail } from '@/design/components/social';
import { DesignNavLink } from '@/design/navigation';

const sidebarNavBase: { href: string; label: string; icon: typeof Home; color: IconColor; badgeKey?: 'messages' | 'notifications' }[] = [
  { href: '/app/feed', label: 'Feed', icon: Home, color: 'blue' },
  { href: '/app/profile', label: 'My profile', icon: User, color: 'purple' },
  { href: '/app/circles', label: 'Circles', icon: Circle, color: 'teal' },
  { href: '/app/messages', label: 'Messages', icon: MessageCircle, color: 'green', badgeKey: 'messages' },
  { href: '/app/notifications', label: 'Notifications', icon: Bell, color: 'orange', badgeKey: 'notifications' },
  { href: '/app/ava', label: 'Ava', icon: Sparkles, color: 'pink' },
  { href: '/app/events', label: 'Events', icon: Calendar, color: 'red' },
  { href: '/app/resources', label: 'Resources', icon: Video, color: 'yellow' },
  { href: '/app/explore', label: 'Explore', icon: Compass, color: 'blue' },
];

const headerNav = [
  { href: '/app/feed', label: 'Feed' },
  { href: '/app/circles', label: 'Circles' },
  { href: '/app/explore', label: 'Explore' },
  { href: '/app/ava', label: 'Ava' },
];

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { href: '/admin/analytics', label: 'Analytics', icon: Compass },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/circles', label: 'Circles', icon: Circle },
  { href: '/admin/safety', label: 'Safety alerts', icon: Shield, badge: 3 },
  { href: '/admin/content', label: 'Content', icon: Video },
  { href: '/admin/donations', label: 'Donations', icon: Settings },
  { href: '/admin/audit', label: 'Audit log', icon: Search },
];

function userInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function MemberTopHeader({ account, unreadNotifications }: { account: AccountResponse; unreadNotifications: number }) {
  const profileHref = `/app/profile/${account.username}`;
  const initials = userInitials(account.displayName);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8eaed] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1320px] mx-auto px-4 h-[70px] flex items-center gap-3 lg:gap-5">
        <AppLink href="/app/feed" className="shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[#0f6fec] flex items-center justify-center">
            <img
              src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
              alt="NotOnlyHere"
              className="h-6 brightness-0 invert"
            />
          </div>
        </AppLink>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a5b3]" />
          <DesignNavLink
            href="/app/search"
            className="w-full text-sm text-[#a1a5b3] bg-[#f5f6f8] hover:bg-[#eef0f4] rounded-lg pl-11 pr-4 py-2.5 transition-colors block"
          >
            Search...
          </DesignNavLink>
        </div>

        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {headerNav.map((item) => (
            <DesignNavLink
              key={item.href}
              href={item.href}
              className={(active) =>
                `px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  active ? 'text-[#0f6fec]' : 'text-[#676a79] hover:text-[#14191e] hover:bg-[#f5f6f8]'
                }`
              }
            >
              {item.label}
            </DesignNavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <DesignNavLink
            href="/app/messages"
            className="w-10 h-10 rounded-lg bg-[#f5f6f8] hover:bg-[#eef0f4] flex items-center justify-center text-[#676a79] transition-colors"
          >
            <MessageCircle size={18} />
          </DesignNavLink>
          <DesignNavLink
            href="/app/settings"
            className="hidden sm:flex w-10 h-10 rounded-lg bg-[#f5f6f8] hover:bg-[#eef0f4] items-center justify-center text-[#676a79] transition-colors"
          >
            <Settings size={18} />
          </DesignNavLink>
          <DesignNavLink
            href="/app/notifications"
            className="relative w-10 h-10 rounded-lg bg-[#f5f6f8] hover:bg-[#eef0f4] flex items-center justify-center text-[#676a79] transition-colors"
          >
            <Bell size={18} />
            {unreadNotifications > 0 ? (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d6293e] rounded-full border border-white" />
            ) : null}
          </DesignNavLink>
          <DesignNavLink href={profileHref} className="relative ml-1">
            <div className="w-10 h-10 rounded-full bg-[#0f6fec]/15 text-[#0f6fec] flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#0cbc87] border-2 border-white rounded-full" />
          </DesignNavLink>
        </div>
      </div>
    </header>
  );
}

function MemberLeftSidebar({
  account,
  badges,
  stats,
}: {
  account: AccountResponse;
  badges: { messages: number; notifications: number };
  stats: { posts: number; connections: number; circles: number };
}) {
  const profileHref = `/app/profile/${account.username}`;
  const initials = userInitials(account.displayName);

  return (
    <aside className="hidden lg:block w-[300px] shrink-0 space-y-4">
      <div className="bg-white border border-[#e8eaed] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="h-24 bg-gradient-to-br from-[#0f6fec]/20 to-[#6610f2]/20" />
        <div className="px-4 pb-4 -mt-8 relative z-10">
          <DesignNavLink href={profileHref}>
            <div className="w-16 h-16 rounded-lg border-[3px] border-white shadow-sm bg-[#0f6fec]/15 text-[#0f6fec] flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
          </DesignNavLink>
          <DesignNavLink href={profileHref} className="block mt-2">
            <h3 className="text-base font-bold text-[#14191e] hover:text-[#0f6fec] transition-colors">{account.displayName}</h3>
          </DesignNavLink>
          <p className="text-xs text-[#676a79] mt-0.5">@{account.username}</p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e8eaed] text-center">
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{stats.posts}</p>
              <p className="text-[10px] text-[#676a79] font-medium">Posts</p>
            </div>
            <div className="w-px h-8 bg-[#e8eaed]" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{stats.connections}</p>
              <p className="text-[10px] text-[#676a79] font-medium">Connections</p>
            </div>
            <div className="w-px h-8 bg-[#e8eaed]" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{stats.circles}</p>
              <p className="text-[10px] text-[#676a79] font-medium">Circles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <nav className="p-2">
          {sidebarNavBase.map((item) => {
            const badge = item.badgeKey ? badges[item.badgeKey] : 0;
            return (
            <DesignNavLink
              key={item.href}
              href={item.href}
              className={(active) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  active ? 'bg-[#0f6fec]/10 text-[#0f6fec]' : 'text-[#676a79] hover:bg-[#f5f6f8] hover:text-[#14191e]'
                }`
              }
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColors[item.color]}`}>
                <item.icon size={16} />
              </span>
              <span className="flex-1">{item.label}</span>
              {badge > 0 ? (
                <span className="min-w-[18px] h-[18px] px-1 bg-[#d6293e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge > 99 ? '99+' : badge}
                </span>
              ) : null}
            </DesignNavLink>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-[#e8eaed] space-y-1">
          <DesignNavLink href="/app/settings" className="flex items-center gap-2 text-sm font-semibold text-[#676a79] hover:text-[#14191e] px-1 py-1">
            <Settings size={16} /> Settings
          </DesignNavLink>
        </div>
      </div>

      <div className="px-2 text-[11px] text-[#a1a5b3] leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {['About', 'Support', 'Privacy', 'Terms'].map((link) => (
            <button key={link} type="button" className="hover:text-[#676a79] hover:underline">
              {link}
            </button>
          ))}
          <DesignNavLink href="/app/settings" className="hover:text-[#676a79] hover:underline">
            Settings
          </DesignNavLink>
        </div>
        <p className="mt-2">© 2026 NotOnlyHere</p>
      </div>
    </aside>
  );
}

type MemberShellProps = {
  children: ReactNode;
  account: AccountResponse;
  title?: string;
  showRightRail?: boolean;
  fullWidth?: boolean;
};

export function MemberShell({ children, account, showRightRail = false, fullWidth = false }: MemberShellProps) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/_ingress/, '') || '/';
  const isFeed = normalizedPath.includes('/feed');
  const profileHref = `/app/profile/${account.username}`;
  const [badges, setBadges] = useState({ messages: 0, notifications: 0 });
  const [stats, setStats] = useState({ posts: 0, connections: 0, circles: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/notifications').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/conversations').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/profile/me').then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/profiles/${encodeURIComponent(account.username)}/posts`).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/circles').then((r) => (r.ok ? r.json() : null)),
    ]).then(([notifs, convs, profile, postsData, circlesData]) => {
      setBadges({
        notifications: notifs?.unreadCount ?? 0,
        messages: Array.isArray(convs) ? convs.length : 0,
      });
      setStats({
        posts: postsData?.items?.length ?? 0,
        connections: profile?.connectionCount ?? 0,
        circles: circlesData?.items?.filter((c: { viewer: { isMember: boolean } }) => c.viewer.isMember).length ?? 0,
      });
    }).catch(() => undefined);
  }, [account.username]);

  return (
    <div className="min-h-screen bg-[#eff2f6] font-ui">
      <MemberTopHeader account={account} unreadNotifications={badges.notifications} />

      <div className="max-w-[1320px] mx-auto flex gap-4 px-4 py-4 pb-24 lg:pb-6">
        <MemberLeftSidebar account={account} badges={badges} stats={stats} />

        <div className="flex-1 flex min-w-0 gap-4">
          <div className={`flex-1 min-w-0 ${fullWidth ? '' : 'max-w-[680px]'} mx-auto`}>
            <div className="lg:hidden relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a5b3]" />
              <DesignNavLink
                href="/app/search"
                className="block w-full text-sm text-[#a1a5b3] bg-white border border-[#e8eaed] rounded-lg pl-11 pr-4 py-2.5"
              >
                Search...
              </DesignNavLink>
            </div>

            <main className="page-enter">{children}</main>
          </div>

          {(showRightRail || isFeed) && <FeedRightRail />}
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#e8eaed] px-2 py-2 grid grid-cols-5 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        {[
          { href: '/app/feed', icon: Home, label: 'Feed' },
          { href: '/app/circles', icon: Circle, label: 'Circles' },
          { href: '/app/composer', icon: Sparkles, label: 'Post' },
          { href: '/app/messages', icon: MessageCircle, label: 'Chat' },
          { href: profileHref, icon: User, label: 'Profile' },
        ].map((item) => (
          <DesignNavLink
            key={item.href}
            href={item.href}
            className={(active) =>
              `flex flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${active ? 'text-[#0f6fec]' : 'text-[#a1a5b3]'}`
            }
          >
            <item.icon size={20} />
            {item.label}
          </DesignNavLink>
        ))}
      </nav>
    </div>
  );
}

export function AdminShell({
  children,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] font-ui flex">
      <aside className="hidden lg:flex w-[260px] flex-col bg-white border-r border-[#e8eaed] shrink-0 sticky top-0 h-screen">
        <div className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f6fec] to-[#6610f2] flex items-center justify-center">
            <span className="text-white font-bold text-sm">NH</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#14191e]">NotOnlyHere</h2>
            <p className="text-[10px] text-[#a1a5b3] font-semibold uppercase tracking-wide">Admin panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {adminNav.map((item) => (
            <DesignNavLink
              key={item.href}
              href={item.href}
              end={item.end}
              className={(active) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active ? 'bg-[#0f6fec]/10 text-[#0f6fec]' : 'text-[#676a79] hover:bg-[#f5f6f8] hover:text-[#14191e]'
                }`
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="min-w-[18px] h-[18px] px-1 bg-[#d6293e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </DesignNavLink>
          ))}
        </nav>

        <div className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-[#14191e] to-[#2d3436] text-white">
          <p className="text-xs font-semibold leading-relaxed">Need advanced moderation tools?</p>
          <button type="button" className="mt-3 w-full py-2 bg-[#e91e8c] hover:bg-[#d4187d] text-white text-xs font-bold rounded-xl transition-colors">
            Upgrade plan
          </button>
        </div>

        <div className="p-4 border-t border-[#e8eaed] space-y-2">
          <button type="button" className="flex items-center gap-2 text-xs font-semibold text-[#676a79] hover:text-[#14191e] w-full px-2 py-1.5">
            <HelpCircle size={14} /> Get help
          </button>
          <button type="button" className="flex items-center gap-2 text-xs font-semibold text-[#676a79] hover:text-[#14191e] w-full px-2 py-1.5">
            <Globe size={14} /> English <ChevronDown size={12} className="ml-auto" />
          </button>
          <AppLink href="/api/auth/logout" className="flex items-center gap-2 text-xs font-semibold text-[#d6293e] hover:text-[#b82235] w-full px-2 py-1.5">
            <LogOut size={14} /> Logout
          </AppLink>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 bg-white border-b border-[#e8eaed] px-4 lg:px-6 h-[64px] flex items-center gap-4">
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a5b3]" />
            <input
              placeholder="Search admin..."
              className="w-full text-sm bg-[#f5f6f8] border border-transparent rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-[#0f6fec]/30"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" className="w-9 h-9 rounded-xl bg-[#f5f6f8] flex items-center justify-center text-[#676a79] hover:bg-[#eef0f4]">
              <Sun size={16} />
            </button>
            <button type="button" className="w-9 h-9 rounded-xl bg-[#f5f6f8] flex items-center justify-center text-[#676a79] hover:bg-[#eef0f4]">
              <Moon size={16} />
            </button>
            <DesignNavLink href="/admin/safety" className="relative w-9 h-9 rounded-xl bg-[#f5f6f8] flex items-center justify-center text-[#676a79] hover:bg-[#eef0f4]">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d6293e] rounded-full border border-white" />
            </DesignNavLink>
            <button type="button" className="w-9 h-9 rounded-xl bg-[#f5f6f8] flex items-center justify-center text-[#676a79] hover:bg-[#eef0f4]">
              <Settings size={16} />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#0f6fec]/15 text-[#0f6fec] flex items-center justify-center font-bold text-xs ml-1 ring-2 ring-[#0f6fec]/20">
              NH
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 page-enter">
          {(title || action) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                {title && <h1 className="text-xl lg:text-2xl font-bold text-[#14191e]">{title}</h1>}
                {subtitle && <p className="text-sm text-[#676a79] mt-1">{subtitle}</p>}
              </div>
              {action}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eff2f6] font-ui flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f6fec] to-[#6610f2] p-12 flex-col justify-between text-white">
        <img
          src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
          alt=""
          className="h-10 brightness-0 invert"
        />
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Real people.
            <br />
            Real connections.
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            Join a warm peer-support community. Share, connect, and find support — all in your browser.
          </p>
        </div>
        <p className="text-white/50 text-sm">© NotOnlyHere · Peer support for people 16+</p>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden px-6 py-5 flex items-center justify-between">
          <img
            src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
            alt=""
            className="h-8"
          />
          <AppLink href="/" className="text-xs font-semibold text-[#0f6fec]">
            Home
          </AppLink>
        </header>
        <main className="flex-1 flex items-center justify-center p-6 page-enter">{children}</main>
      </div>
    </div>
  );
}
