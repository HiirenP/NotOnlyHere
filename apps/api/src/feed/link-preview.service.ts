import { BadRequestException, Injectable } from '@nestjs/common';

const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

@Injectable()
export class LinkPreviewService {
  validateUrl(rawUrl: string) {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new BadRequestException({ code: 'INVALID_URL', message: 'URL must be a valid HTTPS address.' });
    }
    if (parsed.protocol !== 'https:') {
      throw new BadRequestException({ code: 'INVALID_URL', message: 'Only HTTPS URLs are supported.' });
    }
    const host = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.has(host) || host.endsWith('.local') || host.startsWith('10.') || host.startsWith('192.168.')) {
      throw new BadRequestException({ code: 'UNSAFE_URL', message: 'URL is not allowed.' });
    }
    return parsed;
  }

  async fetchPreview(url: string) {
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
}
