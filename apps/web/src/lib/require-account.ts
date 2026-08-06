import { cookies } from 'next/headers';
import type { AccountResponse } from '@notonlyhere/contracts';
import { proxyToApi } from '@/lib/api-server';
import { ingressRedirect } from '@/lib/navigation';

export async function getAccount(): Promise<AccountResponse | null> {
  const cookieStore = await cookies();
  const response = await proxyToApi('/api/v1/account', { cookieHeader: cookieStore.toString() });
  if (!response.ok) return null;
  return response.json();
}

export async function requireAccount(returnTo: string): Promise<AccountResponse> {
  const account = await getAccount();
  if (!account) {
    await ingressRedirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    throw new Error('Redirecting to login');
  }
  return account;
}

export async function requireAdmin(returnTo: string): Promise<AccountResponse> {
  const account = await requireAccount(returnTo);
  const isAdmin = account.roles.includes('SUPER_ADMIN') || account.roles.includes('STAFF');
  if (!isAdmin) {
    await ingressRedirect('/app');
    throw new Error('Redirecting to app');
  }
  return account;
}
