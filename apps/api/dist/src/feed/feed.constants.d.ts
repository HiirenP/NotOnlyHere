export declare const POST_BODY_MAX = 5000;
export declare const POST_EDIT_WINDOW_MS: number;
export declare const FEED_DEFAULT_LIMIT = 20;
export type FeedMode = 'RELEVANT' | 'CHRONOLOGICAL';
export declare function encodeCursor(createdAt: Date, id: string): string;
export declare function decodeCursor(cursor: string): {
    createdAt: Date;
    id: string;
};
export declare function normalizeBody(body: string): string;
export declare function isMeaningfulBody(body: string): boolean;
