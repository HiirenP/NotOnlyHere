import { redirect as nextRedirect } from 'next/navigation';
import { withIngressPrefix } from '@/lib/ingress';
import { getIngressPrefix } from '@/lib/ingress.server';

export async function ingressRedirect(path: string) {
  const prefix = await getIngressPrefix();
  nextRedirect(withIngressPrefix(path, prefix));
}
