import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const path = query ? `/api/v1/notifications?${query}` : '/api/v1/notifications';
  const response = await proxyToApi(path, {
    method: 'GET',
    cookieHeader: cookieStore.toString(),
  });
  return new NextResponse(await response.text(), { status: response.status });
}
