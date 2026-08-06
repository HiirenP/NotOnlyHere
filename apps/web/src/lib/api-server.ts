const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function proxyToApi(
  path: string,
  init: RequestInit & { cookieHeader?: string } = {},
) {
  const { cookieHeader, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (cookieHeader) headers.set('cookie', cookieHeader);
  if (!headers.has('content-type') && rest.body) {
    headers.set('content-type', 'application/json');
  }

  return fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    cache: 'no-store',
  });
}

export function forwardSetCookies(from: Response, to: Headers) {
  const setCookies = from.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    to.append('set-cookie', cookie);
  }
  if (setCookies.length === 0) {
    const raw = from.headers.get('set-cookie');
    if (raw) to.set('set-cookie', raw);
  }
}
