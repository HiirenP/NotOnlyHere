import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const body = await request.text();
  const response = await proxyToApi('/api/v1/profiles/me', {
    method: 'PATCH',
    cookieHeader: cookieStore.toString(),
    body,
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}
