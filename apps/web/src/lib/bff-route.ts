import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function proxyGet(path: string, request?: Request) {
  const cookieStore = await cookies();
  const query = request ? new URL(request.url).search : '';
  const qs = query ? `?${query}` : '';
  const response = await proxyToApi(`/api/v1${path}${qs}`, {
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}

export async function proxyMutate(path: string, method: string, body?: string) {
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1${path}`, {
    method,
    cookieHeader: cookieStore.toString(),
    body,
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}
