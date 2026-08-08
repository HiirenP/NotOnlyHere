export declare const MESSAGE_BODY_MAX = 4000;
export declare const ALLOWED_MESSAGE_EMOJI: readonly ["👍", "❤️", "😊", "🙏", "✨"];
export declare function buildPairKey(userA: string, userB: string): NonSharedBuffer;
export declare function encodeMessageCursor(createdAt: Date, id: string): string;
export declare function decodeMessageCursor(cursor: string): {
    createdAt: Date;
    id: string;
};
