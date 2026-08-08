"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptText = encryptText;
exports.decryptText = decryptText;
const crypto_1 = require("crypto");
const KEY_VERSION = 1;
function key() {
    const secret = process.env.AI_CONTENT_KEY ?? 'phase12-dev-ai-content-key-32bytes!!';
    return (0, crypto_1.createHash)('sha256').update(secret).digest();
}
function encryptText(plaintext) {
    const nonce = (0, crypto_1.randomBytes)(12);
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', key(), nonce);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        ciphertext: Buffer.concat([encrypted, tag]),
        keyVersion: KEY_VERSION,
        nonce,
    };
}
function decryptText(ciphertext, nonce) {
    const tag = ciphertext.subarray(ciphertext.length - 16);
    const data = ciphertext.subarray(0, ciphertext.length - 16);
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', key(), nonce);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
//# sourceMappingURL=ai-crypto.js.map