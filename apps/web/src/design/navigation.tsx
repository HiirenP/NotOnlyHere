'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppLink } from '@/components/AppLink';
import { cn } from '@/design/design-system/utils';

export function DesignLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <AppLink href={href} className={className}>
      {children}
    </AppLink>
  );
}

export function DesignNavLink({
  href,
  className,
  activeClassName,
  end = false,
  children,
}: {
  href: string;
  className?: string | ((active: boolean) => string);
  activeClassName?: string;
  end?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/_ingress/, '') || '/';
  const active = end ? normalizedPath === href : normalizedPath === href || normalizedPath.startsWith(`${href}/`);
  const resolvedClass =
    typeof className === 'function' ? className(active) : cn(className, active && activeClassName);

  return (
    <AppLink href={href} className={resolvedClass}>
      {children}
    </AppLink>
  );
}
