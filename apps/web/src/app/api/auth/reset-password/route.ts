import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function POST(request: Request) {
  const body = await request.text();
  const response = await proxyToApi('/api/v1/auth/password/reset', { method: 'POST', body });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
