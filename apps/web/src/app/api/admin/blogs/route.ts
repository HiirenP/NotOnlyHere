import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const response = await proxyToApi(`/api/v1/admin/blogs${query ? `?${query}` : ''}`, {
    cookieHeader: cookieStore.toString(),
  });
  return new NextResponse(await response.text(), { status: response.status });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const response = await proxyToApi('/api/v1/admin/blogs', {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
    body: await request.text(),
  });
  return new NextResponse(await response.text(), { status: response.status });
}
