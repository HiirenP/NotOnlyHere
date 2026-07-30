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

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in under a minute. Pick a username that feels safe — no real name required. We ask for nothing except an email and a willingness to show up.',
    icon: 'ri-user-add-line',
    details: [
      'No real name required',
      'Email verification only',
      'Choose a username that feels right',
      'Set your privacy preferences',
    ],
  },
  {
    number: '02',
    title: 'Browse Circles',
    description: 'Explore themed circles like Gentle Support, Late Night Lounge, Night Shade, and First Time Here. Read the vibe. Find one that feels like home.',
    icon: 'ri-group-line',
    details: [
      '6+ themed circles to choose from',
      'Read circle descriptions and guidelines',
      'Lurk as long as you need — no pressure',
      'Join as many or as few as you like',
    ],
  },
  {
    number: '03',
    title: 'Share or Listen',
    description: 'Post anonymously, respond with kindness, or just read. There is no scoreboard, no follower count, and no pressure to speak before you are ready.',
    icon: 'ri-chat-1-line',
    details: [
      'Post anonymously or with your username',
      'Respond with empathy — not advice',
      'No likes, no shares, no metrics',
      'Being a quiet listener is participation',
    ],
  },
  {
    number: '04',
    title: 'Connect on the Web',
    description: 'Message members you trust, check in with yourself, and grow at your pace. Access your full community from any browser — phone, tablet, or desktop. No app needed.',
    icon: 'ri-heart-line',
    details: [
      'No streaks, no guilt, no push notifications',
      'Come back when it feels right',
      'Build real relationships over time',
      'Your circle is always here for you',
    ],
  },
];

const circleFlow = [
  { step: 'Join', description: 'Pick a circle that resonates. Read the description, check the vibe, and join when you are ready.', icon: 'ri-user-add-line' },
  { step: 'Read', description: 'Scroll through recent posts. See what people are sharing. Get a feel for the tone of the space.', icon: 'ri-book-open-line' },
  { step: 'Post', description: 'When you are comfortable, share something. Anonymously or not. Long or short. There is no wrong way.', icon: 'ri-edit-line' },
  { step: 'Connect', description: 'Respond to others. Build quiet threads of support. Over time, faces become familiar and space feels like home.', icon: 'ri-heart-line' },
];

