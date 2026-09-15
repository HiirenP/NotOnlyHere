"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERIC_RESET_MESSAGE = exports.GENERIC_AUTH_ERROR = exports.SESSION_ABSOLUTE_TTL_MS = exports.SESSION_REFRESH_TTL_MS = exports.SESSION_ACCESS_TTL_MS = exports.EMAIL_TOKEN_TTL = exports.PASSWORD_MIN_LENGTH = exports.LEGAL_DOC_VERSION = void 0;
exports.normalizeEmail = normalizeEmail;
exports.normalizeUsername = normalizeUsername;
exports.isValidUsername = isValidUsername;
exports.isValidPassword = isValidPassword;
exports.sanitizeReturnTo = sanitizeReturnTo;
exports.LEGAL_DOC_VERSION = '2026-07-30';
exports.PASSWORD_MIN_LENGTH = 8;
exports.EMAIL_TOKEN_TTL = {
    VERIFY_EMAIL: 24 * 60 * 60 * 1000,
    RESET_PASSWORD: 60 * 60 * 1000,
};
exports.SESSION_ACCESS_TTL_MS = 15 * 60 * 1000;
exports.SESSION_REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
exports.SESSION_ABSOLUTE_TTL_MS = 90 * 24 * 60 * 60 * 1000;
exports.GENERIC_AUTH_ERROR = 'Invalid email or password.';
exports.GENERIC_RESET_MESSAGE = 'If an account exists for that email, we sent a password reset link.';
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function normalizeUsername(username) {
    return username.trim().toLowerCase();
}
function isValidUsername(username) {
    return /^[a-z0-9_]{3,30}$/.test(username);
}
function isValidPassword(password) {
    return (password.length >= exports.PASSWORD_MIN_LENGTH &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password));
}
function sanitizeReturnTo(returnTo) {
    if (!returnTo)
        return '/app';
    if (!returnTo.startsWith('/') || returnTo.startsWith('//'))
        return '/app';
    return returnTo;
}
//# sourceMappingURL=auth.constants.js.map