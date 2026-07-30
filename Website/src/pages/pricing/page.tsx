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

const plans = [
  {
    name: 'Community',
    price: 'Free',
    period: 'forever',
    description: 'Everything you need to feel seen. No trials, no credit card, no catch.',
    icon: 'ri-heart-line',
    color: 'bg-accent-500',
    popular: true,
    features: [
      'Join any circle',
      'Post anonymously or publicly',
      'Read and respond to posts',
      'AI Companion — 50 messages/day',
      'Daily wellness check-ins',
      'Community events',
      'Resource library',
    ],
  },
  {
    name: 'Supporter',
    price: '$5',
    period: '/month',
    description: 'Support the community and get a little extra. Purely optional — everything that matters stays free.',
    icon: 'ri-star-line',
    color: 'bg-primary-500',
    popular: false,
    features: [
      'Everything in Community',
      'Supporter profile badge',
      'Early access to new features',
      'Monthly community update',
      'Priority feature requests',
      'Cancel anytime',
    ],
  },
  {
    name: 'Champion',
    price: '$15',
    period: '/month',
    description: 'Go further. Help fund new circles and keep the community thriving for everyone.',
    icon: 'ri-shield-star-line',
    color: 'bg-secondary-500',
    popular: false,
    features: [
      'Everything in Supporter',
      'Vote on new circle ideas',
      'Name in community credits',
      'Priority feature requests',
      'Cancel anytime',
    ],
  },
];

const faqs = [
  {
    question: 'Is NotOnlyHere really free?',
    answer: 'Yes — and it always will be. Every core feature is free: circles, anonymous posting, the AI companion (50 messages/day), wellness check-ins, events, and the resource library. There are no paywalls and no plans to introduce them. Supporter and Champion tiers are entirely optional ways to help keep the community running.',
  },
  {
    question: 'What happens if I stop being a Supporter?',
    answer: 'Your account simply returns to the free Community tier. You keep your profile, your posts, your circles — everything you created stays. The supporter badge and early access perks go away, but nothing else changes.',
  },
  {
    question: 'Are any features locked behind a paywall?',
    answer: 'No. Every feature that matters — circles, anonymous posting, the AI companion, wellness check-ins, events, and the resource library — is available to every member for free. Supporter and Champion tiers add cosmetic perks and community recognition, never feature restrictions.',
  },
  {
    question: 'Why accept donations if everything is free?',
    answer: 'Running a safe, moderated community costs real money: hosting, moderation staff, development, and community programs. Donations keep the door open for everyone — including people who cannot afford to pay. We believe access to peer support should not depend on your bank account.',
  },
  {
    question: 'Can organizations or groups support NotOnlyHere?',
    answer: 'Yes. If you represent an organization that would like to support NotOnlyHere, reach out through our contact page. We welcome partnerships that align with our mission of making peer support accessible to everyone.',
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (idx: number) => { setOpenFaq(openFaq === idx ? null : idx); };

  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            Pricing
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Simple, <em className="not-italic gradient-text">Honest</em> Pricing
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            NotOnlyHere is free for everyone — and always will be. Supporter tiers are entirely optional ways to help keep the community running. No tricks, no paywalls, no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <FadeSection key={plan.name} delay={i * 120}>
              <div className={`bg-background-100 border-2 ${plan.popular ? 'border-primary-500' : 'border-background-200'} p-6 md:p-8 h-full flex flex-col ${plan.popular ? 'relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-background-50 font-mono text-[10px] uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className={`w-14 h-14 flex items-center justify-center rounded-full ${plan.color} mb-5`}>
                  <i className={`${plan.icon} text-xl text-background-50`} />
                </div>

                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-1">
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span className="font-display text-4xl tracking-tighter text-foreground-950">
                    {plan.price}
                  </span>
                  <span className="font-mono text-sm text-foreground-400"> {plan.period}</span>
                </div>

                <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-6 flex-1">
                  {plan.description}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-accent-100">
                        <i className="ri-check-line text-accent-600 text-xs" />
                      </span>
                      <span className="font-mono text-sm text-foreground-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.name === 'Community' ? '/register' : plan.name === 'Champion' ? '/support' : '/support'}
                  className={`font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-full text-center whitespace-nowrap cursor-pointer inline-block w-full ${
                    plan.popular
                      ? 'gradient-btn text-background-50'
                      : 'border-2 border-foreground-950 text-foreground-950 hover:bg-foreground-950 hover:text-background-50 transition-all duration-200'
                  }`}
                >
                  {plan.name === 'Community' ? 'Join Free' : 'Support the Community'}
                </a>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-3xl mx-auto">
          <FadeSection className="text-center mb-12 md:mb-16">
            <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
              Common Questions
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
              Nothing <em className="not-italic gradient-text">Paywalled</em>
            </h2>
            <p className="font-mono text-sm text-foreground-500 mt-4 max-w-xl mx-auto leading-relaxed">
              Every core feature is free. Supporter tiers are about helping the community — not unlocking features.
            </p>
          </FadeSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeSection key={faq.question} delay={i * 80}>
                <div className="bg-background-50 border border-background-200 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="font-mono text-sm font-semibold text-foreground-950 pr-4">
                      {faq.question}
                    </span>
                    <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-foreground-400">
                      <i className={`${openFaq === i ? 'ri-subtract-line' : 'ri-add-line'} text-lg`} />
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-foreground-950">
        <FadeSection className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-background-50 uppercase mb-6 leading-[0.9]">
            Free Forever. <em className="not-italic gradient-text">No Catch.</em>
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed max-w-xl mx-auto mb-10">
            Peer support should never depend on your bank account. Join NotOnlyHere — completely free, always.
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