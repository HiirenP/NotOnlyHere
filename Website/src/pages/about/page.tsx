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

const beliefs = [
  {
    title: 'Presence Over Performance',
    description: 'You do not need to be eloquent or polished. Showing up — quietly, honestly — is enough. We measure community health in listening, not likes.',
    icon: 'ri-eye-line',
  },
  {
    title: 'Vulnerability Is Strength',
    description: 'Sharing what feels heavy is not weakness. It is one of the bravest things a person can do. We hold space for the hard stuff without flinching.',
    icon: 'ri-heart-line',
  },
  {
    title: 'Community Heals',
    description: 'No single conversation fixes everything. But over time, small moments of being heard add up. Belonging is not a destination — it is a practice.',
    icon: 'ri-group-line',
  },
];

const whatWeDo = [
  {
    title: 'Themed Circles',
    description: 'Small group spaces for specific needs — gentle support, late-night connection, raw real talk, and beginner-friendly introductions.',
    icon: 'ri-contrast-2-line',
  },
  {
    title: 'Anonymous Posting',
    description: 'Share honestly without your name attached. Anonymity is not about hiding — it is about making honesty feel safer.',
    icon: 'ri-shield-user-line',
  },
  {
    title: 'Human Moderation',
    description: 'Real people keeping the space kind. Trained moderators, clear guidelines, zero tolerance for harassment.',
    icon: 'ri-user-heart-line',
  },
  {
    title: 'AI Companion',
    description: 'A 24/7 peer-support companion that listens without judgment and points you toward real community when you are ready.',
    icon: 'ri-robot-line',
  },
];

const audienceGroups = [
  {
    title: 'Night Owls',
    description: 'For the 2am crowd. When the world is quiet and your thoughts are loud — there is a circle waiting.',
  },
  {
    title: 'First-Timers',
    description: 'Never been in peer support before? Start here. Gentle introductions, zero pressure, friendly faces.',
  },
  {
    title: 'Deep Feelers',
    description: 'You feel things intensely. That is not a flaw. Find people who understand weight without trying to fix it.',
  },
  {
    title: 'Quiet Listeners',
    description: 'You do not have to speak to belong. Reading, being present, and offering quiet solidarity is participation too.',
  },
];

const stats = [
  { number: '48', suffix: '+', label: 'Active Circles' },
  { number: '2,400', suffix: '+', label: 'Community Members' },
  { number: '100', suffix: '%', label: 'Free to Join' },
  { number: '12,000', suffix: '+', label: 'Support Messages' },
];

