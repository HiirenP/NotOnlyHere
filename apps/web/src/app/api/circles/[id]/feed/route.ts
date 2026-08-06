import { proxyGet } from '@/lib/bff-route';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  return proxyGet(`/circles/${encodeURIComponent(id)}/feed${query ? `?${query}` : ''}`);
}
