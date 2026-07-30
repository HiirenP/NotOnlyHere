import { NavLink } from 'react-router-dom';
import {
  Bell,
  Circle,
  Compass,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

const memberNav = [
  { to: '/design/app/feed', label: 'Home', icon: Home },
  { to: '/design/app/circles', label: 'Circles', icon: Circle },
  { to: '/design/app/messages', label: 'Messages', icon: MessageCircle },
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

function SideLink({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors duration-150 focus-ring ${
          isActive ? 'bg-primary-50 text-primary-800 border-r-2 border-primary-500' : 'text-foreground-600 hover:bg-background-200 hover:text-foreground-900'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export function MemberShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-background-50 flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-background-200 bg-background-100/80 backdrop-blur-sm">
        <div className="px-5 py-6 border-b border-background-200">
          <img
            src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
            alt="NotOnlyHere"
            className="h-8 w-auto"
          />
        </div>
        <nav className="flex-1 py-4">
          {memberNav.map((item) => (
            <SideLink key={item.to} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t border-background-200">
          <NavLink to="/design/app/settings" className="flex items-center gap-3 px-2 py-2 text-foreground-600 hover:text-foreground-900">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-xs font-mono">AM</div>
            <div>
              <p className="font-mono text-xs text-foreground-900">Alex Morgan</p>
              <p className="font-mono text-[10px] text-foreground-500">@alexm</p>
            </div>
          </NavLink>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-background-50/95 backdrop-blur-sm border-b border-background-200 px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">Member app</p>
            <h1 className="font-display text-2xl uppercase tracking-tight text-foreground-950">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/design/app/search" className="w-11 h-11 flex items-center justify-center text-foreground-600 hover:bg-background-200 focus-ring" aria-label="Search">
              <Search size={18} />
            </NavLink>
            <NavLink to="/design/app/notifications" className="relative w-11 h-11 flex items-center justify-center text-foreground-600 hover:bg-background-200 focus-ring" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
            </NavLink>
            <NavLink to="/design/app/ava" className="hidden sm:flex w-11 h-11 items-center justify-center text-foreground-600 hover:bg-background-200 focus-ring" aria-label="Ava">
              <Sparkles size={18} />
            </NavLink>
          </div>
        </header>

        <main className="flex-1 page-enter px-4 lg:px-8 py-6 pb-24 lg:pb-8">{children}</main>

        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background-100/95 backdrop-blur border-t border-background-200 px-2 py-2 grid grid-cols-5">
          {[
            { to: '/design/app/feed', icon: Home, label: 'Home' },
            { to: '/design/app/circles', icon: Circle, label: 'Circles' },
            { to: '/design/app/composer', icon: Plus, label: 'Create' },
            { to: '/design/app/messages', icon: MessageCircle, label: 'Messages' },
            { to: '/design/app/explore', icon: Compass, label: 'Explore' },
          ].map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center gap-1 py-2 text-[10px] font-mono uppercase ${isActive ? 'text-primary-700' : 'text-foreground-500'}`}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
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
