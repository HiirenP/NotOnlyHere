import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

const KEY_VERSION = 1;

function key() {
  const secret = process.env.AI_CONTENT_KEY ?? 'phase12-dev-ai-content-key-32bytes!!';
  return createHash('sha256').update(secret).digest();
}

export function encryptText(plaintext: string) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), nonce);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: Buffer.concat([encrypted, tag]),
    keyVersion: KEY_VERSION,
    nonce,
  };
}

export function decryptText(ciphertext: Buffer, nonce: Buffer) {
  const tag = ciphertext.subarray(ciphertext.length - 16);
  const data = ciphertext.subarray(0, ciphertext.length - 16);
  const decipher = createDecipheriv('aes-256-gcm', key(), nonce);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
