import { NextResponse } from 'next/server';
import { redirectTo } from '@/lib/redirect';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const isAdmin = url.searchParams.get('role') === 'admin';
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001';

  const response = await fetch(`${apiUrl}/api/v1/auth/dev-session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: isAdmin ? 'admin@notonlyhere.local' : 'demo@notonlyhere.local' }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Dev login failed' }, { status: 500 });
  }

  const setCookie = response.headers.getSetCookie?.() ?? [];
  const redirectPath = isAdmin ? '/admin' : '/app';
  const nextResponse = redirectTo(redirectPath, request);

  for (const cookie of setCookie) {
    nextResponse.headers.append('set-cookie', cookie);
  }

  if (setCookie.length === 0) {
    const raw = response.headers.get('set-cookie');
    if (raw) nextResponse.headers.set('set-cookie', raw);
  }

  return nextResponse;
}
