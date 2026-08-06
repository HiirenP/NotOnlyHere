import { useRef, useEffect, useState } from 'react';
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

const relatedPosts = [
  {
    title: 'The Quiet Power of Showing Up for Yourself Each Morning',
    excerpt: 'Before you can truly show up for others, you must learn to show up for yourself.',
    date: 'Jul 14, 2026',
    readTime: '4 min',
    image: '/images/blog-related-01.jpg',
  },
  {
    title: 'The Art of Listening Without Trying to Fix Anything',
    excerpt: 'Most people do not need solutions. They need someone to sit beside them in the mess.',
    date: 'Jun 28, 2026',
    readTime: '6 min',
    image: '/images/blog-related-02.jpg',
  },
  {
    title: 'How to Build Deeper Connections Without Oversharing',
    excerpt: 'Connection does not require full disclosure. Learn how to be present and open while keeping healthy boundaries.',
    date: 'Jul 18, 2026',
    readTime: '5 min',
    image: '/images/blog-related-03.jpg',
  },
];

export default function BlogPostPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Article Header */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-3">
            Jul 22, 2026 &middot; 6 min read &middot; Growth
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            5 Essential Things to Start Doing for Your Personal <em className="not-italic gradient-text">Growth and Happiness</em>
          </h1>
          <p className="font-mono text-base text-foreground-600 leading-relaxed mb-8">
            Small, consistent actions build the foundation for lasting change. Here are five gentle shifts that can transform how you relate to yourself and the world around you — no grand gestures required.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background-200 flex items-center justify-center">
              <i className="ri-user-line text-foreground-500" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground-950">Maya Chen</p>
              <p className="font-mono text-xs text-foreground-400">Community Writer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100 pb-12 md:pb-20">
        <FadeSection className="max-w-4xl mx-auto">
          <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src="/images/blog-post-hero.jpg"
              alt="Person in peaceful contemplation"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </FadeSection>
      </section>

      {/* Article Body */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="max-w-3xl mx-auto">
          <article className="font-mono text-base leading-relaxed text-foreground-700 space-y-8">
            <p>
              Personal growth is not a destination you arrive at after checking off a list. It is not a certificate on your wall or a number on a scale. It is the quiet, daily practice of choosing yourself — even when no one is watching, even when the results feel invisible, even when the world tells you to keep running faster.
            </p>

            <p>
              The most meaningful shifts rarely come from dramatic transformations. They come from small, sustainable actions repeated over time. A five-minute journal entry before bed. A walk without headphones. A conversation where you say what you actually feel instead of what you think people want to hear. These moments accumulate — and before you know it, you are standing in a life that feels more like your own.
            </p>

            <p>
              The five practices we explore below are not rules. Think of them as invitations. Gentle nudges toward a version of yourself that already exists — it just needs a little more room to breathe. You do not need to do them all at once. Pick one. Try it for a week. Notice what shifts.
            </p>

            {/* Pull Quote */}
            <blockquote className="border-l-4 border-background-800 pl-6 py-2 my-10">
              <p className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase leading-[0.9]">
                &ldquo;The most meaningful shifts rarely come from dramatic transformations. They come from <em className="not-italic gradient-text">small, sustainable actions</em> repeated over time.&rdquo;
              </p>
            </blockquote>

            <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase mt-12 mb-4 leading-[0.9]">
              1. Start <em className="not-italic gradient-text">Listening</em> to Yourself
            </h2>
            <p>
              Most of us spend more time listening to external noise — social media, news cycles, other people&apos;s opinions — than we do listening to our own inner voice. But that voice, quiet as it may be, carries an extraordinary amount of wisdom. It knows what drains you and what fills you up. It knows when a friendship feels one-sided or when a job is slowly wearing you down. The practice is simple: sit still for five minutes each day and ask yourself, &ldquo;What do I actually need right now?&rdquo; Then listen — without judgment, without rushing to fix anything. Just listen.
            </p>

            <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase mt-12 mb-4 leading-[0.9]">
              2. Let Go of the Need to <em className="not-italic gradient-text">Perform</em>
            </h2>
            <p>
              So much of our energy goes into curating an image — how we appear to colleagues, acquaintances, even friends. We edit ourselves before we even open our mouths. But growth happens in the unpolished spaces. It happens when you admit you are struggling without adding &ldquo;but I will be fine&rdquo; at the end. When you let someone see you without the filter. Performance is exhausting. Authenticity, once you get used to it, is freeing.
            </p>

            <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase mt-12 mb-4 leading-[0.9]">
              3. Build <em className="not-italic gradient-text">Small Rituals</em> That Anchor You
            </h2>
            <p>
              Big goals are inspiring, but they are also overwhelming. Instead of resolving to &ldquo;be happier&rdquo; or &ldquo;be healthier,&rdquo; focus on micro-rituals: a cup of tea you drink slowly in the morning before checking your phone, a two-minute breathing exercise before bed, a weekly phone call with someone who makes you laugh. These small anchors create a sense of stability and self-care that no grand resolution can match. They become the scaffolding of a life you actually enjoy living.
            </p>

            <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase mt-12 mb-4 leading-[0.9]">
              4. Surround Yourself with People Who <em className="not-italic gradient-text">See</em> You
            </h2>
            <p>
              Community is not about numbers. It is about quality of presence. One person who truly sees you — who remembers the thing you mentioned three weeks ago, who notices when your energy shifts — is worth more than a hundred acquaintances who only skim the surface. Seek out spaces where you can show up without armor. Where vulnerability is met with care, not judgment. These connections are the antidote to loneliness, and they are worth every ounce of effort it takes to find them.
            </p>

            <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase mt-12 mb-4 leading-[0.9]">
              5. Give Yourself Permission to <em className="not-italic gradient-text">Rest</em>
            </h2>
            <p>
              Rest is not a reward for productivity. It is not something you earn after you have crossed everything off your list. Rest is a fundamental human need, as essential as food and water. Yet so many of us treat it as optional — something to squeeze in when there is time. Give yourself permission to rest without guilt. Take the nap. Say no to the plan you do not have energy for. Close the laptop an hour earlier. The world will still be there tomorrow, and you will meet it with more presence.
            </p>

            <p className="text-foreground-950 font-semibold pt-6">
              Growth is not about becoming someone new. It is about becoming more fully yourself — the version of you that already exists beneath the noise, the pressure, and the performance. Start small. Stay gentle. Trust the process.
            </p>
          </article>
        </FadeSection>
      </section>

      {/* Related Posts */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-10 md:mb-14">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Keep Reading
          </span>
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-950 uppercase leading-[0.9]">
            Related <em className="not-italic gradient-text">Posts</em>
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map((post, i) => (
            <FadeSection key={post.title} delay={i * 120}>
              <a href="/blog/post" className="group block cursor-pointer bg-background-50 border border-background-200 h-full">
                <div className="overflow-hidden" style={{ aspectRatio: '3/2' }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg tracking-tighter text-foreground-950 uppercase leading-[0.9] mb-2 group-hover:gradient-text transition-all duration-200">
                    {post.title}
                  </h3>
                  <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-foreground-400 font-mono text-xs">
                    <span>{post.date}</span>
                    <span>&middot;</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </a>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 md:py-24 bg-foreground-950">
        <FadeSection className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-background-50 uppercase mb-4 leading-[0.9]">
            Ready to Find Your <em className="not-italic gradient-text">People</em>?
          </h2>
          <p className="font-mono text-sm text-background-400 leading-relaxed mb-8 max-w-md mx-auto">
            Join a community where honest stories find kind listeners. No real name required. Just show up.
          </p>
          <a
            href="/register"
            className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer inline-block"
          >
            Join the Community
          </a>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}