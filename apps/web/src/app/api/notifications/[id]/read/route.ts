import { proxyMutate } from '@/lib/bff-route';

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyMutate(`/notifications/${encodeURIComponent(id)}/read`, 'PATCH');
}