const faqs = [
  {
    question: 'Do I need to use my real name?',
    answer: 'No. You choose a username that feels safe. Many members use pseudonyms, and anonymous posting is always available. Your real identity is never required.',
  },
  {
    question: 'Is it really free?',
    answer: 'Yes — and it always will be. NotOnlyHere is funded by community donations. There are no paywalls, no premium tiers, and no plans to introduce them.',
  },
  {
    question: 'How does anonymous posting work?',
    answer: 'When you create a post, you can toggle anonymous mode on. Your username is hidden, but the post still goes through our moderation system and community guidelines apply. Anonymity is about safety, not about avoiding accountability.',
  },
  {
    question: 'What happens after I join a circle?',
    answer: 'You can immediately read posts, respond to others, or create your own post. There is no minimum activity requirement. You can participate as much or as little as you want.',
  },
  {
    question: 'How are circles moderated?',
    answer: 'Every circle has trained human moderators who enforce our community guidelines. They remove harmful content, de-escalate conflicts, and make sure the space stays warm. We have zero tolerance for harassment.',
  },
  {
    question: 'Can I join more than one circle?',
    answer: 'Absolutely. You can join as many circles as you like. Different circles serve different needs — you might want Gentle Support during the day and Late Night Lounge after midnight.',
  },
  {
    question: 'Do I need to download an app?',
    answer: 'No. NotOnlyHere runs entirely in your web browser. Create a free account, log in from any device, and access everything online — including circles, anonymous posting, messaging, and the AI companion. No App Store or Google Play download required.',
  },
  {
    question: 'What if I just want to read and not post?',
    answer: 'That is completely fine. Many members are quiet listeners who rarely or never post. Reading, being present, and offering silent solidarity is genuine participation. You do not have to speak to belong.',
  },
  {
    question: 'How is this different from a forum or Reddit?',
    answer: 'Forums optimize for discussion and karma. We optimize for emotional safety and human connection. No upvotes, no downvotes, no karma — just people showing up for each other with kindness.',
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            Getting Started
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            From Curious to <em className="not-italic gradient-text">Connected</em> in 4 Simple Steps
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Joining NotOnlyHere takes under a minute. Finding your people takes as long as it takes — and that is okay. Here is how it works.
          </p>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="space-y-16 md:space-y-24">
          {steps.map((step, i) => (
            <FadeSection key={step.number} delay={i * 100}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="lg:col-span-2">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-foreground-950 mb-4">
                    <i className={`${step.icon} text-2xl text-background-50`} />
                  </div>
                  <span className="font-display text-6xl md:text-7xl tracking-tighter text-foreground-200 leading-none">
                    {step.number}
                  </span>
                </div>
                <div className="lg:col-span-5">
                  <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tighter text-foreground-950 mb-4 leading-[0.9]">
                    {step.title}
                  </h2>
                  <p className="font-mono text-base text-foreground-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <div className="bg-background-100 border border-background-200 p-6">
                    <ul className="space-y-3">
                      {step.details.map((d) => (
                        <li key={d} className="flex items-start gap-3">
                          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-accent-100">
                            <i className="ri-check-line text-accent-600 text-xs" />
                          </span>
                          <span className="font-mono text-sm text-foreground-700">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Anonymous vs Public */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Your Choice
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            Anonymous or <em className="not-italic gradient-text">Public</em> — You Decide
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto">
          <FadeSection delay={100}>
            <div className="bg-background-50 border-2 border-foreground-950 p-8 md:p-10 h-full">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-foreground-950 mb-5">
                <i className="ri-shield-user-line text-2xl text-background-50" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-tighter text-foreground-950 mb-4">
                Anonymous Posting
              </h3>
              <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-5">
                Toggle anonymity on any post. Your username is hidden — but your words still matter. Community guidelines still apply, and moderators still keep the space safe.
              </p>
              <ul className="space-y-2 font-mono text-sm text-foreground-500">
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">&mdash;</span>
                  <span>Share without fear of judgment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">&mdash;</span>
                  <span>Be honest when honesty feels risky</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">&mdash;</span>
                  <span>Same moderation standards apply</span>
                </li>
              </ul>
            </div>
          </FadeSection>

          <FadeSection delay={200}>
            <div className="bg-background-50 border-2 border-background-200 p-8 md:p-10 h-full">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-background-100 mb-5">
                <i className="ri-user-line text-2xl text-foreground-700" />
              </div>
              <h3 className="font-display text-2xl uppercase tracking-tighter text-foreground-950 mb-4">
                Public Posting
              </h3>
              <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-5">
                Use your username. Build recognition in your circles. Let people connect with you over time. Public posting builds identity — but it is always your choice.
              </p>
              <ul className="space-y-2 font-mono text-sm text-foreground-500">
                <li className="flex items-start gap-2">
                  <span className="text-foreground-400 mt-0.5">&mdash;</span>
                  <span>Build your circle identity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground-400 mt-0.5">&mdash;</span>
                  <span>Others can recognize and respond to you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground-400 mt-0.5">&mdash;</span>
                  <span>Switch to anonymous anytime</span>
                </li>
              </ul>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Circle Flow */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Circle Flow
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            Your Journey <em className="not-italic gradient-text">in a Circle</em>
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {circleFlow.map((item, i) => (
            <FadeSection key={item.step} delay={i * 120}>
              <div className="bg-background-100 border border-background-200 p-6 md:p-8 h-full text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-foreground-950 mx-auto mb-5">
                  <i className={`${item.icon} text-xl text-background-50`} />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-2">
                  Step {i + 1}
                </span>
                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
                  {item.step}
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Safety at Signup */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="max-w-3xl mx-auto">
          <div className="bg-background-50 border-2 border-background-200 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 mt-1 bg-accent-500 rounded-full">
                <i className="ri-lock-line text-xl text-background-50" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tighter text-foreground-950 mb-4">
                  Safety <em className="not-italic gradient-text">at Signup</em>
                </h2>
                <div className="font-mono text-sm text-foreground-600 leading-relaxed space-y-3">
                  <p>
                    We take privacy seriously from the very first click. Here is what happens — and what does not.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-accent-100">
                        <i className="ri-check-line text-accent-600 text-xs" />
                      </span>
                      <span><strong className="text-foreground-950">No real name required.</strong> Your email is only used for verification and account recovery.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-accent-100">
                        <i className="ri-check-line text-accent-600 text-xs" />
                      </span>
                      <span><strong className="text-foreground-950">No social media linking.</strong> We never ask you to connect accounts. Your NotOnlyHere identity stands alone.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-accent-100">
                        <i className="ri-check-line text-accent-600 text-xs" />
                      </span>
                      <span><strong className="text-foreground-950">No data selling.</strong> We do not sell, share, or monetize your information. Period.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-accent-100">
                        <i className="ri-check-line text-accent-600 text-xs" />
                      </span>
                      <span><strong className="text-foreground-950">You can delete everything.</strong> Your account, your posts, your data — permanently removable at any time.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="max-w-3xl mx-auto">
          <FadeSection className="text-center mb-12 md:mb-16">
            <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
              Common Questions
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
              You Might <em className="not-italic gradient-text">Be Wondering</em>
            </h2>
          </FadeSection>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeSection key={faq.question} delay={i * 80}>
                <div className="bg-background-100 border border-background-200 overflow-hidden">
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
            Ready to Take the <em className="not-italic gradient-text">First Step</em>?
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed max-w-xl mx-auto mb-10">
            Under a minute to sign up. Zero pressure. Just a warm space waiting for you.
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