import { proxyGet } from '@/lib/bff-route';

export async function GET() {
  return proxyGet('/account/sessions');
}
