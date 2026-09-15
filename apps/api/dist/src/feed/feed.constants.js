"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEED_DEFAULT_LIMIT = exports.POST_EDIT_WINDOW_MS = exports.POST_BODY_MAX = void 0;
exports.encodeCursor = encodeCursor;
exports.decodeCursor = decodeCursor;
exports.normalizeBody = normalizeBody;
exports.isMeaningfulBody = isMeaningfulBody;
exports.POST_BODY_MAX = 5000;
exports.POST_EDIT_WINDOW_MS = 15 * 60 * 1000;
exports.FEED_DEFAULT_LIMIT = 20;
function encodeCursor(createdAt, id) {
    return Buffer.from(`${createdAt.toISOString()}|${id}`).toString('base64url');
}
function decodeCursor(cursor) {
    try {
        const [createdAt, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
        if (!createdAt || !id)
            throw new Error('invalid');
        return { createdAt: new Date(createdAt), id };
    }
    catch {
        throw new Error('INVALID_CURSOR');
    }
}
function normalizeBody(body) {
    return body.trim();
}
function isMeaningfulBody(body) {
    return normalizeBody(body).length > 0;
}
//# sourceMappingURL=feed.constants.js.map