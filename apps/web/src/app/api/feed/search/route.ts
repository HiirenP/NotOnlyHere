import { proxyGet } from '@/lib/bff-route';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? '';
  const cursor = url.searchParams.get('cursor');
  const limit = url.searchParams.get('limit');
  const params = new URLSearchParams({ q });
  if (cursor) params.set('cursor', cursor);
  if (limit) params.set('limit', limit);
  return proxyGet(`/feed/search?${params.toString()}`);
}
