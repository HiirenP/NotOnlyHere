import { NavLink, useLocation } from 'react-router-dom';
import {
  Bell,
  Calendar,
  ChevronDown,
  Circle,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Newspaper,
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

const sidebarNav = [
  { to: '/design/app/feed', label: 'Feed', icon: Home },
  { to: '/design/app/profile', label: 'Connections', icon: Users },
  { to: '/design/app/explore', label: 'Latest news', icon: Newspaper },
  { to: '/design/app/events', label: 'Events', icon: Calendar },
  { to: '/design/app/circles', label: 'Groups', icon: Circle },
  { to: '/design/app/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { to: '/design/app/settings', label: 'Settings', icon: Settings },
];

const headerNav = [
  { to: '/design/app/feed', label: 'Feed' },
  { to: '/design/app/circles', label: 'Groups' },
  { to: '/design/app/explore', label: 'Explore' },
  { to: '/design/app/resources', label: 'Resources' },
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

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

function MemberTopHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8eaed] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1320px] mx-auto px-4 h-[70px] flex items-center gap-3 lg:gap-5">
        <NavLink to="/design/app/feed" className="shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[#0f6fec] flex items-center justify-center">
            <img
              src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
              alt="NotOnlyHere"
              className="h-6 brightness-0 invert"
            />
          </div>
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
                `flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive ? 'text-[#0f6fec]' : 'text-[#676a79] hover:text-[#14191e] hover:bg-[#f5f6f8]'
                }`
              }
            >
              {item.label}
              <ChevronDown size={14} className="opacity-50" />
            </NavLink>
          ))}
          <NavLink
            to="/design/app/profile"
            className="px-3 py-2 text-sm font-semibold text-[#676a79] hover:text-[#14191e] hover:bg-[#f5f6f8] rounded-lg transition-colors"
          >
            My network
          </NavLink>
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
        <div className="px-4 pb-4 -mt-8">
          <NavLink to="/design/app/profile">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-16 h-16 rounded-lg border-[3px] border-white object-cover shadow-sm"
            />
          </NavLink>
          <NavLink to="/design/app/profile" className="block mt-2">
            <h3 className="text-base font-bold text-[#14191e] hover:text-[#0f6fec] transition-colors">{currentUser.displayName}</h3>
          </NavLink>
          <p className="text-xs text-[#676a79] mt-0.5">{currentUser.title}</p>
          <p className="text-xs text-[#676a79] mt-2 leading-relaxed line-clamp-2">{currentUser.bio}</p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e8eaed] text-center">
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{currentUser.posts}</p>
              <p className="text-[10px] text-[#676a79] font-medium">Post</p>
            </div>
            <div className="w-px h-8 bg-[#e8eaed]" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{formatCount(currentUser.followers)}</p>
              <p className="text-[10px] text-[#676a79] font-medium">Followers</p>
            </div>
            <div className="w-px h-8 bg-[#e8eaed]" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14191e]">{currentUser.following}</p>
              <p className="text-[10px] text-[#676a79] font-medium">Following</p>
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
        <div className="px-4 py-3 border-t border-[#e8eaed]">
          <NavLink to="/design/app/profile" className="text-sm font-semibold text-[#0f6fec] hover:underline">
            View Profile
          </NavLink>
        </div>
      </div>

      {/* Footer links */}
      <div className="px-2 text-[11px] text-[#a1a5b3] leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {['About', 'Settings', 'Support', 'Privacy', 'Terms'].map((link) => (
            <button key={link} type="button" className="hover:text-[#676a79] hover:underline">
              {link}
            </button>
          ))}
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
          { to: '/design/app/circles', icon: Circle, label: 'Groups' },
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
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[#0f6fec] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
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
          <NavLink to="/design" className="text-xs font-semibold text-[#0f6fec]">
            Design catalog
          </NavLink>
        </header>
        <main className="flex-1 flex items-center justify-center p-6 page-enter">{children}</main>
      </div>
    </div>
  );
}
