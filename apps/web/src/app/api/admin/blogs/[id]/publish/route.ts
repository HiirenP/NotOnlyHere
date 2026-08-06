import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const response = await proxyToApi(`/api/v1/admin/blogs/${id}/publish`, {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
  });
  return new NextResponse(await response.text(), { status: response.status });
}
