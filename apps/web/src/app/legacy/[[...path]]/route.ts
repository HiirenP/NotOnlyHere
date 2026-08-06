import { NextResponse } from 'next/server';
import { proxyToApi } from '@/lib/api-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') ?? '/';
  const response = await proxyToApi(`/api/v1/legacy/resolve?path=${encodeURIComponent(path)}`);
  if (!response.ok) {
    return NextResponse.json({ targetPath: null }, { status: 404 });
  }
  const body = await response.json();
  return NextResponse.redirect(new URL(body.targetPath, url.origin), body.statusCode ?? 301);
}
