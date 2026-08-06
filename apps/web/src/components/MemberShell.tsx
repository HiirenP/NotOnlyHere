'use client';

import type { AccountResponse } from '@notonlyhere/contracts';
import { Bell, BookOpen, Bot, Calendar, Circle, Compass, Heart, Home, MessageCircle, Plus } from 'lucide-react';
import { AppLink } from '@/components/AppLink';

export function MemberShell({
  children,
  title,
  account,
}: {
  children: React.ReactNode;
  title: string;
  account: AccountResponse;
}) {
  const initials = account.displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background-50 flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-background-200 bg-background-100/80">
        <div className="px-5 py-6 border-b border-background-200">
          <AppLink href="/" className="font-display text-xl uppercase">NotOnlyHere</AppLink>
        </div>
        <nav className="flex-1 py-4 font-mono text-xs uppercase tracking-wider">
          {[
            { href: '/app/feed', label: 'Feed', icon: Home },
            { href: '/app/circles', label: 'Circles', icon: Circle },
            { href: '/app/notifications', label: 'Notifications', icon: Bell },
            { href: '/app/wellness', label: 'Wellness', icon: Heart },
            { href: '/app/events', label: 'Events', icon: Calendar },
            { href: '/app/ava', label: 'Ava', icon: Bot },
            { href: '/app/resources', label: 'Resources', icon: BookOpen },
            { href: `/app/profile/${account.username}`, label: 'Profile', icon: Compass },
            { href: '/app/settings/connections', label: 'Connections', icon: MessageCircle },
            { href: '/app/settings/data', label: 'Your data', icon: Plus },
          ].map((item) => (
            <AppLink key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 text-foreground-600 hover:bg-background-200">
              <item.icon size={18} /> {item.label}
            </AppLink>
          ))}
        </nav>
        <div className="p-4 border-t border-background-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-800 flex items-center justify-center text-xs">{initials}</div>
          <div>
            <p className="font-mono text-xs">{account.displayName}</p>
            <p className="font-mono text-[10px] text-foreground-500">@{account.username}</p>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 bg-background-50/95 border-b border-background-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">Member app</p>
            <h1 className="font-display text-2xl uppercase">{title}</h1>
          </div>
          <button type="button" className="w-11 h-11 flex items-center justify-center" aria-label="Notifications">
            <Bell size={18} />
          </button>
        </header>
        <main className="px-4 lg:px-8 py-6 pb-24 lg:pb-8">{children}</main>
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-background-100 border-t border-background-200 grid grid-cols-5 py-2">
          {[Home, Circle, Plus, MessageCircle, Compass].map((Icon, index) => (
            <AppLink key={index} href="/app" className="flex flex-col items-center gap-1 py-2 text-[10px] font-mono uppercase text-foreground-500">
              <Icon size={18} />
              Nav
            </AppLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
