export const CIRCLE_DEFAULT_LIMIT = 20;

export function encodeCursor(createdAt: Date, id: string) {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}

export function decodeCursor(cursor: string) {
  const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
  if (!createdAt || !id) throw new Error('INVALID_CURSOR');
  return { createdAt: new Date(createdAt), id };
}

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
