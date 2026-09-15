"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_MESSAGE_EMOJI = exports.MESSAGE_BODY_MAX = void 0;
exports.buildPairKey = buildPairKey;
exports.encodeMessageCursor = encodeMessageCursor;
exports.decodeMessageCursor = decodeMessageCursor;
const crypto_1 = require("crypto");
exports.MESSAGE_BODY_MAX = 4000;
exports.ALLOWED_MESSAGE_EMOJI = ['👍', '❤️', '😊', '🙏', '✨'];
function buildPairKey(userA, userB) {
    const sorted = [userA, userB].sort();
    return (0, crypto_1.createHash)('sha256').update(sorted.join(':')).digest();
}
function encodeMessageCursor(createdAt, id) {
    return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}
function decodeMessageCursor(cursor) {
    const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
    if (!createdAt || !id)
        throw new Error('INVALID_CURSOR');
    return { createdAt: new Date(createdAt), id };
}
//# sourceMappingURL=messaging.constants.js.map