import { proxyGet } from '@/lib/bff-route';

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return proxyGet(`/profiles/${encodeURIComponent(username)}/posts`);
}
