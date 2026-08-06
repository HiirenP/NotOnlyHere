import { cookies } from 'next/headers';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';
import { redirectTo } from '@/lib/redirect';

async function logoutAndRedirect(request: Request) {
  const cookieStore = await cookies();
  const response = await proxyToApi('/api/v1/auth/logout', {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
  });
  const next = redirectTo('/login', request);
  forwardSetCookies(response, next.headers);
  return next;
}

export async function POST(request: Request) {
  return logoutAndRedirect(request);
}

export async function GET(request: Request) {
  return logoutAndRedirect(request);
}
