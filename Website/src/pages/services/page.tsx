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

const serviceCards = [
  {
    title: 'Peer Circles',
    description: 'Themed small-group spaces where honest stories find kind listeners. Each circle has its own rhythm and personality — Gentle Support for quiet moments, Late Night Lounge for the 2am crowd, Night Shade for raw real talk, and more.',
    icon: 'ri-contrast-2-line',
    color: 'bg-accent-500',
  },
  {
    title: 'Anonymous Sharing',
    description: 'Post honestly without your name attached. Anonymity is not about hiding — it is about making vulnerability feel safer. Share what is heavy without fear of judgment. Your words matter, not your identity.',
    icon: 'ri-shield-user-line',
    color: 'bg-primary-500',
  },
  {
    title: 'Wellness Check-In',
    description: 'Daily gentle prompts to check in with yourself. Track your mood, reflect on what you need, and notice patterns over time. Designed to take 30 seconds — because self-awareness should not feel like homework.',
    icon: 'ri-heart-pulse-line',
    color: 'bg-secondary-500',
  },
  {
    title: 'AI Companion',
    description: 'A 24/7 peer-support companion trained on active listening and empathy. It does not diagnose or prescribe — it listens, reflects, and gently guides you toward real community when you are ready. Available anytime.',
    icon: 'ri-robot-line',
    color: 'bg-foreground-800',
  },
  {
    title: 'Community Events',
    description: 'Live gatherings — facilitated circles, quiet co-working sessions, and occasional guest speakers. Real-time connection when text is not enough. Every event is free and open to all members.',
    icon: 'ri-calendar-event-line',
    color: 'bg-accent-500',
  },
  {
    title: 'Resource Library',
    description: 'Curated articles, grounding exercises, and peer-support guides — vetted by our moderation team. Practical tools for understanding yourself and supporting others. No clickbait, no ads, no algorithms.',
    icon: 'ri-book-open-line',
    color: 'bg-primary-500',
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            What We Offer
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            What <em className="not-italic gradient-text">NotOnlyHere</em> Offers
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Every service at NotOnlyHere is built around one idea: making honest human connection feel safe, simple, and available — for free, for everyone, forever.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {serviceCards.map((card, i) => (
            <FadeSection key={card.title} delay={i * 80}>
              <div className="bg-background-100 border border-background-200 p-6 md:p-8 h-full hover:scale-[1.01] transition-transform duration-300">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${card.color} mb-5`}>
                  <i className={`${card.icon} text-lg text-background-50`} />
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
                  {card.title}
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Important Note */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="max-w-3xl mx-auto space-y-6">
          <div className="bg-background-50 border-l-4 border-accent-500 p-6 md:p-8">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 bg-accent-100 rounded-full">
                <i className="ri-information-line text-accent-600" />
              </div>
              <div>
                <h3 className="font-display text-lg uppercase tracking-tight text-foreground-950 mb-2">
                  Peer Support, Not Clinical Care
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  NotOnlyHere is a peer-support community, not a clinical service or therapy platform. Our circles are led by trained moderators, not licensed therapists. We complement professional mental health care — we do not replace it. If you are in crisis, call or text <strong className="text-foreground-950">988</strong> (Suicide & Crisis Lifeline) or contact local emergency services.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background-50 border border-background-200 p-5 md:p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-100">
                <i className="ri-global-line text-accent-600" />
              </div>
            </div>
            <p className="font-mono text-sm text-foreground-700 leading-relaxed">
              All services are accessed through the web after you log in. No app download required. Peer support only — not clinical therapy.
            </p>
          </div>
        </FadeSection>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-foreground-950">
        <FadeSection className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-background-50 uppercase mb-6 leading-[0.9]">
            Ready to <em className="not-italic gradient-text">Explore</em>?
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed max-w-xl mx-auto mb-10">
            See every feature in detail — how it works, what it looks like, and why we built it this way.
          </p>
          <a
            href="/features"
            className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-10 py-5 rounded-full whitespace-nowrap cursor-pointer inline-block"
          >
            View All Features
          </a>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}