import { NextResponse } from 'next/server';
import { forwardSetCookies, proxyToApi } from '@/lib/api-server';
import { redirectTo } from '@/lib/redirect';

type LoginPayload = {
  email: string;
  password: string;
  returnTo?: string;
};

async function parseLoginPayload(request: Request): Promise<LoginPayload> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json().catch(() => ({}))) as Partial<LoginPayload>;
    return {
      email: body.email ?? '',
      password: body.password ?? '',
      returnTo: body.returnTo,
    };
  }

  const form = await request.formData();
  return {
    email: String(form.get('email') ?? ''),
    password: String(form.get('password') ?? ''),
    returnTo: String(form.get('returnTo') ?? '/app'),
  };
}

function wantsJsonResponse(request: Request) {
  const accept = request.headers.get('accept') ?? '';
  const contentType = request.headers.get('content-type') ?? '';
  return contentType.includes('application/json') || accept.includes('application/json');
}

export async function POST(request: Request) {
  const payload = await parseLoginPayload(request);
  const response = await proxyToApi('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (!wantsJsonResponse(request)) {
      const params = new URLSearchParams({ error: 'invalid' });
      if (payload.returnTo) params.set('returnTo', payload.returnTo);
      return redirectTo(`/login?${params.toString()}`, request);
    }
    return NextResponse.json(data, { status: response.status });
  }

  const returnTo = typeof data.returnTo === 'string' ? data.returnTo : '/app';
  const next = redirectTo(returnTo, request);
  forwardSetCookies(response, next.headers);
  return next;
}
