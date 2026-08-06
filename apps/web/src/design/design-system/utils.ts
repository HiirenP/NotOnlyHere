import { clsx, type ClassValue } from './clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
