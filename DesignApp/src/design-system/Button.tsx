import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
};

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3.5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'font-mono uppercase tracking-wider transition-all duration-150 ease-product focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        fullWidth && 'w-full',
        variant === 'primary' && 'gradient-btn text-background-50',
        variant === 'secondary' && 'surface-card text-foreground-800 hover:bg-background-200',
        variant === 'ghost' && 'text-foreground-700 hover:bg-background-200',
        variant === 'danger' && 'bg-danger-500 text-background-50 hover:opacity-90 active:scale-[0.98]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
