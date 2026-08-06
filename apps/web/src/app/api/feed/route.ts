import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const response = await proxyToApi(`/api/v1/feed${query ? `?${query}` : ''}`, {
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}
