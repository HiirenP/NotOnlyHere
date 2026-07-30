import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { stories } from '@/mocks/stories';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

function StoryCard({
  story,
  index,
  featured = false,
}: {
  story: (typeof stories)[0];
  index: number;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (featured) {
    return (
      <div
        ref={ref}
        onClick={() => navigate(`/story/${story.slug}`)}
        className="group cursor-pointer"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms`,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src={story.heroImage}
              alt={story.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-background-50">
            <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
              {story.category} &mdash; {story.date}
            </span>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-foreground-950 leading-[0.95] mb-4 group-hover:gradient-text transition-colors duration-300">
              {story.title}
            </h2>
            <p className="font-mono text-base text-foreground-600 leading-relaxed mb-6">
              {story.subtitle}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-foreground-950 flex items-center justify-center">
                <span className="font-mono text-[10px] text-background-50 uppercase">
                  {story.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <span className="font-mono text-xs text-foreground-500">{story.author}</span>
              <span className="font-mono text-xs text-foreground-400 flex items-center gap-1">
                <Clock size={12} />
                {story.readTime}
              </span>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest gradient-text group-hover:opacity-80 transition-colors">
              Read Story <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/story/${story.slug}`)}
      className="group cursor-pointer bg-background-50 hover:shadow-lg transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms, box-shadow 0.3s ease`,
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img
          src={story.heroImage}
          alt={story.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      </div>
      <div className="p-6 md:p-8">
        <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
          {story.category} &mdash; {story.date}
        </span>
        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-foreground-950 mb-3 group-hover:gradient-text transition-colors duration-300 leading-tight">
          {story.title}
        </h3>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4 line-clamp-3">
          {story.subtitle}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-foreground-400 flex items-center gap-1">
            <Clock size={12} />
            {story.readTime}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest gradient-text group-hover:opacity-80 transition-colors">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StoriesIndex() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const featuredStory = stories[0];
  const gridStories = stories.slice(1);

  return (
    <div className="min-h-screen bg-background-50">
      <Nav />

      {/* Hero */}
      <div className="relative w-full bg-foreground-950" style={{ minHeight: '420px', height: '50vh' }}>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=Warm%20community%20gathering%20indoors%20soft%20natural%20light%20people%20connecting%20genuine%20conversation%20cozy%20atmosphere%20editorial%20photography%20muted%20earth%20tones%20film%20grain%20texture&width=1600&height=900&seq=stories-hero&orientation=landscape"
            alt="Community gathering"
            className="w-full h-full object-cover object-top opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground-950/40 via-foreground-950/60 to-foreground-950" />

        <div
          className={`relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-12 lg:px-16 text-center transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] gradient-text block mb-4">
            NotOnlyHere Stories
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-background-50 leading-[0.85] mb-6">
            Honest <em className="not-italic gradient-text">Words</em>, Kind <em className="not-italic gradient-text">Listeners</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-background-300 leading-relaxed max-w-xl">
            Real stories from our peer-support community. The moments, reflections, and quiet breakthroughs that happen when people truly show up for each other.
          </p>
        </div>
      </div>

      {/* Featured Story */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-12 md:py-20">
        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-2">
            Featured Story
          </span>
          <div className="w-12 h-0.5 bg-primary-500" />
        </div>
        <StoryCard story={featuredStory} index={0} featured />
      </section>

      {/* Story Grid */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-2">
            More Stories
          </span>
          <div className="w-12 h-0.5 bg-primary-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {gridStories.map((story, i) => (
            <StoryCard key={story.slug} story={story} index={i + 1} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-foreground-950">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter text-background-50 leading-[0.9] mb-6">
            Have a Story to <em className="not-italic gradient-text">Share</em>?
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed mb-8">
            We are always listening for stories from our community. Whether you share your name or stay anonymous, your words might be exactly what someone else needs to hear today.
          </p>
          <a
            href="mailto:stories@notonlyhere.org"
            className="inline-flex items-center font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer"
          >
            Submit Your Story
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}