import { headers } from 'next/headers';
import { INGRESS_PREFIX, isIngressHost } from '@/lib/ingress';

export async function getIngressPrefix() {
  const headerList = await headers();
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? '';
  return isIngressHost(host) ? INGRESS_PREFIX : '';
}
