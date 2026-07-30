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

const aiCards = [
  {
    title: 'AI Chat Companion',
    description: 'A 24/7 peer-support companion trained on active listening and empathy principles. It does not diagnose, prescribe, or replace human connection — it listens, reflects, and gently guides you toward community when you are ready.',
    icon: 'ri-robot-line',
    color: 'bg-accent-500',
  },
  {
    title: 'Crisis Detection',
    description: 'The AI is trained to recognize language that signals immediate danger. When it detects a crisis, it immediately shares the 988 Suicide & Crisis Lifeline and encourages contacting emergency services. Safety always comes first.',
    icon: 'ri-alert-line',
    color: 'bg-foreground-800',
  },
  {
    title: 'Circle Recommendations',
    description: 'Based on what you share, the AI can suggest circles that might resonate — Gentle Support for quiet moments, Late Night Lounge for the 2am crowd, or Night Shade for heavier conversations.',
    icon: 'ri-contrast-2-line',
    color: 'bg-primary-500',
  },
  {
    title: 'Moderation Assist',
    description: 'The AI helps our human moderators by flagging potentially harmful content for review. It never makes final decisions — real people always have the final say. Technology supports humanity; it does not replace it.',
    icon: 'ri-shield-check-line',
    color: 'bg-secondary-500',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Start a Conversation',
    description: 'Open the AI chat from any page. Type what is on your mind — no formatting, no pressure. The AI responds with reflective listening, not advice.',
  },
  {
    step: '02',
    title: 'Receive Gentle Support',
    description: 'The AI mirrors what you share, asks thoughtful follow-ups, and offers grounding exercises when appropriate. It feels like talking to someone who is truly paying attention.',
  },
  {
    step: '03',
    title: 'Connect to Community',
    description: 'When you are ready, the AI suggests relevant circles and encourages you to share with real people. It is a bridge — not a destination.',
  },
];

const notDoingList = [
  'The AI does not diagnose mental health conditions.',
  'The AI does not prescribe medication or treatment.',
  'The AI does not replace therapy or professional care.',
  'The AI does not store or share your conversation data.',
  'The AI does not make decisions about moderation — humans do.',
  'The AI does not replace human connection — it points toward it.',
];

const faqs = [
  {
    question: 'Is the AI a substitute for therapy?',
    answer: 'No. The AI is a peer-support companion, not a therapist. It provides reflective listening and grounding exercises based on peer-support principles. It does not diagnose, prescribe, or replace professional mental health care. If you are in crisis, call or text 988.',
  },
  {
    question: 'Does the AI store my conversations?',
    answer: 'No. Conversations with the AI are ephemeral. They are not stored, logged, or used to train other models. Your privacy is absolute.',
  },
  {
    question: 'How many messages can I send per day?',
    answer: 'Free accounts can send up to 50 messages per day with the AI companion. This limit helps keep the service sustainable while ensuring everyone has meaningful access.',
  },
  {
    question: 'What happens if the AI detects a crisis?',
    answer: 'The AI immediately responds with the 988 Suicide & Crisis Lifeline number and a gentle message encouraging you to reach out to a trusted person or emergency services. It is trained to prioritize safety above all else.',
  },
];

export default function AiSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (idx: number) => { setOpenFaq(openFaq === idx ? null : idx); };

  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            AI Companion
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            AI Support, <em className="not-italic gradient-text">Built with Care</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            A 24/7 peer-support companion that listens without judgment. Not a replacement for human connection — a bridge toward it. Available whenever you need someone to talk to.
          </p>
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {aiCards.map((card, i) => (
            <FadeSection key={card.title} delay={i * 100}>
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

      {/* How It Works — 3 Steps */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="text-center mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            How It Works
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            Three Steps to <em className="not-italic gradient-text">Feeling Heard</em>
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
          {howItWorks.map((item, i) => (
            <FadeSection key={item.step} delay={i * 150}>
              <div className="bg-background-50 border border-background-200 p-6 md:p-8 h-full text-center">
                <span className="font-display text-6xl tracking-tighter text-foreground-200 block mb-4 leading-none">
                  {item.step}
                </span>
                <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
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

      {/* What AI Does NOT Do */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="max-w-3xl mx-auto">
          <div className="bg-background-100 border-2 border-background-200 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 mt-1 bg-foreground-950 rounded-full">
                <i className="ri-information-line text-xl text-background-50" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tighter text-foreground-950 mb-4">
                  What Our AI <em className="not-italic gradient-text">Does NOT</em> Do
                </h2>
                <ul className="font-mono text-sm text-foreground-600 leading-relaxed space-y-3">
                  {notDoingList.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full bg-background-200">
                        <i className="ri-close-line text-foreground-500 text-xs" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* Disclaimer + 50 msgs/day info */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-3xl mx-auto space-y-6">
          <FadeSection>
            <div className="bg-background-50 border-l-4 border-accent-500 p-6 md:p-8">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 bg-accent-100 rounded-full">
                  <i className="ri-alert-line text-accent-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg uppercase tracking-tight text-foreground-950 mb-2">
                    Important Disclaimer
                  </h3>
                  <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                    The NotOnlyHere AI Companion is a peer-support tool, not a crisis service or clinical resource. If you are in immediate danger or experiencing a mental health emergency, call or text <strong className="text-foreground-950">988</strong> (Suicide & Crisis Lifeline) or contact local emergency services.
                  </p>
                </div>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={100}>
            <div className="bg-background-50 border-2 border-background-200 p-6 md:p-8 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-foreground-950 mx-auto mb-4">
                <i className="ri-chat-3-line text-xl text-background-50" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-2">
                50 Messages Per Day
              </h3>
              <p className="font-mono text-sm text-foreground-600 leading-relaxed max-w-md mx-auto">
                Free accounts include up to 50 AI messages per day — plenty for meaningful conversations while keeping the service sustainable for everyone. No paywalls, no premium tiers.
              </p>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="max-w-3xl mx-auto">
          <FadeSection className="text-center mb-12 md:mb-16">
            <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
              Common Questions
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
              About the <em className="not-italic gradient-text">AI Companion</em>
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
            Someone to <em className="not-italic gradient-text">Talk To</em>, Anytime
          </h2>
          <p className="font-mono text-base text-background-300 leading-relaxed max-w-xl mx-auto mb-10">
            The AI companion is available 24/7 for every member. Join NotOnlyHere and start a conversation — no pressure, no judgment.
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