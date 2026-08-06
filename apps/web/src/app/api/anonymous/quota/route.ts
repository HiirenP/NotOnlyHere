import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function GET() {
  const cookieStore = await cookies();
  const response = await proxyToApi('/api/v1/anonymous/quota', {
    method: 'GET',
    cookieHeader: cookieStore.toString(),
  });
  const payload = await response.text();
  return new NextResponse(payload, { status: response.status });
}
