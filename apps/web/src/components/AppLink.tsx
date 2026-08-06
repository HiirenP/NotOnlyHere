'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { usePrefixedPath } from '@/components/PathPrefixProvider';

export function AppLink({ href, ...props }: ComponentProps<typeof Link>) {
  const path = typeof href === 'string' ? href : href.pathname ?? '/';
  return <Link href={usePrefixedPath(path)} {...props} />;
}
