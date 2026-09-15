import { NavLink, useLocation } from 'react-router-dom';
import {
  Bell,
  Calendar,
  ChevronDown,
  Circle,
  CircleDollarSign,
  Compass,
  Globe,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  Shield,
  Sparkles,
  User,
  UserPlus,
  Users,
  Video,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { iconColors, type IconColor } from '@/components/template';
import { FeedRightRail } from '@/components/social';
import { FoundingMemberBadge } from '@/components/social/FoundingMemberBadge';
import { currentUser } from '@/data/mock';

function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box =
    size === 'lg'
      ? 'w-16 h-16 rounded-2xl'
      : size === 'sm'
        ? 'w-8 h-8 rounded-lg'
        : 'w-10 h-10 rounded-xl';

  return (
    <div className={`${box} overflow-hidden shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.08)]`}>
      <img
        src="/favicon.png"
        alt="NotOnlyHere"
        className="w-full h-full object-cover scale-[1.95] object-center"
      />
    </div>
  );
}

const sidebarNav: { to: string; label: string; icon: typeof Home; color: IconColor; badge?: number }[] = [
  { to: '/design/app/feed', label: 'Feed', icon: Home, color: 'blue' },
  { to: '/design/app/profile', label: 'My profile', icon: User, color: 'purple' },
  { to: '/design/app/circles', label: 'Circles', icon: Circle, color: 'teal' },
  { to: '/design/app/messages', label: 'Messages', icon: MessageCircle, color: 'green', badge: 2 },
  { to: '/design/app/notifications', label: 'Notifications', icon: Bell, color: 'orange', badge: 3 },
  { to: '/design/app/ava', label: 'Ava', icon: Sparkles, color: 'pink' },
  { to: '/design/app/events', label: 'Events', icon: Calendar, color: 'red' },
  { to: '/design/app/resources', label: 'Resources', icon: Video, color: 'yellow' },
  { to: '/design/app/explore', label: 'Explore', icon: Compass, color: 'blue' },
  { to: '/design/app/invite', label: 'Invite people', icon: UserPlus, color: 'green' },
];

const headerNav = [
  { to: '/design/app/feed', label: 'Feed' },
  { to: '/design/app/circles', label: 'Circles' },
  { to: '/design/app/explore', label: 'Explore' },
  { to: '/design/app/ava', label: 'Ava' },
];

const adminNav = [
  { to: '/design/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/design/admin/analytics', label: 'Analytics', icon: Compass },
  { to: '/design/admin/users', label: 'Users', icon: Users },
  { to: '/design/admin/roles', label: 'Roles & permissions', icon: Shield },
  { to: '/design/admin/circles', label: 'Circles', icon: Circle },
  { to: '/design/admin/safety', label: 'Safety alerts', icon: Shield, badge: 3 },
  { to: '/design/admin/content', label: 'Content', icon: Video },
  { to: '/design/admin/donations', label: 'Donations', icon: CircleDollarSign },
  { to: '/design/admin/audit', label: 'Audit log', icon: Search },
];

function MemberTopHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8eaed] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1320px] mx-auto px-4 h-[70px] flex items-center gap-3 lg:gap-5">
        <NavLink to="/design/app/feed" className="shrink-0">
          <BrandLogo />
        </NavLink>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a5b3]" />
          <NavLink
            to="/design/app/search"
            className="w-full text-sm text-[#a1a5b3] bg-[#f5f6f8] hover:bg-[#eef0f4] rounded-lg pl-11 pr-4 py-2.5 transition-colors"
          >
            Search...
          </NavLink>
        </div>

        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {headerNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive ? 'text-[#0f6fec]' : 'text-[#676a79] hover:text-[#14191e] hover:bg-[#f5f6f8]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <NavLink
            to="/design/app/messages"
            className="w-10 h-10 rounded-lg bg-[#f5f6f8] hover:bg-[#eef0f4] flex items-center justify-center text-[#676a79] transition-colors"
          >
            <MessageCircle size={18} />
          </NavLink>
          <NavLink
            to="/design/app/settings"
            className="hidden sm:flex w-10 h-10 rounded-lg bg-[#f5f6f8] hover:bg-[#eef0f4] items-center justify-center text-[#676a79] transition-colors"
          >
            <Settings size={18} />
          </NavLink>
          <NavLink
            to="/design/app/notifications"
            className="relative w-10 h-10 rounded-lg bg-[#f5f6f8] hover:bg-[#eef0f4] flex items-center justify-center text-[#676a79] transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d6293e] rounded-full border border-white" />
          </NavLink>
          <NavLink to="/design/app/profile" className="relative ml-1">
            <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#0cbc87] border-2 border-white rounded-full" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}

function MemberLeftSidebar() {
  return (
    <aside className="hidden lg:block w-[300px] shrink-0 space-y-4">
      {/* Profile card */}
      <div className="bg-white border border-[#e8eaed] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${currentUser.cover})` }} />
        <div className="px-4 pb-4 -mt-8 relative z-10">
          <NavLink to="/design/app/profile">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-16 h-16 rounded-lg border-[3px] border-white object-cover object-[center_20%] shadow-sm bg-white"
            />
          </NavLink>
          <NavLink to="/design/app/profile" className="block mt-2">
            <span className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#14191e] hover:text-[#0f6fec] transition-colors">{currentUser.displayName}</h3>
              {currentUser.foundingMember && <FoundingMemberBadge compact />}
            </span>
          </NavLink>
          <p className="text-xs text-[#676a79] mt-0.5">{currentUser.title}</p>
          <p className="text-xs text-[#676a79] mt-2 leading-relaxed line-clamp-2">{currentUser.bio}</p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e8eaed] text-center">
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{currentUser.supportGiven}</p>
              <p className="text-[10px] text-[#676a79] font-medium leading-tight">Support<br />Given</p>
            </div>
            <div className="w-px h-8 bg-[#e8eaed]" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{currentUser.kindResponses}</p>
              <p className="text-[10px] text-[#676a79] font-medium leading-tight">Kind<br />Responses</p>
            </div>
            <div className="w-px h-8 bg-[#e8eaed]" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{currentUser.circlesJoined}</p>
              <p className="text-[10px] text-[#676a79] font-medium leading-tight">Circles<br />Joined</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav card */}
      <div className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <nav className="p-2">
          {sidebarNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                    isActive ? 'bg-[#0f6fec]/10 text-[#0f6fec]' : 'text-[#676a79] hover:bg-[#f5f6f8] hover:text-[#14191e]'
                  }`
                }
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColors[item.color]}`}>
                  <item.icon size={16} />
                </span>
                <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="min-w-[18px] h-[18px] px-1 bg-[#d6293e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-[#e8eaed] space-y-1">
          <NavLink to="/design/app/settings" className="flex items-center gap-2 text-sm font-semibold text-[#676a79] hover:text-[#14191e] px-1 py-1">
            <Settings size={16} /> Settings
          </NavLink>
        </div>
      </div>

      {/* Footer links */}
      <div className="px-2 text-[11px] text-[#a1a5b3] leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {['About', 'Support', 'Privacy', 'Terms'].map((link) => (
            <button key={link} type="button" className="hover:text-[#676a79] hover:underline">
              {link}
            </button>
          ))}
          <NavLink to="/design/app/settings" className="hover:text-[#676a79] hover:underline">
            Settings
          </NavLink>
        </div>
        <p className="mt-2">© 2026 NotOnlyHere</p>
      </div>
    </aside>
  );
}

type MemberShellProps = {
  children: ReactNode;
  title?: string;
  showRightRail?: boolean;
  fullWidth?: boolean;
  showTopSearch?: boolean;
};

