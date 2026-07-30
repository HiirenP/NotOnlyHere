import { NavLink } from 'react-router-dom';
import {
  Calendar,
  Circle,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { currentUser } from '@/data/mock';
import { FeedRightRail } from '@/components/social';

const memberNav = [
  { to: '/design/app/feed', label: 'Feed', icon: Home },
  { to: '/design/app/profile', label: 'Connections', icon: Users },
  { to: '/design/app/events', label: 'Events', icon: Calendar },
  { to: '/design/app/resources', label: 'Resources', icon: Video },
  { to: '/design/app/circles', label: 'Circles', icon: Circle },
  { to: '/design/app/messages', label: 'Messages', icon: MessageCircle },
];

const adminNav = [
  { to: '/design/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/design/admin/users', label: 'Users', icon: Users },
  { to: '/design/admin/circles', label: 'Circles', icon: Circle },
  { to: '/design/admin/safety', label: 'Safety alerts', icon: Shield },
  { to: '/design/admin/content', label: 'Content', icon: Sparkles },
  { to: '/design/admin/donations', label: 'Donations', icon: Settings },
  { to: '/design/admin/analytics', label: 'Analytics', icon: Compass },
  { to: '/design/admin/audit', label: 'Audit log', icon: Search },
];

type MemberShellProps = {
  children: ReactNode;
  title?: string;
  showRightRail?: boolean;
  fullWidth?: boolean;
};

export function MemberShell({ children, title, showRightRail = true, fullWidth = false }: MemberShellProps) {
  return (
    <div className="min-h-screen bg-[#EEF0F4] font-ui">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-5">
        <div className="flex gap-6">
          {/* Left sidebar — Pickbook style */}
          <aside className="hidden lg:flex w-[260px] shrink-0 flex-col sticky top-5 self-start h-[calc(100vh-40px)]">
            <NavLink to="/design/app/feed" className="flex items-center gap-2 mb-6 px-2">
              <img
                src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
                alt="NotOnlyHere"
                className="h-9 w-auto"
              />
            </NavLink>

            {/* Profile card */}
            <NavLink to="/design/app/profile" className="card-elevated p-4 mb-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <img src={currentUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-accent-200" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground-950 truncate">{currentUser.displayName}</p>
                <p className="text-xs text-foreground-500 truncate">@{currentUser.username}</p>
              </div>
            </NavLink>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
              {memberNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'nav-active-indicator bg-white text-accent-600 shadow-sm'
                        : 'text-foreground-600 hover:bg-white/70 hover:text-foreground-900'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <NavLink to="/design/app/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground-600 hover:bg-white/70 transition-colors mt-4">
              <Settings size={20} />
              Settings
            </NavLink>
          </aside>

          {/* Center column */}
          <main className={`flex-1 min-w-0 page-enter pb-20 lg:pb-0 ${fullWidth ? 'max-w-none' : 'max-w-[600px]'}`}>
            {title && <h1 className="font-display text-xl uppercase text-foreground-950 mb-4 lg:hidden">{title}</h1>}
            {children}
          </main>

          {/* Right rail */}
          {showRightRail && !fullWidth && <FeedRightRail />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-background-200 px-2 py-2 grid grid-cols-5 shadow-lg">
        {[
          { to: '/design/app/feed', icon: Home, label: 'Feed' },
          { to: '/design/app/circles', icon: Circle, label: 'Circles' },
          { to: '/design/app/composer', icon: Sparkles, label: 'Post' },
          { to: '/design/app/messages', icon: MessageCircle, label: 'Chat' },
          { to: '/design/app/profile', icon: Users, label: 'Profile' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium ${isActive ? 'text-accent-600' : 'text-foreground-500'}`
            }
          >
            <item.icon size={22} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

// Fix NavLink isActive in icon strokeWidth - that's wrong syntax. Let me fix Shells - I used isActive inside icon which is invalid.

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-background-100 flex">
      <aside className="hidden md:flex w-72 flex-col border-r border-background-300 bg-background-950 text-background-50">
        <div className="px-6 py-6 border-b border-background-800">
          <p className="font-mono text-[10px] uppercase tracking-widest text-background-400">Admin panel</p>
          <h2 className="font-display text-xl uppercase tracking-tight mt-1">NotOnlyHere</h2>
        </div>
        <nav className="flex-1 py-4">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 font-mono text-xs uppercase tracking-wider transition-colors duration-150 ${
                  isActive ? 'bg-background-800 text-background-50' : 'text-background-300 hover:bg-background-900 hover:text-background-50'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-5 border-t border-background-800">
          <button type="button" className="flex items-center gap-2 font-mono text-xs text-background-400 hover:text-background-100">
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 bg-background-50/95 backdrop-blur border-b border-background-200 px-6 py-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">Operations</p>
          <h1 className="font-display text-2xl uppercase tracking-tight text-foreground-950">{title}</h1>
        </header>
        <main className="page-enter p-6">{children}</main>
      </div>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-50 flex flex-col font-ui">
      <header className="px-6 py-5 flex items-center justify-between">
        <img
          src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
          alt="NotOnlyHere"
          className="h-8"
        />
        <NavLink to="/design" className="text-xs font-medium text-foreground-600 hover:text-accent-600 transition-colors">
          Design catalog
        </NavLink>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10 page-enter">{children}</main>
    </div>
  );
}
