import { notFound } from 'next/navigation';
import { proxyToApi } from '@/lib/api-server';

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  bodyPlain: string;
  publishedAt: string | null;
};

async function getPost(slug: string): Promise<BlogPost | null> {
  const response = await proxyToApi(`/api/v1/blogs/${slug}`);
  if (response.status === 404) return null;
  if (!response.ok) return null;
  return response.json();
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <a href="/blog" className="font-mono text-xs uppercase text-foreground-500 hover:underline">
        ← All posts
      </a>
      <article className="space-y-4">
        <h1 className="font-display text-4xl uppercase">{post.title}</h1>
        <p className="font-mono text-sm text-foreground-500">{post.excerpt}</p>
        <div className="font-mono text-sm text-foreground-700 whitespace-pre-wrap">{post.bodyPlain}</div>
      </article>
    </main>
  );
}
