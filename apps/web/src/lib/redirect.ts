import { NextResponse } from 'next/server';
import { getIngressPrefixFromRequest, withIngressPrefix } from '@/lib/ingress';

function safePath(path: string, fallback = '/app') {
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  return path;
}

export function requestOrigin(request: Request) {
  const host =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() || request.headers.get('host');
  if (!host) return new URL(request.url).origin;

  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ||
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export function redirectTo(path: string, request: Request, status = 303) {
  const prefix = getIngressPrefixFromRequest(request);
  const target = new URL(withIngressPrefix(safePath(path), prefix), requestOrigin(request));
  return NextResponse.redirect(target, status);
}
