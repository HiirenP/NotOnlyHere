import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const url = new URL(request.url);
  const apiUrl = process.env.API_URL ?? 'http://localhost:3001';
  const returnTo = url.searchParams.get('returnTo') ?? '/app';
  return NextResponse.redirect(`${apiUrl}/api/v1/auth/oauth/${provider}/start?returnTo=${encodeURIComponent(returnTo)}`);
}
