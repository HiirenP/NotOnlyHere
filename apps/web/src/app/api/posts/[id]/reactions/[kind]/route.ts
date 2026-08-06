import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function PUT(request: Request, context: { params: Promise<{ id: string; kind: string }> }) {
  const { id, kind } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/posts/${id}/reactions/${kind}`, {
    method: 'PUT',
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  return new NextResponse(payload, { status: response.status });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string; kind: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/posts/${id}/reactions/SUPPORT`, {
    method: 'DELETE',
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  return new NextResponse(payload, { status: response.status });
}
