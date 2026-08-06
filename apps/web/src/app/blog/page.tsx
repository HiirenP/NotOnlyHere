import { proxyToApi } from '@/lib/api-server';

type BlogListResponse = {
  items: Array<{ slug: string; title: string; excerpt: string; publishedAt: string | null }>;
};

async function getPosts(): Promise<BlogListResponse> {
  const response = await proxyToApi('/api/v1/blogs');
  if (!response.ok) return { items: [] };
  return response.json();
}

export default async function BlogIndexPage() {
  const { items } = await getPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase text-foreground-500">Public blog</p>
        <h1 className="font-display text-4xl uppercase">Stories</h1>
      </header>
      <ul className="space-y-4">
        {items.map((post) => (
          <li key={post.slug} className="surface-card p-5 space-y-2">
            <a href={`/blog/${post.slug}`} className="font-display text-2xl uppercase hover:underline">
              {post.title}
            </a>
            <p className="font-mono text-sm text-foreground-700">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
