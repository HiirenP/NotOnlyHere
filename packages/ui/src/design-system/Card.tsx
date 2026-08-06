import type { ReactNode } from 'react';
import { cn } from './utils';

type Props = {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
};

const paddingMap = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className, padding = 'md' }: Props) {
  return (
    <div className={cn('surface-card animate-fade-up', paddingMap[padding], className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="font-display text-xl uppercase tracking-tight text-foreground-950">{title}</h2>
        {subtitle && <p className="font-mono text-sm text-foreground-600 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
