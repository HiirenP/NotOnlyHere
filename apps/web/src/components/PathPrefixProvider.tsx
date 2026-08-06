'use client';

import { createContext, useContext } from 'react';
import { withIngressPrefix } from '@/lib/ingress';

const PathPrefixContext = createContext('');

export function PathPrefixProvider({
  prefix,
  children,
}: {
  prefix: string;
  children: React.ReactNode;
}) {
  return <PathPrefixContext.Provider value={prefix}>{children}</PathPrefixContext.Provider>;
}

export function usePathPrefix() {
  return useContext(PathPrefixContext);
}

export function usePrefixedPath(path: string) {
  const prefix = usePathPrefix();
  return withIngressPrefix(path, prefix);
}
