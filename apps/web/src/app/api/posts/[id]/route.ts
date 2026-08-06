import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/posts/${encodeURIComponent(id)}`, {
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const body = await request.text();
  const response = await proxyToApi(`/api/v1/posts/${id}`, {
    method: 'PATCH',
    cookieHeader: cookieStore.toString(),
    body,
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/posts/${id}`, {
    method: 'DELETE',
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}
