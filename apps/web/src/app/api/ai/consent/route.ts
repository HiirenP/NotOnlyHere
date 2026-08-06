import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function GET() {
  const cookieStore = await cookies();
  const response = await proxyToApi('/api/v1/ai/consent', {
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const body = await request.text();
  const response = await proxyToApi('/api/v1/ai/consent', {
    method: 'PUT',
    cookieHeader: cookieStore.toString(),
    body,
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}
