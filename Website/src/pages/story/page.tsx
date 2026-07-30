import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { stories } from '@/mocks/stories';
import type { Story, StorySection } from '@/mocks/stories';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

function SectionRenderer({ section }: { section: StorySection }) {
  if (section.type === 'paragraph') {
    return (
      <p className="font-mono text-base md:text-lg leading-relaxed text-foreground-700 mb-6">
        {section.content}
      </p>
    );
  }

  if (section.type === 'quote') {
    return (
      <blockquote className="my-10 md:my-14 pl-6 md:pl-10 border-l-4 border-secondary-500">
        <p className="font-display text-2xl md:text-3xl uppercase tracking-tight text-foreground-950 leading-tight mb-4">
          &ldquo;{section.content}&rdquo;
        </p>
      </blockquote>
    );
  }

  if (section.type === 'image' && section.src) {
    return (
      <figure className="my-10 md:my-14">
        <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img
            src={section.src}
            alt={section.caption || ''}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
        {section.caption && (
          <figcaption className="font-mono text-xs uppercase tracking-widest text-foreground-400 mt-3">
            {section.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (section.type === 'stat') {
    return (
      <div className="my-10 md:my-14 py-10 px-8 md:px-12 bg-foreground-950">
        <p className="font-display text-5xl md:text-6xl uppercase tracking-tighter text-background-50 leading-none mb-3">
          {section.stat}
        </p>
        <p className="font-mono text-sm uppercase tracking-widest gradient-text">
          {section.label}
        </p>
      </div>
    );
  }

  if (section.type === 'heading') {
    return (
      <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-foreground-950 mt-12 mb-6">
        {section.content}
      </h3>
    );
  }

  return null;
}

export default function StoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const story = stories.find((s) => s.slug === slug);
  const contentRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, [slug]);

  if (!story) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-4xl uppercase tracking-tight text-foreground-950 mb-4">
            Story Not Found
          </p>
          <button
            onClick={() => navigate('/')}
            className="font-mono text-sm uppercase tracking-wider gradient-text hover:opacity-80 transition-colors cursor-pointer"
          >
            &larr; Back to Home
          </button>
        </div>
      </div>
    );
  }

  const relatedStories = story.relatedSlugs
    .map((rs) => stories.find((s) => s.slug === rs))
    .filter(Boolean) as Story[];

  return (
    <div className="min-h-screen bg-background-50">
      <Nav />

      {/* Hero */}
      <div className="relative w-full" style={{ height: '70vh', minHeight: '500px' }}>
        <img
          src={story.heroImage}
          alt={story.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/80 via-foreground-950/30 to-transparent" />

        <div
          className={`absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-12 lg:px-16 pb-12 md:pb-16 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-background-200 hover:text-background-50 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Stories
          </button>

          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            {story.category} &mdash; {story.date}
          </span>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter text-background-50 leading-[0.9] max-w-4xl mb-4">
            {story.title}
          </h1>

          <p className="font-mono text-base md:text-lg text-background-200 leading-relaxed max-w-2xl">
            {story.subtitle}
          </p>
        </div>
      </div>

      {/* Article meta bar */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-16 py-6 border-b border-background-200 bg-background-50">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-foreground-950 flex items-center justify-center">
              <span className="font-mono text-xs text-background-50 uppercase">
                {story.author.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-mono text-sm text-foreground-950">{story.author}</p>
              <p className="font-mono text-xs text-foreground-400">{story.authorRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-foreground-400">
            <Clock size={14} />
            {story.readTime}
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-foreground-400">
            <Calendar size={14} />
            {story.date}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {story.sections.map((section, i) => (
            <SectionRenderer key={i} section={section} />
          ))}
        </div>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-background-100 border-t border-background-200">
          <div className="mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-3">
              Keep Reading
            </span>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-foreground-900">
              Related <em className="not-italic gradient-text">Stories</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {relatedStories.map((rs) => (
              <button
                key={rs.slug}
                onClick={() => navigate(`/story/${rs.slug}`)}
                className="group text-left bg-background-50 p-3 pb-8 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
              >
                <div className="w-full overflow-hidden mb-4" style={{ aspectRatio: '16/10' }}>
                  <img
                    src={rs.heroImage}
                    alt={rs.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-2">
                  {rs.category}
                </span>
                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-2 group-hover:gradient-text transition-colors">
                  {rs.title}
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
                  {rs.subtitle}
                </p>
                <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest gradient-text group-hover:opacity-80 transition-colors">
                  Read Story <ArrowRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-foreground-950">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter text-background-50 leading-[0.9] mb-6">
            Be Part of the <em className="not-italic gradient-text">Story</em>
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed mb-8">
            Every story on this page started with one person deciding to show up. That person could be you.
          </p>
          <a
            href="/#join"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              setTimeout(() => {
                document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
              }, 300);
            }}
            className="inline-flex items-center font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer"
          >
            Join Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}