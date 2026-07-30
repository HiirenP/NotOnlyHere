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

const featureCards = [
  {
    title: 'Circles',
    description: 'Themed small-group spaces for gentle support, late-night connection, raw real talk, and beginner-friendly introductions. Each circle has its own pace and personality.',
    icon: 'ri-contrast-2-line',
    color: 'bg-accent-500',
  },
  {
    title: 'Anonymous Posting',
    description: 'Share honestly without your name attached. Anonymity is not about hiding — it is about making vulnerability feel safer. Be real without fear of judgment.',
    icon: 'ri-shield-user-line',
    color: 'bg-primary-500',
  },
  {
    title: 'Feed',
    description: 'A slow, intentional feed of honest posts from the community. No infinite scroll, no algorithms optimizing for outrage. Just real words from real people.',
    icon: 'ri-chat-1-line',
    color: 'bg-secondary-500',
  },
  {
    title: 'Messaging',
    description: 'Private, secure messaging with circle members. Connect one-on-one when a conversation deserves more space. No unsolicited DMs — consent first.',
    icon: 'ri-message-2-line',
    color: 'bg-foreground-800',
  },
  {
    title: 'Wellness Check-In',
    description: 'Daily gentle prompts to check in with yourself. Track your mood, reflect on what you need, and notice patterns — without pressure or judgment.',
    icon: 'ri-heart-pulse-line',
    color: 'bg-accent-500',
  },
  {
    title: 'AI Support',
    description: 'A 24/7 companion trained on peer-support principles. It listens without judgment, suggests grounding exercises, and points you toward real community when you are ready.',
    icon: 'ri-robot-line',
    color: 'bg-primary-500',
  },
  {
    title: 'Events',
    description: 'Live community gatherings — facilitated circles, quiet co-working sessions, and occasional guest speakers. Real-time connection when you need it.',
    icon: 'ri-calendar-event-line',
    color: 'bg-secondary-500',
  },
  {
    title: 'Notifications',
    description: 'Gentle nudges when someone responds to your post or when a circle session is starting. Configurable, never overwhelming. You control what reaches you.',
    icon: 'ri-notification-3-line',
    color: 'bg-foreground-800',
  },
  {
    title: 'Resource Library',
    description: 'Curated articles, grounding exercises, and peer-support guides — vetted by our moderation team. Practical tools, not clickbait.',
    icon: 'ri-book-open-line',
    color: 'bg-accent-500',
  },
];

const comparisonRows = [
  { feature: 'Anonymous posting', notOnlyHere: true, socialMedia: false },
  { feature: 'Human moderation', notOnlyHere: true, socialMedia: 'Limited' },
  { feature: 'No follower counts', notOnlyHere: true, socialMedia: false },
  { feature: 'No algorithms', notOnlyHere: true, socialMedia: false },
  { feature: 'Themed small groups', notOnlyHere: true, socialMedia: false },
  { feature: 'Free forever', notOnlyHere: true, socialMedia: 'Ad-supported' },
  { feature: 'Crisis resources', notOnlyHere: true, socialMedia: 'Hidden' },
  { feature: 'Designed for connection', notOnlyHere: true, socialMedia: 'Designed for engagement' },
];

export default function FeaturesPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            Platform Features
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Everything You Need to <em className="not-italic gradient-text">Feel Seen</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Every feature is designed with one goal: making honest connection feel safe, simple, and human. No gimmicks — just tools that help people show up for each other.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        {/* Web-only banner */}
        <FadeSection className="mb-12 md:mb-16">
          <div className="max-w-3xl mx-auto bg-background-100 border border-background-200 p-5 md:p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-100">
                <i className="ri-global-line text-accent-600" />
              </div>
            </div>
            <p className="font-mono text-sm text-foreground-700 leading-relaxed">
              Fully web-based — access all features after logging in from any browser. No app download required.
            </p>
          </div>
        </FadeSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featureCards.map((card, i) => (
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

      {/* Comparison Table */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Why NotOnlyHere
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            NotOnlyHere vs <em className="not-italic gradient-text">Social Media</em>
          </h2>
          <p className="font-mono text-sm text-foreground-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Most platforms optimize for attention. We optimize for connection.
          </p>
        </FadeSection>

        <FadeSection delay={200} className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-foreground-950">
                <th className="text-left py-4 px-4 md:px-6 uppercase tracking-widest text-foreground-400 text-xs">
                  Feature
                </th>
                <th className="text-center py-4 px-4 md:px-6 uppercase tracking-widest gradient-text text-xs">
                  NotOnlyHere
                </th>
                <th className="text-center py-4 px-4 md:px-6 uppercase tracking-widest text-foreground-400 text-xs">
                  Social Media
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.feature} className={`border-b border-background-200 ${i % 2 === 0 ? 'bg-background-50' : 'bg-background-100'}`}>
                  <td className="py-4 px-4 md:px-6 text-foreground-700">
                    {row.feature}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-center">
                    {row.notOnlyHere === true ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-100">
                        <i className="ri-check-line text-accent-600 text-lg" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background-200">
                        <i className="ri-close-line text-foreground-400 text-lg" />
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-center text-foreground-500">
                    {typeof row.socialMedia === 'string' ? row.socialMedia : (
                      row.socialMedia ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background-200">
                          <i className="ri-check-line text-foreground-400 text-lg" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background-200">
                          <i className="ri-close-line text-foreground-400 text-lg" />
                        </span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeSection>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-foreground-950">
        <FadeSection className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-background-50 uppercase mb-6 leading-[0.9]">
            Ready to Try a <em className="not-italic gradient-text">Different Kind</em> of Platform?
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed max-w-xl mx-auto mb-10">
            No algorithms. No follower counts. Just people who show up for each other.
          </p>
          <a
            href="/register"
            className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-10 py-5 rounded-full whitespace-nowrap cursor-pointer inline-block"
          >
            Join Free
          </a>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}