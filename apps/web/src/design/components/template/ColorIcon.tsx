import type { LucideIcon } from 'lucide-react';
import { cn } from '@/design/design-system/utils';

export const iconColors = {
  blue: 'bg-[#0f6fec]/15 text-[#0f6fec]',
  green: 'bg-[#0cbc87]/15 text-[#0cbc87]',
  purple: 'bg-[#6610f2]/15 text-[#6610f2]',
  pink: 'bg-[#e91e8c]/15 text-[#e91e8c]',
  yellow: 'bg-[#f7c32e]/20 text-[#c9a000]',
  red: 'bg-[#d6293e]/15 text-[#d6293e]',
  orange: 'bg-[#fd7e14]/15 text-[#e17000]',
  teal: 'bg-[#20c997]/15 text-[#17a589]',
} as const;

export type IconColor = keyof typeof iconColors;

export function ColorIcon({
  icon: Icon,
  color = 'blue',
  size = 'md',
  className,
}: {
  icon: LucideIcon;
  color?: IconColor;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const box = { sm: 'w-8 h-8 rounded-lg', md: 'w-10 h-10 rounded-xl', lg: 'w-12 h-12 rounded-xl' };
  const iconSize = { sm: 16, md: 20, lg: 24 };
  return (
    <div className={cn('flex items-center justify-center shrink-0', iconColors[color], box[size], className)}>
      <Icon size={iconSize[size]} />
    </div>
  );
}
