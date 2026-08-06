import type { InputHTMLAttributes } from 'react';
import { cn } from './utils';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, id, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="font-mono text-xs uppercase tracking-widest text-foreground-500 block">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'w-full font-mono text-sm px-4 py-3 bg-background-50 border focus:outline-none text-foreground-950 placeholder:text-foreground-400 focus-ring transition-colors duration-150',
          error ? 'border-danger-500' : 'border-background-200 focus:border-foreground-400',
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="font-mono text-xs text-foreground-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="font-mono text-xs text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
}
