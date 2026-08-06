import { useState, useRef, useEffect } from 'react';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

interface FadeSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function FadeSection({ children, className = '', delay = 0 }: FadeSectionProps) {
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
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const categories = ['All', 'Growth', 'Relationships', 'Wellness', 'Community'];

const allPosts = [
  {
    title: '5 Essential Things to Start Doing for Your Personal Growth and Happiness',
    excerpt: 'Small, consistent actions build the foundation for lasting change. Here are five gentle shifts that can transform how you relate to yourself and the world around you.',
    category: 'Growth',
    author: 'Maya Chen',
    date: 'Jul 22, 2026',
    readTime: '6 min',
    image: '/images/blog-featured-growth.jpg',
    slug: '/blog/post',
    featured: true,
  },
  {
    title: 'How to Build Deeper Connections Without Oversharing',
    excerpt: 'Connection does not require full disclosure. Learn how to be present and open while keeping healthy boundaries that protect your inner world.',
    category: 'Relationships',
    author: 'Darius Kim',
    date: 'Jul 18, 2026',
    readTime: '5 min',
    image: '/images/blog-post-01.jpg',
    slug: '/blog/post',
  },
  {
    title: 'The Quiet Power of Showing Up for Yourself Each Morning',
    excerpt: 'Before you can truly show up for others, you must learn to show up for yourself. A gentle exploration of morning rituals that ground and sustain you.',
    category: 'Wellness',
    author: 'Priya Nair',
    date: 'Jul 14, 2026',
    readTime: '4 min',
    image: '/images/blog-post-02.jpg',
    slug: '/blog/post',
  },
  {
    title: 'What We Learned From 2,400 Anonymous Support Messages',
    excerpt: 'A data-informed look at what people actually share when nobody is watching — and what it tells us about the human need for being heard.',
    category: 'Community',
    author: 'Team NotOnlyHere',
    date: 'Jul 10, 2026',
    readTime: '7 min',
    image: '/images/blog-post-03.jpg',
    slug: '/blog/post',
  },
  {
    title: 'Why Nighttime Feels Heavier — And What Helps',
    excerpt: 'Late-night thoughts have a way of amplifying everything. Understanding why this happens can make those quiet hours feel a little less overwhelming.',
    category: 'Wellness',
    author: 'Jordan Reyes',
    date: 'Jul 6, 2026',
    readTime: '5 min',
    image: '/images/blog-post-04.jpg',
    slug: '/blog/post',
  },
  {
    title: 'Finding Community When You Feel Like an Outsider',
    excerpt: 'Belonging does not always come naturally. A practical guide to finding spaces where you can exhale and simply be yourself, without performance.',
    category: 'Community',
    author: 'Samir Torres',
    date: 'Jul 2, 2026',
    readTime: '5 min',
    image: '/images/blog-post-05.jpg',
    slug: '/blog/post',
  },
  {
    title: 'The Art of Listening Without Trying to Fix Anything',
    excerpt: 'Most people do not need solutions. They need someone to sit beside them in the mess. A guide to the quiet, radical act of holding space.',
    category: 'Relationships',
    author: 'Lena Okonkwo',
    date: 'Jun 28, 2026',
    readTime: '6 min',
    image: '/images/blog-post-06.jpg',
    slug: '/blog/post',
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = activeCategory === 'All'
    ? allPosts
    : allPosts.filter((p) => p.category === activeCategory);

  const featured = filteredPosts.find((p) => p.featured);
  const regular = filteredPosts.filter((p) => !p.featured);
  const totalPages = Math.ceil(regular.length / postsPerPage);
  const paginatedPosts = regular.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const honeypot = (data.get('website_alt') as string || '').trim();
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    data.delete('website_alt');

    setLoading(true);
    setFormError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSubmitted(true);
      setEmail('');
    } catch {
      setFormError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            The Blog
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Stories &amp; <em className="not-italic gradient-text">Reflections</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Honest writing about mental health, community, personal growth, and what it really means to feel seen. No hot takes, no clickbait — just real human stories.
          </p>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="py-8 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100 border-b border-background-200 sticky top-[72px] z-40 bg-background-100/95 backdrop-blur-sm">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
              className={`font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat
                  ? 'gradient-btn text-background-50'
                  : 'border border-background-300 text-foreground-600 hover:border-foreground-400 hover:text-foreground-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
          <FadeSection>
            <a href={featured.slug} className="group block cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="overflow-hidden" style={{ aspectRatio: '3/2' }}>
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
                    Featured
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 ml-3">
                    {featured.category}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-950 uppercase mt-2 mb-4 leading-[0.9] group-hover:gradient-text transition-all duration-200">
                    {featured.title}
                  </h2>
                  <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-foreground-400 font-mono text-xs">
                    <span>{featured.author}</span>
                    <span>&middot;</span>
                    <span>{featured.date}</span>
                    <span>&middot;</span>
                    <span>{featured.readTime} read</span>
                  </div>
                </div>
              </div>
            </a>
          </FadeSection>
        </section>
      )}

      {/* Article Grid */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {paginatedPosts.map((post, i) => (
            <FadeSection key={post.title} delay={i * 100}>
              <a href={post.slug} className="group block cursor-pointer bg-background-50 border border-background-200 h-full">
                <div className="overflow-hidden" style={{ aspectRatio: '3/2' }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-display text-xl tracking-tighter text-foreground-950 uppercase leading-[0.9] mb-3 group-hover:gradient-text transition-all duration-200">
                    {post.title}
                  </h3>
                  <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-foreground-400 font-mono text-xs">
                    <span>{post.date}</span>
                    <span>&middot;</span>
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </a>
            </FadeSection>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-foreground-400">No posts in this category yet. Try another filter.</p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100 border-t border-background-200">
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-background-300 rounded-full font-mono text-sm text-foreground-600 hover:border-foreground-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-s-line" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-mono text-sm cursor-pointer transition-all duration-200 ${
                  currentPage === p
                    ? 'gradient-btn text-background-50'
                    : 'border border-background-300 text-foreground-600 hover:border-foreground-400'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-background-300 rounded-full font-mono text-sm text-foreground-600 hover:border-foreground-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-foreground-950">
        <FadeSection className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-background-400 block mb-3">
            Stay Inspired
          </span>
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-background-50 uppercase mb-4 leading-[0.9]">
            Stories That <em className="not-italic gradient-text">Truly See</em> You
          </h2>
          <p className="font-mono text-sm text-background-400 leading-relaxed mb-8 max-w-md mx-auto">
            Get thoughtful reflections and community stories delivered to your inbox. No noise, no spam — just real writing.
          </p>

          {submitted ? (
            <p className="font-mono text-sm text-background-300 bg-background-800 px-6 py-4 rounded-full text-center inline-block">
              Thanks for subscribing! You&apos;ll hear from us soon.
            </p>
          ) : (
            <form
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="sr-only"
              />
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 font-mono text-sm px-5 py-3 bg-background-800 border border-background-600 rounded-full focus:outline-none focus:border-background-400 text-background-50 placeholder:text-background-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-6 py-3 rounded-full whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Subscribe'}
              </button>
              {formError && (
                <p className="font-mono text-xs text-red-400 w-full">{formError}</p>
              )}
            </form>
          )}
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}