export default function AboutPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            Our Story
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Here, Every <em className="not-italic gradient-text">Voice Matters</em> and Every <em className="not-italic gradient-text">Story Is Welcome</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            NotOnlyHere was built on a simple belief: that everyone deserves a place to be seen — not just visible. No algorithms, no follower counts, no performance. Just people showing up for each other.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeSection>
            <div className="relative bg-background-50 p-4 pb-12 shadow-lg rotate-1">
              <div className="absolute top-3 left-1/3 w-20 h-5 bg-accent-300/70 rotate-[-8deg] z-10" style={{ borderRadius: '2px' }} />
              <div className="absolute bottom-8 right-4 w-16 h-4 bg-primary-300/70 rotate-[5deg] z-10" style={{ borderRadius: '2px' }} />
              <div className="w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://readdy.ai/api/search-image?query=Community%20members%20gathering%20in%20a%20warm%20cozy%20indoor%20space%20sharing%20stories%20soft%20natural%20light%20genuine%20connection%20candid%20documentary%20photography%20warm%20earth%20tones%20editorial%20style&width=800&height=1000&seq=about-our-story&orientation=portrait"
                  alt="Community members gathering in a warm cozy space"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mt-4 text-center">
                NotOnlyHere Community &mdash; est. 2024
              </p>
            </div>
          </FadeSection>

          <FadeSection delay={200}>
            <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
              How We Started
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
              From a Quiet Idea to a <em className="not-italic gradient-text">Growing Community</em>
            </h2>
            <div className="font-mono text-base leading-relaxed text-foreground-700 space-y-4">
              <p>
                In early 2024, a small group of friends sat around a kitchen table and asked: <em className="not-italic font-semibold text-foreground-950">what if there was a place online that actually felt human?</em>
              </p>
              <p>
                Not a platform optimized for engagement. Not a feed designed to keep you scrolling. Just — a warm room where honest stories find kind listeners. No scoreboard. No pressure to perform.
              </p>
              <p>
                That conversation became NotOnlyHere. What started as a single circle of eight people now spans dozens of themed spaces, thousands of members, and one unwavering belief: you do not need to be fixed. You need to be heard.
              </p>
              <p>
                Everything runs in your browser — no app to install. Just create a free account and you are in.
              </p>
              <p>
                We are not therapists. We are not a crisis service. We are a community — and we show up for each other, one honest moment at a time.
              </p>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* What We Believe */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Our Values
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            What We <em className="not-italic gradient-text">Believe</em>
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {beliefs.map((b, i) => (
            <FadeSection key={b.title} delay={i * 120}>
              <div className="bg-background-50 border border-background-200 p-8 h-full">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-background-100 mb-5">
                  <i className={`${b.icon} text-2xl text-foreground-700`} />
                </div>
                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
                  {b.title}
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Our Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            What We <em className="not-italic gradient-text">Do</em>
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {whatWeDo.map((item, i) => (
            <FadeSection key={item.title} delay={i * 100}>
              <div className="bg-background-100 border border-background-200 p-6 md:p-8 h-full">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-5 ${i === 0 ? 'bg-accent-500' : i === 1 ? 'bg-primary-500' : i === 2 ? 'bg-secondary-500' : 'bg-foreground-800'}`}>
                  <i className={`${item.icon} text-lg text-background-50`} />
                </div>
                <h3 className="font-display text-lg uppercase tracking-tight text-foreground-950 mb-2">
                  {item.title}
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            For Everyone
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            Who It&apos;s <em className="not-italic gradient-text">For</em>
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {audienceGroups.map((g, i) => (
            <FadeSection key={g.title} delay={i * 100}>
              <div className="bg-background-50 border border-background-200 p-6 md:p-8 h-full text-center">
                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
                  {g.title}
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  {g.description}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* What We're NOT */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="max-w-3xl mx-auto">
          <div className="bg-background-100 border-2 border-background-200 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 mt-1 bg-foreground-950 rounded-full">
                <i className="ri-information-line text-xl text-background-50" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tighter text-foreground-950 mb-4">
                  What We&apos;re <em className="not-italic gradient-text">NOT</em>
                </h2>
                <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-foreground-400 mt-1 flex-shrink-0">&mdash;</span>
                    <span><strong className="text-foreground-950">Not a crisis service.</strong> If you are in immediate danger, call or text <strong>988</strong> or contact local emergency services.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground-400 mt-1 flex-shrink-0">&mdash;</span>
                    <span><strong className="text-foreground-950">Not therapy.</strong> Our circles are peer-led, not clinical. We complement professional care — we do not replace it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground-400 mt-1 flex-shrink-0">&mdash;</span>
                    <span><strong className="text-foreground-950">Not a social media platform.</strong> No algorithms, no follower counts, no vanity metrics. Just people being people.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground-400 mt-1 flex-shrink-0">&mdash;</span>
                    <span><strong className="text-foreground-950">Not for everyone — and that is okay.</strong> We are a specific kind of space for a specific kind of need. If it is not for you, we respect that.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-foreground-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <FadeSection>
            <p className="font-mono text-xs uppercase tracking-widest text-background-400 text-center mb-12">
              By the numbers
            </p>
          </FadeSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((s, i) => (
              <FadeSection key={s.label} delay={i * 120}>
                <div className="font-display text-5xl md:text-6xl tracking-tighter mb-2">
                  <em className="not-italic gradient-text">{s.number}</em>
                  <span className="text-background-50">{s.suffix}</span>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-background-400">
                  {s.label}
                </p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-background-100">
        <FadeSection className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
            Ready to Find Your <em className="not-italic gradient-text">People</em>?
          </h2>
          <p className="font-mono text-base text-foreground-600 leading-relaxed max-w-xl mx-auto mb-10">
            Joining takes under a minute. No real name required. Just show up — exactly as you are.
          </p>
          <a
            href="/register"
            className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-10 py-5 rounded-full whitespace-nowrap cursor-pointer inline-block"
          >
            Join the Community
          </a>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}