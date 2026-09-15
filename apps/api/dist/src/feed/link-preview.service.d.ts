export declare class LinkPreviewService {
    validateUrl(rawUrl: string): URL;
    fetchPreview(url: string): Promise<{
        sourceUrl: string;
        canonicalUrl: string;
        title: string;
        description: string;
        siteName: string;
        fetchStatus: string;
        fetchedAt: string;
    }>;
}
