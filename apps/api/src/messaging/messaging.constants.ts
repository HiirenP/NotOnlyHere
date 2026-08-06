import { createHash } from 'crypto';

export const MESSAGE_BODY_MAX = 4000;
export const ALLOWED_MESSAGE_EMOJI = ['👍', '❤️', '😊', '🙏', '✨'] as const;

export function buildPairKey(userA: string, userB: string) {
  const sorted = [userA, userB].sort();
  return createHash('sha256').update(sorted.join(':')).digest();
}

export function encodeMessageCursor(createdAt: Date, id: string) {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}

export function decodeMessageCursor(cursor: string) {
  const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
  if (!createdAt || !id) throw new Error('INVALID_CURSOR');
  return { createdAt: new Date(createdAt), id };
}
