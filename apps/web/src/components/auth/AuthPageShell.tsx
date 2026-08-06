'use client';

import type { ReactNode } from 'react';
import { AuthShell } from '@/design/layouts/Shells';

export function AuthPageShell({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
