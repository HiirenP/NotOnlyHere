export const INGRESS_PREFIX = '/_ingress';

export function isIngressHost(host: string) {
  return host.includes('.agent.cvm.dev') || host.includes('.cvm.dev');
}

export function withIngressPrefix(path: string, prefix: string) {
  if (!prefix || !path.startsWith('/') || path.startsWith('//')) return path;
  if (path.startsWith(prefix)) return path;
  return `${prefix}${path}`;
}

export function getIngressPrefixFromRequest(request: Request) {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
  return isIngressHost(host) ? INGRESS_PREFIX : '';
}
