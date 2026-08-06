import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    title: 'Why We Stopped Counting Likes',
    excerpt: 'How removing engagement metrics changed the way people showed up — and why it made the community kinder.',
    author: 'The NotOnlyHere Team',
    date: 'July 18, 2026',
    image: '/images/blog-preview-1.jpg',
  },
  {
    title: 'The Art of Listening Without Fixing',
    excerpt: 'Most of us listen to respond. Here is what happens when you listen just to be present — and nothing more.',
    author: 'Sarah Chen',
    date: 'July 10, 2026',
    image: '/images/blog-preview-2.jpg',
  },
  {
    title: 'A Letter to First-Timers',
    excerpt: 'Nervous about joining your first circle? You are not alone. Here is what to expect — and why it is okay to just listen.',
    author: 'Marcus Rivera',
    date: 'June 28, 2026',
    image: '/images/blog-preview-3.jpg',
  },
];

export default function BlogPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
      <div className="mb-8 md:mb-12 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground-950 block mb-3">
          Our Blog
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
          Stories That <em className="not-italic gradient-text">Stay With You</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post, i) => (
          <a
            key={post.title}
            href="/blog"
            className="group bg-background-100 border border-background-200 hover:scale-[1.01] transition-transform duration-300 cursor-pointer block"
          >
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="font-mono text-[10px] uppercase tracking-widest bg-foreground-950/80 text-background-50 px-3 py-1.5 rounded-sm">
                  Blog
                </span>
              </div>
            </div>
            <div
              className="p-5 md:p-6 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-2">
                {post.date}
              </p>
              <h3 className="font-display text-lg uppercase tracking-tight text-foreground-950 mb-2 leading-tight group-hover:gradient-text transition-colors">
                {post.title}
              </h3>
              <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <p className="font-mono text-xs text-foreground-400">By {post.author}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-foreground-950 hover:gradient-text transition-colors duration-200 cursor-pointer"
        >
          Explore Our Blog <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}