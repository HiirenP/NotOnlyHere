import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const response = await proxyToApi(
    `/api/v1/conversations/${encodeURIComponent(id)}/messages${query ? `?${query}` : ''}`,
    { cookieHeader: cookieStore.toString() },
  );
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const body = await request.text();
  const response = await proxyToApi(`/api/v1/conversations/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
    body,
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}
