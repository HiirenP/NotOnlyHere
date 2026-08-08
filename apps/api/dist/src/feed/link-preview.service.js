"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkPreviewService = void 0;
const common_1 = require("@nestjs/common");
const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);
let LinkPreviewService = class LinkPreviewService {
    validateUrl(rawUrl) {
        let parsed;
        try {
            parsed = new URL(rawUrl);
        }
        catch {
            throw new common_1.BadRequestException({ code: 'INVALID_URL', message: 'URL must be a valid HTTPS address.' });
        }
        if (parsed.protocol !== 'https:') {
            throw new common_1.BadRequestException({ code: 'INVALID_URL', message: 'Only HTTPS URLs are supported.' });
        }
        const host = parsed.hostname.toLowerCase();
        if (BLOCKED_HOSTS.has(host) || host.endsWith('.local') || host.startsWith('10.') || host.startsWith('192.168.')) {
            throw new common_1.BadRequestException({ code: 'UNSAFE_URL', message: 'URL is not allowed.' });
        }
        return parsed;
    }
    async fetchPreview(url) {
        const parsed = this.validateUrl(url);
        return {
            sourceUrl: url,
            canonicalUrl: parsed.toString(),
            title: parsed.hostname,
            description: `Preview for ${parsed.hostname}`,
            siteName: parsed.hostname.replace(/^www\./, ''),
            fetchStatus: 'ok',
            fetchedAt: new Date().toISOString(),
        };
    }
};
exports.LinkPreviewService = LinkPreviewService;
exports.LinkPreviewService = LinkPreviewService = __decorate([
    (0, common_1.Injectable)()
], LinkPreviewService);
//# sourceMappingURL=link-preview.service.js.map