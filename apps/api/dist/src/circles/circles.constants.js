"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVITE_TTL_MS = exports.CIRCLE_DEFAULT_LIMIT = void 0;
exports.encodeCursor = encodeCursor;
exports.decodeCursor = decodeCursor;
exports.CIRCLE_DEFAULT_LIMIT = 20;
function encodeCursor(createdAt, id) {
    return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}
function decodeCursor(cursor) {
    const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
    if (!createdAt || !id)
        throw new Error('INVALID_CURSOR');
    return { createdAt: new Date(createdAt), id };
}
exports.INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
//# sourceMappingURL=circles.constants.js.map