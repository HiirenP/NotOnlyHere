import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/connections/${id}/accept`, {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  const next = new NextResponse(payload, { status: response.status });
  forwardSetCookies(response, next.headers);
  return next;
}
