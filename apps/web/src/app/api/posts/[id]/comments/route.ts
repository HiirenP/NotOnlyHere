import { proxyGet, proxyMutate } from '@/lib/bff-route';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyGet(`/posts/${encodeURIComponent(id)}/comments`);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.text();
  return proxyMutate(`/posts/${encodeURIComponent(id)}/comments`, 'POST', body);
}
