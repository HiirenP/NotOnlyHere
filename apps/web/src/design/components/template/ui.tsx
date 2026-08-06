import type { ReactNode } from 'react';
import { cn } from '@/design/design-system/utils';

export function TCard({ children, className, padding = true }: { children: ReactNode; className?: string; padding?: boolean }) {
  return (
    <div className={cn('bg-white border border-[#e8eaed] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]', padding && 'p-4', className)}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-bold text-[#14191e]">{title}</h1>
        {subtitle && <p className="text-sm text-[#676a79] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function TBtn({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'soft' | 'outline' | 'danger'; size?: 'sm' | 'md' }) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  const variants = {
    primary: 'bg-[#0f6fec] hover:bg-[#0d5ed4] text-white border-transparent',
    soft: 'bg-[#0f6fec]/10 hover:bg-[#0f6fec]/15 text-[#0f6fec] border-transparent',
    outline: 'bg-white hover:bg-[#f5f6f8] text-[#676a79] border-[#e8eaed]',
    danger: 'bg-[#d6293e]/10 hover:bg-[#d6293e]/15 text-[#d6293e] border-transparent',
  };
  return (
    <button className={cn('font-semibold rounded-lg border transition-colors', sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function TBadge({ children, color = 'primary' }: { children: ReactNode; color?: 'primary' | 'success' | 'warning' | 'danger' | 'muted' }) {
  const colors = {
    primary: 'bg-[#0f6fec]/10 text-[#0f6fec]',
    success: 'bg-[#0cbc87]/10 text-[#0cbc87]',
    warning: 'bg-[#f7c32e]/15 text-[#c9a000]',
    danger: 'bg-[#d6293e]/10 text-[#d6293e]',
    muted: 'bg-[#f5f6f8] text-[#676a79]',
  };
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold', colors[color])}>{children}</span>;
}

export function TAvatar({ src, name, size = 'md', online }: { src?: string; name: string; size?: 'sm' | 'md' | 'lg'; online?: boolean }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
  const initials = name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="relative shrink-0">
      {src ? (
        <img src={src} alt="" className={cn('rounded-full object-cover', sizes[size])} />
      ) : (
        <div className={cn('rounded-full bg-[#0f6fec]/15 text-[#0f6fec] flex items-center justify-center font-bold text-xs', sizes[size])}>{initials}</div>
      )}
      {online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#0cbc87] border-2 border-white rounded-full" />}
    </div>
  );
}

export function TSearch({
  placeholder,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { placeholder?: string; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a5b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        className="w-full text-sm text-[#14191e] bg-[#f5f6f8] border border-transparent rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:bg-white focus:border-[#0f6fec]/30 focus:ring-2 focus:ring-[#0f6fec]/10"
        placeholder={placeholder ?? 'Search...'}
        {...props}
      />
    </div>
  );
}

export function TTabs({ tabs, active, onChange, className }: { tabs: { id: string; label: string }[]; active: string; onChange?: (id: string) => void; className?: string }) {
  return (
    <div className={cn('flex gap-1 border-b border-[#e8eaed] overflow-x-auto', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange?.(tab.id)}
          className={cn(
            'px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
            active === tab.id ? 'text-[#0f6fec]' : 'text-[#676a79] hover:text-[#14191e]',
          )}
        >
          <span
            className={cn(
              'inline-block border-b-2 pb-3 -mb-3',
              active === tab.id ? 'border-[#0f6fec]' : 'border-transparent',
            )}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export function TListItem({
  avatar,
  title,
  subtitle,
  meta,
  action,
  unread,
  onClick,
}: {
  avatar?: ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
  action?: ReactNode;
  unread?: boolean;
  onClick?: () => void;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn('w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors', unread ? 'bg-[#0f6fec]/5' : 'hover:bg-[#f5f6f8]')}
    >
      {avatar}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('text-sm truncate', unread ? 'font-bold text-[#14191e]' : 'font-semibold text-[#14191e]')}>{title}</p>
          {meta && <span className="text-xs text-[#a1a5b3] shrink-0">{meta}</span>}
        </div>
        {subtitle && <p className={cn('text-xs truncate mt-0.5', unread ? 'text-[#14191e] font-medium' : 'text-[#676a79]')}>{subtitle}</p>}
      </div>
      {action}
      {unread && <span className="w-2 h-2 bg-[#0f6fec] rounded-full shrink-0" />}
    </Comp>
  );
}

export function TEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f5f6f8] flex items-center justify-center text-2xl">📭</div>
      <h3 className="text-lg font-bold text-[#14191e] mb-2">{title}</h3>
      <p className="text-sm text-[#676a79] max-w-sm mx-auto">{description}</p>
    </div>
  );
}

export function TDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[#e8eaed]" />
      {label && <span className="text-xs text-[#a1a5b3] font-medium">{label}</span>}
      <div className="flex-1 h-px bg-[#e8eaed]" />
    </div>
  );
}
