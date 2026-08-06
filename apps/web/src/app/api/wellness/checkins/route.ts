import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const body = await request.text();
  const response = await proxyToApi('/api/v1/wellness/checkins', {
    method: 'POST',
    cookieHeader: cookieStore.toString(),
    body,
  });
  return new NextResponse(await response.text(), { status: response.status });
}
