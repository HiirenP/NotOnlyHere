export const POST_BODY_MAX = 5000;
export const POST_EDIT_WINDOW_MS = 15 * 60 * 1000;
export const FEED_DEFAULT_LIMIT = 20;

export type FeedMode = 'RELEVANT' | 'CHRONOLOGICAL';

export function encodeCursor(createdAt: Date, id: string) {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}

export function decodeCursor(cursor: string) {
  try {
    const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
    if (!createdAt || !id) throw new Error('invalid');
    return { createdAt: new Date(createdAt), id };
  } catch {
    throw new Error('INVALID_CURSOR');
  }
}

export function normalizeBody(body: string) {
  return body.trim();
}

export function isMeaningfulBody(body: string) {
  return normalizeBody(body).length > 0;
}
