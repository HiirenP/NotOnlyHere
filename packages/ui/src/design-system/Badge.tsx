import type { ReactNode } from 'react';
import { cn } from './utils';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: Props) {
  return (
    <span className={cn('inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-background-200 text-foreground-700', className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'active' | 'pending' | 'warning' | 'danger' | 'muted' }) {
  const styles = {
    active: 'bg-primary-100 text-primary-800',
    pending: 'bg-warning-500/15 text-warning-600',
    warning: 'bg-warning-500/15 text-warning-600',
    danger: 'bg-danger-500/15 text-danger-600',
    muted: 'bg-background-200 text-foreground-600',
  };
  const labels = {
    active: 'Active',
    pending: 'Pending',
    warning: 'Review',
    danger: 'Action needed',
    muted: 'Muted',
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
}

export function Avatar({ name, anonymous }: { name: string; anonymous?: boolean }) {
  const initials = anonymous ? '?' : name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs shrink-0',
        anonymous ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-800',
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
