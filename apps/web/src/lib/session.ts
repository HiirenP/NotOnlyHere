const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function ensureDevSession(email = 'demo@notonlyhere.local') {
  const response = await fetch(`${API_URL}/api/v1/auth/dev-session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to create dev session');
  }

  const setCookie = response.headers.get('set-cookie');
  return setCookie ?? '';
}