export function MemberShell({ children, showRightRail = false, fullWidth = false }: MemberShellProps) {
  const location = useLocation();
  const isFeed = location.pathname.includes('/feed');

  return (
    <div className="min-h-screen bg-[#eff2f6] font-ui">
      <MemberTopHeader />

      <div className="max-w-[1320px] mx-auto flex gap-4 px-4 py-4 pb-24 lg:pb-6">
        <MemberLeftSidebar />

        <div className="flex-1 flex min-w-0 gap-4">
          <div className={`flex-1 min-w-0 ${fullWidth ? '' : 'max-w-[680px]'} mx-auto`}>
            {/* Mobile search */}
            <div className="lg:hidden relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a5b3]" />
              <NavLink
                to="/design/app/search"
                className="block w-full text-sm text-[#a1a5b3] bg-white border border-[#e8eaed] rounded-lg pl-11 pr-4 py-2.5"
              >
                Search...
              </NavLink>
            </div>

            <main className="page-enter">{children}</main>
          </div>

          {(showRightRail || isFeed) && <FeedRightRail />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#e8eaed] px-2 py-2 grid grid-cols-5 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        {[
          { to: '/design/app/feed', icon: Home, label: 'Feed' },
          { to: '/design/app/circles', icon: Circle, label: 'Circles' },
          { to: '/design/app/composer', icon: Sparkles, label: 'Post' },
          { to: '/design/app/messages', icon: MessageCircle, label: 'Chat' },
          { to: '/design/app/profile', icon: User, label: 'Profile' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${isActive ? 'text-[#0f6fec]' : 'text-[#a1a5b3]'}`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function AdminShell({ children, title, subtitle, action }: { children: ReactNode; title?: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] font-ui flex">
      {/* Light sidebar — modern admin */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-white border-r border-[#e8eaed] shrink-0 sticky top-0 h-screen">
        <div className="p-5 flex items-center gap-3">
          <BrandLogo />
          <div>
            <h2 className="text-base font-bold" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 35%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>NotOnlyHere</h2>
            <p className="text-[10px] text-[#a1a5b3] font-semibold uppercase tracking-wide">Admin panel</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[#0f6fec]/10 text-[#0f6fec]' : 'text-[#676a79] hover:bg-[#f5f6f8] hover:text-[#14191e]'
                }`
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="min-w-[18px] h-[18px] px-1 bg-[#d6293e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#e8eaed] space-y-2">
          <button type="button" className="flex items-center gap-2 text-xs font-semibold text-[#676a79] hover:text-[#14191e] w-full px-2 py-1.5">
            <Globe size={14} /> English <ChevronDown size={12} className="ml-auto" />
          </button>
          <button type="button" className="flex items-center gap-2 text-xs font-semibold text-[#d6293e] hover:text-[#b82235] w-full px-2 py-1.5">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-[#e8eaed] px-4 lg:px-6 h-[64px] flex items-center gap-4">
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a5b3]" />
            <input
              placeholder="Search admin..."
              className="w-full text-sm bg-[#f5f6f8] border border-transparent rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-[#0f6fec]/30"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <NavLink to="/design/admin/safety" className="relative w-9 h-9 rounded-xl bg-[#f5f6f8] flex items-center justify-center text-[#676a79] hover:bg-[#eef0f4]">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d6293e] rounded-full border border-white" />
            </NavLink>
            <button type="button" className="w-9 h-9 rounded-xl bg-[#f5f6f8] flex items-center justify-center text-[#676a79] hover:bg-[#eef0f4]">
              <Settings size={16} />
            </button>
            <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#0f6fec]/20 ml-1" />
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
        <BrandLogo size="lg" />
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
          <BrandLogo />
          <NavLink to="/design" className="text-xs font-semibold text-[#0f6fec]">
            Design catalog
          </NavLink>
        </header>
        <main className="flex-1 flex items-center justify-center p-6 page-enter">{children}</main>
      </div>
    </div>
  );
}
