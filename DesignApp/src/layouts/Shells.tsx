import { NavLink } from 'react-router-dom';
import {
  Bell,
  Circle,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { currentUser } from '@/data/mock';
import { FeedRightRail } from '@/components/social';

const memberNav = [
  { to: '/design/app/feed', label: 'Home', icon: Home },
  { to: '/design/app/circles', label: 'Circles', icon: Circle },
  { to: '/design/app/messages', label: 'Messages', icon: MessageCircle },
  { to: '/design/app/ava', label: 'Ava', icon: Sparkles },
  { to: '/design/app/explore', label: 'Explore', icon: Compass },
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
    <div className="min-h-screen bg-background-200/40">
      {/* Top bar — Facebook style */}
      <header className="sticky top-0 z-50 bg-background-100/95 backdrop-blur-md border-b border-background-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center gap-4">
          <NavLink to="/design/app/feed" className="shrink-0">
            <img
              src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
              alt="NotOnlyHere"
              className="h-8 w-auto"
            />
          </NavLink>

          {/* Search bar */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-400" />
              <NavLink
                to="/design/app/search"
                className="block w-full font-mono text-sm text-foreground-500 bg-background-200/70 hover:bg-background-200 rounded-full pl-11 pr-4 py-2.5 transition-colors"
              >
                Search NotOnlyHere
              </NavLink>
            </div>
          </div>

          {/* Center nav icons — desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-md">
            {memberNav.slice(0, 5).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center justify-center w-14 h-12 rounded-xl transition-colors ${
                    isActive ? 'text-primary-600 bg-primary-50' : 'text-foreground-500 hover:bg-background-200'
                  }`
                }
                title={item.label}
              >
                <item.icon size={22} />
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            <NavLink to="/design/app/composer" className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-background-200 hover:bg-background-300 transition-colors" aria-label="Create">
              <Plus size={20} />
            </NavLink>
            <NavLink to="/design/app/notifications" className="relative w-10 h-10 flex items-center justify-center rounded-full bg-background-200 hover:bg-background-300 transition-colors" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-background-50 text-[10px] font-mono rounded-full flex items-center justify-center">3</span>
            </NavLink>
            <NavLink to="/design/app/settings" className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-background-200 hover:ring-primary-300 transition-all" aria-label="Profile">
              <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
            </NavLink>
            <button type="button" className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-background-200" aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className={`flex gap-6 ${fullWidth ? '' : 'justify-center'}`}>
          {/* Left sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-20 self-start space-y-2">
            <NavLink to="/design/app/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-background-100 transition-colors">
              <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-mono text-sm text-foreground-900">{currentUser.displayName}</span>
            </NavLink>
            {memberNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2.5 rounded-xl font-mono text-sm transition-colors ${
                    isActive ? 'bg-background-100 text-primary-700 shadow-sm' : 'text-foreground-700 hover:bg-background-100'
                  }`
                }
              >
                <item.icon size={20} className={item.to.includes('ava') ? 'text-accent-600' : ''} />
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-background-300 mt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 px-2 mb-2">Shortcuts</p>
              {['Anxiety Support', 'New Parents', 'Work Stress'].map((name) => (
                <NavLink key={name} to="/design/app/circles/detail" className="flex items-center gap-3 p-2 rounded-xl hover:bg-background-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-300 to-accent-400" />
                  <span className="font-mono text-xs text-foreground-700 truncate">{name}</span>
                </NavLink>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className={`flex-1 min-w-0 page-enter ${fullWidth ? 'max-w-none' : 'max-w-[680px]'}`}>
            {title && (
              <h1 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-4 lg:hidden">{title}</h1>
            )}
            {children}
          </main>

          {/* Right rail */}
          {showRightRail && !fullWidth && <FeedRightRail />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background-100/95 backdrop-blur border-t border-background-200 px-2 py-1.5 grid grid-cols-5 safe-area-pb">
        {[
          { to: '/design/app/feed', icon: Home, label: 'Home' },
          { to: '/design/app/circles', icon: Circle, label: 'Circles' },
          { to: '/design/app/composer', icon: Plus, label: 'Create' },
          { to: '/design/app/messages', icon: MessageCircle, label: 'Chat' },
          { to: '/design/app/profile', icon: Users, label: 'Profile' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[10px] font-mono uppercase ${
                isActive ? 'text-primary-600' : 'text-foreground-500'
              }`
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
    <div className="min-h-screen bg-background-50 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <img
          src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
          alt="NotOnlyHere"
          className="h-8"
        />
        <NavLink to="/design" className="font-mono text-xs uppercase tracking-widest text-foreground-600 hover:gradient-text">
          Design catalog
        </NavLink>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10 page-enter">{children}</main>
    </div>
  );
}
