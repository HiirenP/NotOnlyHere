import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/circles/${id}/membership`, {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
  });
  const next = new NextResponse(await response.text(), { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/circles/${id}/membership`, {
    method: 'DELETE',
    cookieHeader: cookieStore.toString(),
  });
  return new NextResponse(await response.text(), { status: response.status });
}
