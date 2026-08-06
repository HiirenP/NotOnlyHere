import type { ReactNode } from 'react';
import { cn } from './utils';

type Props = {
  options: { value: string; label: string }[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function SegmentedControl({ options, value, onChange, className }: Props) {
  return (
    <div className={cn('inline-flex p-1 bg-background-200 border border-background-300', className)} role="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(option.value)}
            className={cn(
              'font-mono text-xs uppercase tracking-wider px-4 py-2 transition-all duration-150 focus-ring',
              active ? 'bg-background-50 text-foreground-950 shadow-sm' : 'text-foreground-600 hover:text-foreground-800',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-background-200', className)} aria-hidden />;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16 px-6 animate-fade-up">
      <h3 className="font-display text-2xl uppercase tracking-tight text-foreground-900 mb-2">{title}</h3>
      <p className="font-mono text-sm text-foreground-600 max-w-md mx-auto leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
