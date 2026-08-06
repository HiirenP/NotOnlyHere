import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const body = await request.text();
  const response = await proxyToApi(`/api/v1/events/${id}/rsvp`, {
    method: 'PUT',
    cookieHeader: cookieStore.toString(),
    body,
  });
  return new NextResponse(await response.text(), { status: response.status });
}
