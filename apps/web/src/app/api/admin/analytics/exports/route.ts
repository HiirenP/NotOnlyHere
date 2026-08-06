import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const response = await proxyToApi('/api/v1/admin/analytics/exports', {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
    body: await request.text(),
  });
  return new NextResponse(await response.text(), { status: response.status });
}
