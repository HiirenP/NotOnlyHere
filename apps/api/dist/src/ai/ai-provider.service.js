"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderService = void 0;
const common_1 = require("@nestjs/common");
let AiProviderService = class AiProviderService {
    async generateReply(input) {
        const started = Date.now();
        const provider = process.env.AI_PROVIDER ?? 'dev';
        const model = process.env.AI_MODEL ?? 'dev-ava-v1';
        if (provider === 'openai' && process.env.OPENAI_API_KEY) {
            return this.callOpenAi(input, model, started);
        }
        const content = input.userMessage.toLowerCase().includes('circle')
            ? 'I can share circle recommendations when you opt in under recommendations. For now, tell me what kind of support you are looking for.'
            : 'Thank you for sharing. Ava is here to listen. This is not therapy or emergency support — if you are in crisis, please use the static crisis resources shown on this page.';
        return {
            content,
            model,
            provider: 'dev',
            inputTokens: Math.ceil(input.userMessage.length / 4),
            outputTokens: Math.ceil(content.length / 4),
            latencyMs: Date.now() - started,
            providerRequestId: `dev-${Date.now()}`,
        };
    }
    async callOpenAi(input, model, started) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are Ava, a supportive community assistant. You are not a therapist or emergency service. Keep responses concise and empathetic.',
                    },
                    ...input.conversationHistory.map((message) => ({
                        role: message.role === 'USER' ? 'user' : 'assistant',
                        content: message.content,
                    })),
                    { role: 'user', content: input.userMessage },
                ],
            }),
        });
        if (!response.ok) {
            throw new Error(`AI provider error: ${response.status}`);
        }
        const payload = (await response.json());
        const content = payload.choices[0]?.message?.content?.trim() || 'I am unable to respond right now. Please try again.';
        return {
            content,
            model,
            provider: 'openai',
            inputTokens: payload.usage?.prompt_tokens ?? 0,
            outputTokens: payload.usage?.completion_tokens ?? 0,
            latencyMs: Date.now() - started,
            providerRequestId: payload.id,
        };
    }
};
exports.AiProviderService = AiProviderService;
exports.AiProviderService = AiProviderService = __decorate([
    (0, common_1.Injectable)()
], AiProviderService);
//# sourceMappingURL=ai-provider.service.js.map