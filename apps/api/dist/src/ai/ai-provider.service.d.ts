export type AiReplyInput = {
    userMessage: string;
    conversationHistory: {
        role: 'USER' | 'ASSISTANT';
        content: string;
    }[];
};
export type AiReplyResult = {
    content: string;
    model: string;
    provider: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    providerRequestId: string;
};
export declare class AiProviderService {
    generateReply(input: AiReplyInput): Promise<AiReplyResult>;
    private callOpenAi;
}
