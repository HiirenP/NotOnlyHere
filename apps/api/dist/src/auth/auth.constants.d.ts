export declare const LEGAL_DOC_VERSION = "2026-07-30";
export declare const PASSWORD_MIN_LENGTH = 8;
export declare const EMAIL_TOKEN_TTL: {
    readonly VERIFY_EMAIL: number;
    readonly RESET_PASSWORD: number;
};
export declare const SESSION_ACCESS_TTL_MS: number;
export declare const SESSION_REFRESH_TTL_MS: number;
export declare const SESSION_ABSOLUTE_TTL_MS: number;
export declare const GENERIC_AUTH_ERROR = "Invalid email or password.";
export declare const GENERIC_RESET_MESSAGE = "If an account exists for that email, we sent a password reset link.";
export declare function normalizeEmail(email: string): string;
export declare function normalizeUsername(username: string): string;
export declare function isValidUsername(username: string): boolean;
export declare function isValidPassword(password: string): boolean;
export declare function sanitizeReturnTo(returnTo?: string | null): string;
