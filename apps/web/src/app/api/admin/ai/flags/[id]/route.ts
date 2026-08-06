import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const body = await request.text();
  const response = await proxyToApi(`/api/v1/admin/ai/flags/${id}`, {
    method: 'PATCH',
    cookieHeader: cookieStore.toString(),
    body,
  });
  return new NextResponse(await response.text(), { status: response.status });
}
