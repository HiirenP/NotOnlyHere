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

interface CircleCard {
  name: string;
  description: string;
  members: string;
  icon: string;
  color: string;
  tags: string[];
  category: string;
  active: string;
}

const allCircles: CircleCard[] = [
  {
    name: 'Gentle Support',
    description: 'A warm, slow-paced space for sharing life\'s quieter struggles. Deeply moderated and always kind. This is where you come when you need to exhale.',
    members: '840',
    icon: 'ri-heart-pulse-line',
    color: 'bg-accent-500',
    tags: ['Support', 'Slow-Paced', 'Moderated'],
    category: 'Support',
    active: 'Weekday evenings, weekends',
  },
  {
    name: 'Late Night Lounge',
    description: 'For the 2am crowd. Low-pressure conversations with fellow night owls who understand that the quiet hours can be the loudest. Bring your insomnia and your honesty.',
    members: '620',
    icon: 'ri-moon-line',
    color: 'bg-secondary-500',
    tags: ['Night Owl', 'Casual', 'Late Hours'],
    category: 'Night Owl',
    active: 'Nightly, peak 10pm–4am EST',
  },
  {
    name: 'Night Shade',
    description: 'A darker, raw space for heavier topics. Real talk about grief, trauma, and the stuff that does not fit into polite conversation. Heavily moderated — raw, not reckless.',
    members: '480',
    icon: 'ri-contrast-2-line',
    color: 'bg-foreground-800',
    tags: ['Reflection', 'Heavy Topics', 'Moderated'],
    category: 'Reflection',
    active: 'Daily, with trigger-warning protocols',
  },
  {
    name: 'First Time Here',
    description: 'New to peer support? Start here. Friendly faces, gentle introductions, and zero pressure. Everyone remembers what it felt like to walk through the door the first time.',
    members: '1,050',
    icon: 'ri-seedling-line',
    color: 'bg-primary-500',
    tags: ['Beginner', 'Welcome', 'Gentle'],
    category: 'Beginner',
    active: 'Always open, orientation weekly',
  },
  {
    name: 'Wellness Warriors',
    description: 'A circle for people actively working on their mental health. Share wins, setbacks, and everything in between. Therapy homework, coping strategies, and mutual encouragement.',
    members: '560',
    icon: 'ri-empathize-line',
    color: 'bg-accent-500',
    tags: ['Support', 'Wellness', 'Growth'],
    category: 'Support',
    active: 'Daily check-ins, weekly group',
  },
  {
    name: 'Creative Expression',
    description: 'For people who process through creativity. Share poetry, sketches, music, or anything you made while feeling something. Art as language — no skill level required.',
    members: '390',
    icon: 'ri-paint-brush-line',
    color: 'bg-secondary-500',
    tags: ['Reflection', 'Creative', 'Expression'],
    category: 'Reflection',
    active: 'Ongoing, weekly prompts',
  },
];

const filterPills = ['All', 'Support', 'Night Owl', 'Reflection', 'Beginner'];

export default function CirclesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? allCircles
      : allCircles.filter((c) => c.category === activeFilter);

  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            Our Circles
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Find Your <em className="not-italic gradient-text">People</em>. Join a Circle.
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Every circle has its own rhythm, its own personality, and its own way of making space for honesty. Browse them all — there is one that fits.
          </p>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50 border-b border-background-200 sticky top-[72px] z-40">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className={`font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeFilter === pill
                  ? 'gradient-btn text-background-50'
                  : 'border-2 border-background-200 text-foreground-600 hover:border-foreground-400 hover:text-foreground-950'
              }`}
            >
              {pill}
              {pill !== 'All' && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({allCircles.filter((c) => c.category === pill).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Circle Cards */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-foreground-400">
              No circles match this filter. Try another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((circle, i) => (
              <FadeSection key={circle.name} delay={i * 100}>
                <div className="bg-background-50 border border-background-200 p-6 md:p-8 h-full flex flex-col hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-full ${circle.color}`}>
                      <i className={`${circle.icon} text-xl text-background-50`} />
                    </div>
                    <span className="font-mono text-xs text-foreground-400 bg-background-100 px-3 py-1 rounded-full whitespace-nowrap">
                      {circle.members} members
                    </span>
                  </div>

                  <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
                    {circle.name}
                  </h3>

                  <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-5 flex-1">
                    {circle.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {circle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] uppercase tracking-widest bg-background-100 text-foreground-500 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-mono text-xs text-foreground-400">
                      {circle.active}
                    </span>
                  </div>

                  <a
                    href="/register"
                    className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-6 py-3 rounded-full text-center whitespace-nowrap cursor-pointer inline-block w-full"
                  >
                    Join Circle
                  </a>
                </div>
              </FadeSection>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="font-mono text-xs text-foreground-400">
            Showing {filtered.length} of {allCircles.length} circles
          </p>
        </div>
      </section>

      {/* Request a Circle */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="max-w-2xl mx-auto text-center">
          <div className="bg-background-100 border-2 border-background-200 p-10">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-foreground-950 mx-auto mb-5">
              <i className="ri-add-line text-2xl text-background-50" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-foreground-950 mb-4">
              Don&apos;t See Your <em className="not-italic gradient-text">Circle</em>?
            </h2>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-8">
              We are always growing. If you have an idea for a new circle — a space you wish existed — tell us. We read every request and launch new circles based on what the community needs.
            </p>
            <a
              href="/contact"
              className="font-mono text-sm uppercase tracking-wider border-2 border-foreground-950 text-foreground-950 px-8 py-4 rounded-full hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 whitespace-nowrap cursor-pointer inline-block"
            >
              Request a New Circle
            </a>
          </div>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}