import Link from 'next/link';
import { LayoutDashboard, Users, Circle, Shield, Compass } from 'lucide-react';

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const nav = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin', label: 'Users', icon: Users },
    { href: '/admin', label: 'Circles', icon: Circle },
    { href: '/admin', label: 'Safety', icon: Shield },
    { href: '/admin', label: 'Analytics', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-background-100 flex">
      <aside className="hidden md:flex w-72 flex-col bg-background-950 text-background-50">
        <div className="px-6 py-6 border-b border-background-800">
          <p className="font-mono text-[10px] uppercase tracking-widest text-background-400">Admin panel</p>
          <h2 className="font-display text-xl uppercase mt-1">NotOnlyHere</h2>
        </div>
        <nav className="flex-1 py-4">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-5 py-3 font-mono text-xs uppercase tracking-wider text-background-300 hover:bg-background-900">
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-5 border-t border-background-800">
          <Link href="/app" className="font-mono text-xs text-background-400 hover:text-background-100">Back to member app</Link>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 bg-background-50/95 border-b border-background-200 px-6 py-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">Operations</p>
          <h1 className="font-display text-2xl uppercase">{title}</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
