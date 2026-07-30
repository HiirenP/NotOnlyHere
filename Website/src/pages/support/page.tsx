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

const tiers = [
  {
    name: 'Monthly Supporter',
    price: '$5',
    period: '/month',
    description: 'Keep the lights on. Your monthly contribution helps cover hosting, moderation tools, and keeps NotOnlyHere free for everyone.',
    icon: 'ri-heart-line',
    color: 'bg-accent-500',
    highlights: [
      'Early access to new features',
      'Supporter badge on your profile',
      'Monthly community update',
      'Cancel anytime',
    ],
    primary: false,
  },
  {
    name: 'Champion',
    price: '$15',
    period: '/month',
    description: 'Go further. Champions help fund new circles, community events, and keep our moderation team strong. Your generosity shapes the future of NotOnlyHere.',
    icon: 'ri-star-line',
    color: 'bg-primary-500',
    highlights: [
      'Everything in Supporter',
      'Vote on new circle ideas',
      'Name in community credits',
      'Priority feature requests',
      'Cancel anytime',
    ],
    primary: true,
  },
  {
    name: 'One-Time Gift',
    price: 'You Choose',
    period: '',
    description: 'Give what feels right. Every contribution — whether $10, $25, $50, or a custom amount — directly supports the community. No commitment, just kindness.',
    icon: 'ri-gift-line',
    color: 'bg-secondary-500',
    highlights: [
      'Suggested: $10, $25, $50',
      'Custom amount available',
      'One-time — no recurring',
      'Every dollar makes a difference',
    ],
    primary: false,
  },
];

const transparency = [
  { label: 'Hosting & Infrastructure', percent: 40, color: 'bg-accent-500' },
  { label: 'Moderation Team', percent: 30, color: 'bg-primary-500' },
  { label: 'Development', percent: 20, color: 'bg-secondary-500' },
  { label: 'Community Programs', percent: 10, color: 'bg-foreground-800' },
];

