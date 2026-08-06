import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function GET() {
  const cookieStore = await cookies();
  const response = await proxyToApi('/api/v1/admin/migration/release-readiness', {
    cookieHeader: cookieStore.toString(),
  });
  return new NextResponse(await response.text(), { status: response.status });
}
