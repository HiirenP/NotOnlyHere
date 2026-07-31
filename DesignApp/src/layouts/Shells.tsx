import { NavLink, useLocation } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Circle,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Moon,
  Search,
  Settings,
  Shield,
  Sparkles,
  User,
  Users,
  Video,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { FeedRightRail } from '@/components/social';
import { currentUser } from '@/data/mock';

const memberNav = [
  { to: '/design/app/feed', label: 'Feed', icon: Home, badge: null },
  { to: '/design/app/profile', label: 'View Profile', icon: User, badge: null },
  { to: '/design/app/circles', label: 'Groups', icon: Circle, badge: null },
  { to: '/design/app/messages', label: 'Messages', icon: MessageCircle, badge: 2 },
  { to: '/design/app/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { to: '/design/app/events', label: 'Events', icon: Calendar, badge: null },
  { to: '/design/app/resources', label: 'Resources', icon: Video, badge: null },
  { to: '/design/app/ava', label: 'Ava AI', icon: Sparkles, badge: null },
  { to: '/design/app/explore', label: 'Explore', icon: Compass, badge: null },
];

const adminNav = [
  { to: '/design/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/design/admin/users', label: 'Users', icon: Users },
  { to: '/design/admin/circles', label: 'Circles', icon: Circle },
  { to: '/design/admin/safety', label: 'Safety alerts', icon: Shield },
  { to: '/design/admin/content', label: 'Content', icon: Video },
  { to: '/design/admin/donations', label: 'Donations', icon: Settings },
  { to: '/design/admin/analytics', label: 'Analytics', icon: Compass },
  { to: '/design/admin/audit', label: 'Audit log', icon: Search },
];

type MemberShellProps = {
  children: ReactNode;
  title?: string;
  showRightRail?: boolean;
  fullWidth?: boolean;
  showTopSearch?: boolean;
};

export function MemberShell({ children, showRightRail = false, fullWidth = false, showTopSearch = false }: MemberShellProps) {
  const location = useLocation();
  const isFeed = location.pathname.includes('/feed');

  return (
    <div className="min-h-screen bg-[#eff2f6] font-ui">
      <div className="max-w-[1500px] mx-auto flex">
        {/* Left sidebar — Stackbros Social */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col min-h-screen bg-white border-r border-[#e8eaed] sticky top-0">
          <div className="p-5 border-b border-[#e8eaed]">
            <NavLink to="/design/app/feed">
              <img src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png" alt="NotOnlyHere" className="h-9" />
            </NavLink>
          </div>

          <NavLink to="/design/app/profile" className="mx-4 mt-4 p-3 flex items-center gap-3 rounded-xl bg-[#f5f6f8] hover:bg-[#eef0f4] transition-colors">
            <img src={currentUser.avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-[#0f6fec]/20" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#14191e] truncate">{currentUser.displayName}</p>
              <p className="text-xs text-[#676a79] truncate">@{currentUser.username}</p>
            </div>
          </NavLink>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {memberNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-[#0f6fec]/10 text-[#0f6fec]' : 'text-[#676a79] hover:bg-[#f5f6f8] hover:text-[#14191e]'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="min-w-[20px] h-5 px-1.5 bg-[#d6293e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-[#e8eaed] space-y-1">
            <NavLink to="/design/app/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#676a79] hover:bg-[#f5f6f8] hover:text-[#14191e] transition-colors">
              <Settings size={20} />
              Settings
            </NavLink>
            <button type="button" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#676a79] hover:bg-[#f5f6f8] transition-colors">
              <Moon size={20} />
              Dark mode
            </button>
          </div>
        </aside>

        {/* Main + optional right rail */}
        <div className="flex-1 flex min-w-0">
          <div className={`flex-1 min-w-0 ${fullWidth ? '' : 'max-w-[700px]'} mx-auto px-4 py-5 pb-24 lg:pb-5`}>
            {/* Mobile top bar */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <img src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png" alt="" className="h-8" />
              <div className="flex items-center gap-2">
                <NavLink to="/design/app/notifications" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e8eaed]">
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d6293e] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
                </NavLink>
                <NavLink to="/design/app/messages" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e8eaed]">
                  <MessageCircle size={18} />
                </NavLink>
              </div>
            </div>

            {(showTopSearch || isFeed) && (
              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a5b3]" />
                <NavLink to="/design/app/search" className="block w-full text-sm text-[#a1a5b3] bg-white border border-[#e8eaed] rounded-xl pl-12 pr-4 py-3 shadow-sm hover:border-[#0f6fec]/30 transition-colors">
                  Search posts, people, groups...
                </NavLink>
              </div>
            )}

            <main className="page-enter">{children}</main>
          </div>

          {(showRightRail || isFeed) && <FeedRightRail />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#e8eaed] px-2 py-2 grid grid-cols-5 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        {[
          { to: '/design/app/feed', icon: Home, label: 'Feed' },
          { to: '/design/app/circles', icon: Circle, label: 'Groups' },
          { to: '/design/app/composer', icon: Sparkles, label: 'Post' },
          { to: '/design/app/messages', icon: MessageCircle, label: 'Chat' },
          { to: '/design/app/profile', icon: User, label: 'Profile' },
        ].map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${isActive ? 'text-[#0f6fec]' : 'text-[#a1a5b3]'}`}>
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-[#eff2f6] flex font-ui">
      <aside className="hidden md:flex w-[260px] flex-col bg-[#14191e] text-white shrink-0">
        <div className="p-5 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Admin panel</p>
          <h2 className="text-lg font-bold mt-1">NotOnlyHere</h2>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {adminNav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-[#0f6fec] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button type="button" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 p-5">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#14191e]">{title}</h1>
        </div>
        <main className="page-enter">{children}</main>
      </div>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eff2f6] font-ui flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f6fec] to-[#6610f2] p-12 flex-col justify-between text-white">
        <img src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png" alt="" className="h-10 brightness-0 invert" />
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Real people.<br />Real connections.</h2>
          <p className="text-white/80 text-lg max-w-md">Join a warm peer-support community. Share, connect, and find support — all in your browser.</p>
        </div>
        <p className="text-white/50 text-sm">© NotOnlyHere · Peer support for people 16+</p>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden px-6 py-5 flex items-center justify-between">
          <img src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png" alt="" className="h-8" />
          <NavLink to="/design" className="text-xs font-semibold text-[#0f6fec]">Design catalog</NavLink>
        </header>
        <main className="flex-1 flex items-center justify-center p-6 page-enter">{children}</main>
      </div>
    </div>
  );
}