export default function SupportPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            Community Support
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Support the <em className="not-italic gradient-text">NotOnlyHere</em> Community
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            NotOnlyHere is free for everyone — and always will be. But keeping a safe, warm space running costs real money. If this community has meant something to you, consider supporting it.
          </p>
        </div>
      </section>

      {/* Why Support */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto">
          <FadeSection>
            <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
              Why Support
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
              Because Community <em className="not-italic gradient-text">Is Free</em> — But Servers Are Not
            </h2>
            <div className="font-mono text-base leading-relaxed text-foreground-700 space-y-4">
              <p>
                NotOnlyHere will never have a paywall. No premium tiers that lock features away. No ads fueled by your data. No algorithms optimizing for your attention.
              </p>
              <p>
                But running a safe, moderated community costs real money. We pay for hosting, we pay our moderation team, and we invest in the tools that keep this space warm.
              </p>
              <p>
                When you support NotOnlyHere, you are not buying a product. You are keeping the door open — for the person who needs it at 2am, for the first-timer who is scared to post, for the quiet listener who just needs a place to belong.
              </p>
            </div>
          </FadeSection>

          <FadeSection delay={200}>
            <div className="relative bg-background-50 p-4 pb-12 shadow-lg rotate-1">
              <div className="absolute top-3 left-1/3 w-20 h-5 bg-accent-300/70 rotate-[-8deg] z-10" style={{ borderRadius: '2px' }} />
              <div className="absolute bottom-8 right-4 w-16 h-4 bg-primary-300/70 rotate-[5deg] z-10" style={{ borderRadius: '2px' }} />
              <div className="w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://readdy.ai/api/search-image?query=People%20sitting%20in%20a%20warm%20cozy%20circle%20sharing%20stories%20and%20supporting%20each%20other%20soft%20candlelight%20gentle%20atmosphere%20community%20gathering%20editorial%20photography%20warm%20earth%20tones&width=800&height=1000&seq=support-community-1&orientation=portrait"
                  alt="Community members supporting each other in a warm circle"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mt-4 text-center">
                You keep this door open
              </p>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Ways to Give
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            Choose What <em className="not-italic gradient-text">Feels Right</em>
          </h2>
          <p className="font-mono text-sm text-foreground-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Every contribution — monthly or one-time — directly supports the community. No hidden fees, no minimum commitment.
          </p>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <FadeSection key={tier.name} delay={i * 120}>
              <div className={`bg-background-50 border-2 ${tier.primary ? 'border-primary-500' : 'border-background-200'} p-6 md:p-8 h-full flex flex-col ${tier.primary ? 'relative' : ''}`}>
                {tier.primary && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-background-50 font-mono text-[10px] uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap">
                    Most Impact
                  </div>
                )}

                <div className={`w-14 h-14 flex items-center justify-center rounded-full ${tier.color} mb-5`}>
                  <i className={`${tier.icon} text-xl text-background-50`} />
                </div>

                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-1">
                  {tier.name}
                </h3>

                <div className="mb-4">
                  <span className="font-display text-4xl tracking-tighter text-foreground-950">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="font-mono text-sm text-foreground-400">{tier.period}</span>
                  )}
                </div>

                <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-6 flex-1">
                  {tier.description}
                </p>

                <ul className="space-y-2 mb-8">
                  {tier.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-accent-100">
                        <i className="ri-check-line text-accent-600 text-xs" />
                      </span>
                      <span className="font-mono text-sm text-foreground-600">{h}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.name === 'One-Time Gift' ? '/contact' : '/register'}
                  className={`font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-full text-center whitespace-nowrap cursor-pointer inline-block w-full ${
                    tier.primary
                      ? 'gradient-btn text-background-50'
                      : 'border-2 border-foreground-950 text-foreground-950 hover:bg-foreground-950 hover:text-background-50 transition-all duration-200'
                  }`}
                >
                  {tier.name === 'One-Time Gift' ? 'Contact Us to Give' : 'Become a Supporter'}
                </a>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Share & Invite */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="max-w-3xl mx-auto">
          <div className="bg-background-100 border-2 border-background-200 p-8 md:p-10 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent-500 mx-auto mb-5">
              <i className="ri-share-forward-line text-2xl text-background-50" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-foreground-950 mb-4">
              The <em className="not-italic gradient-text">Most Valuable</em> Support Is Free
            </h2>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed max-w-xl mx-auto mb-8">
              Not everyone can give money — and that is more than okay. Sharing NotOnlyHere with someone who might need it is one of the most powerful ways to support the community. A single invite can change a life.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {['ri-twitter-x-line', 'ri-facebook-line', 'ri-linkedin-line', 'ri-mail-line'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-12 h-12 flex items-center justify-center border-2 border-background-200 rounded-full hover:border-foreground-950 transition-all duration-200 cursor-pointer"
                  aria-label={icon}
                >
                  <i className={`${icon} text-foreground-600`} />
                </a>
              ))}
            </div>
          </div>
        </FadeSection>
      </section>

      {/* Transparency */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Transparency
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            Where Your <em className="not-italic gradient-text">Support</em> Goes
          </h2>
          <p className="font-mono text-sm text-foreground-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Every dollar is accounted for. Here is how contributions are spent.
          </p>
        </FadeSection>

        <FadeSection delay={100} className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {transparency.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm text-foreground-700">{item.label}</span>
                  <span className="font-mono text-sm font-semibold text-foreground-950">{item.percent}%</span>
                </div>
                <div className="w-full h-3 bg-background-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-foreground-400 mt-6 text-center leading-relaxed">
            Based on projected 2026 spending. Detailed financial reports available by request.
          </p>
        </FadeSection>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-foreground-950">
        <FadeSection className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-background-50 uppercase mb-6 leading-[0.9]">
            Every Contribution <em className="not-italic gradient-text">Keeps the Door</em> Open
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed max-w-xl mx-auto mb-10">
            Whether you give $5 or share the community with a friend — you are part of what makes NotOnlyHere possible.
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