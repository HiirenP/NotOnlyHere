export declare const CIRCLE_DEFAULT_LIMIT = 20;
export declare function encodeCursor(createdAt: Date, id: string): string;
export declare function decodeCursor(cursor: string): {
    createdAt: Date;
    id: string;
};
export declare const INVITE_TTL_MS: number;
