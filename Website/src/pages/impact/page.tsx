import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

const stats = [
  { number: '12,000+', label: 'Support Messages', desc: 'Exchanged last year — listening, not likes.' },
  { number: '$0', label: 'Cost to Join', desc: 'Free forever. No paywalls, no premium tiers.' },
  { number: '48+', label: 'Active Circles', desc: 'Themed spaces for every kind of conversation.' },
  { number: '2,400+', label: 'Community Members', desc: 'And growing — one honest story at a time.' },
];

const highlights = [
  {
    year: '2022',
    stat: '94%',
    label: 'of members reported feeling less alone after their first month in the community.',
    image: '/images/impact-h1.jpg',
  },
  {
    year: '2023',
    stat: '340%',
    label: 'increase in honest sharing after anonymous posting was introduced — vulnerability without visibility.',
    image: '/images/impact-h2.jpg',
  },
  {
    year: '2024',
    stat: '3.2x',
    label: 'more likely members are to return after receiving a response to their first post. One reply changes everything.',
    image: '/images/impact-h3.jpg',
  },
];

const testimonials = [
  {
    quote: 'I did not think anyone would respond to my first post. Within an hour, I had seven kind, thoughtful messages. I cried.',
    name: 'Anonymous member',
    location: 'Gentle Support Circle',
  },
  {
    quote: 'The Late Night Lounge saved me during the darkest period of my life. At 3am, there is always someone who understands.',
    name: 'Anonymous member',
    location: 'Late Night Lounge',
  },
  {
    quote: 'I have been in therapy for years, but there is something different about hearing "me too" from someone who actually gets it.',
    name: 'Anonymous member',
    location: 'Night Shade Circle',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className="border-t border-background-300 pt-8 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${index * 100}ms` }}
    >
      <div className="font-display text-5xl md:text-6xl tracking-tighter text-foreground-950 mb-2">{stat.number}</div>
      <div className="font-mono text-xs uppercase tracking-widest gradient-text mb-3">{stat.label}</div>
      <p className="text-sm text-foreground-500 leading-relaxed">{stat.desc}</p>
    </div>
  );
}

function HighlightRow({ item, index }: { item: typeof highlights[0]; index: number }) {
  const { ref, visible } = useInView();
  const isEven = index % 2 === 0;
  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center transition-all duration-700`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)' }}
    >
      <div className="w-full lg:w-1/2">
        <div className="w-full h-[280px] md:h-[340px] rounded-lg overflow-hidden">
          <img src={item.image} alt={item.label} className="w-full h-full object-cover object-top" />
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground-400">{item.year}</span>
        <div className="font-display text-7xl md:text-8xl tracking-tighter text-foreground-950 my-3 leading-none">{item.stat}</div>
        <p className="text-base text-foreground-600 leading-relaxed max-w-md">{item.label}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ item, index }: { item: typeof testimonials[0]; index: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${index * 120}ms` }}
    >
      <p className="text-base text-foreground-700 leading-relaxed mb-6 italic">&ldquo;{item.quote}&rdquo;</p>
      <div className="font-mono text-xs uppercase tracking-widest text-foreground-500">{item.name}</div>
      <div className="font-mono text-xs text-foreground-400">{item.location}</div>
    </div>
  );
}

export default function ImpactPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background-50 font-sans">
      <Nav />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/impact-hero.jpg"
            alt="Peer support community"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/80 via-foreground-950/30 to-transparent" />
        </div>
        <div
          ref={heroRef}
          className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 pb-14 transition-all duration-1000"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-background-300 mb-3">NotOnlyHere Impact</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter text-background-50 max-w-3xl leading-tight">
            Real belonging.<br />Real numbers.
          </h1>
        </div>
      </section>

      {/* Intro line */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 max-w-3xl">
        <p className="text-lg md:text-xl text-foreground-600 leading-relaxed">
          We measure what matters — not growth for growth&apos;s sake, but depth of connection, safety maintained, and loneliness reduced. Here is what years of peer-first support actually looks like.
        </p>
      </section>

      {/* Stats grid */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
        </div>
      </section>

      {/* Divider */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="border-t border-background-300" />
      </div>

      {/* Highlights */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 flex flex-col gap-20 md:gap-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-2">By the research</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-900">What the data shows</h2>
        </div>
        {highlights.map((item, i) => <HighlightRow key={item.year} item={item} index={i} />)}
      </section>

      {/* Divider */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="border-t border-background-300" />
      </div>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-12">Voices from the community</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {testimonials.map((t, i) => <TestimonialCard key={t.name + i} item={t} index={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 bg-foreground-950">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-background-50 mb-4">Add your story to these numbers.</h2>
          <p className="text-foreground-400 text-sm leading-relaxed mb-8">Every message sent, every late-night conversation, every "me too" starts with one person deciding to show up.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/#join')}
              className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-6 py-3 rounded-full cursor-pointer whitespace-nowrap"
            >
              Join Free
            </button>
            <button
              onClick={() => navigate('/stories')}
              className="font-mono text-xs uppercase tracking-widest border border-foreground-600 text-background-300 px-6 py-3 rounded-full hover:border-foreground-400 hover:text-background-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Read Stories
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}