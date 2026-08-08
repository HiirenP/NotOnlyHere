export declare function encryptText(plaintext: string): {
    ciphertext: Buffer<ArrayBuffer>;
    keyVersion: number;
    nonce: NonSharedBuffer;
};
export declare function decryptText(ciphertext: Buffer, nonce: Buffer): string;
