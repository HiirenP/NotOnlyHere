export const LEGAL_DOC_VERSION = '2026-07-30';

export const PASSWORD_MIN_LENGTH = 8;

export const EMAIL_TOKEN_TTL = {
  VERIFY_EMAIL: 24 * 60 * 60 * 1000,
  RESET_PASSWORD: 60 * 60 * 1000,
} as const;

export const SESSION_ACCESS_TTL_MS = 15 * 60 * 1000;
export const SESSION_REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const SESSION_ABSOLUTE_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export const GENERIC_AUTH_ERROR = 'Invalid email or password.';
export const GENERIC_RESET_MESSAGE =
  'If an account exists for that email, we sent a password reset link.';

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string) {
  return /^[a-z0-9_]{3,30}$/.test(username);
}

export function isValidPassword(password: string) {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function sanitizeReturnTo(returnTo?: string | null) {
  if (!returnTo) return '/app';
  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) return '/app';
  return returnTo;
}
