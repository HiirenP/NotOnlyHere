import { useState, useRef, useEffect } from 'react';
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

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-background-200 bg-background-50">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer"
      >
        <span className="font-display text-lg md:text-xl tracking-tighter text-foreground-950 uppercase pr-4">
          {question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-background-300 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          <i className="ri-add-line text-foreground-600" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 md:px-6 pb-5 md:pb-6 font-mono text-sm text-foreground-600 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: 'Is NotOnlyHere really free?',
    answer: 'Yes, completely free. The core community experience — joining circles, posting, messaging, and using the AI companion — will always be free. We offer an optional Supporter tier ($5/mo) and Champion tier ($15/mo) for those who want to help sustain the community, but nothing is paywalled. Peer support should never be behind a paywall.',
  },
  {
    question: 'Do I have to use my real name?',
    answer: 'Not at all. Anonymity is built into the platform by design. You choose a display name — it can be anything you want. No real name required, no social media linking, no identity verification. We believe honest sharing is easier when you do not have to worry about your digital footprint.',
  },
  {
    question: 'Can I post anonymously?',
    answer: 'Yes. Every post gives you the option to share anonymously — even within circles. When you post anonymously, only your circle moderators can see the connection to your account (for safety purposes). Other members see your post without any name attached. You can also toggle between anonymous and named posting for every single post.',
  },
  {
    question: 'Is NotOnlyHere a substitute for therapy?',
    answer: 'No — and we want to be very clear about this. NotOnlyHere is a peer-support community, not a clinical service. We do not provide therapy, diagnosis, or medical advice. Our circles are facilitated by trained peers, not licensed therapists. We strongly believe peer support can complement professional care — but it should never replace it.',
  },
  {
    question: 'Is there an age requirement?',
    answer: 'You must be at least 16 years old to join NotOnlyHere. We take youth safety seriously: members under 18 are placed in age-appropriate circles with additional moderation. If you are under 16, we encourage you to talk to a trusted adult or reach out to youth-focused support services.',
  },
  {
    question: 'What are circles and how do they work?',
    answer: 'Circles are themed support groups where members gather around shared experiences or needs. Each circle has a dedicated space for posts, replies, and real-time discussion. Examples include Gentle Support (general emotional support), Late Night Lounge (nighttime connection), Night Shade (raw, unfiltered sharing), and First Time Here (beginner-friendly introductions). You can join as many circles as you like and participate at your own pace.',
  },
  {
    question: 'How does the AI companion work?',
    answer: 'Our AI companion is a 24/7 peer-support chatbot designed to listen without judgment. It can help you process feelings, offer gentle prompts, and point you toward relevant circles or resources. Importantly: the AI does not diagnose, does not prescribe, does not store your conversations, and will escalate to crisis resources (like 988) if it detects signs of immediate danger. It is limited to 50 messages per day to encourage community connection.',
  },
  {
    question: 'Is there a mobile app?',
    answer: 'No. NotOnlyHere is a web-based community platform. Simply create a free account and log in from any phone, tablet, or computer browser. You get full access to Circles, messaging, anonymous posting, wellness check-ins, and AI support — no App Store or Google Play download needed.',
  },
  {
    question: 'How do I report inappropriate behavior?',
    answer: 'Every post and message includes a Report button. Our moderation team reviews every report, usually within a few hours. We have a zero-tolerance policy for harassment, hate speech, and predatory behavior. You can also report issues directly by emailing info@notonlyhere.com or using the Contact page. If you ever feel unsafe, please step away and reach out to us.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'You can delete your account at any time from your Settings page. Once deleted, all your posts, messages, and personal data are permanently removed from our servers within 30 days. If you would like your data removed immediately, email us at info@notonlyhere.com and we will expedite the process. You are always in control of your presence here.',
  },
  {
    question: 'How can I support or donate to NotOnlyHere?',
    answer: 'There are several ways to support us! You can become a Monthly Supporter ($5/mo) or Champion ($15/mo), make a one-time donation of any amount, or simply share NotOnlyHere with someone who might need it. Every contribution — financial or otherwise — helps us keep the lights on, pay our moderators, and build new features. Visit our Support page for details.',
  },
  {
    question: 'What happens to my data?',
    answer: 'We take privacy seriously. We do not sell your data. We do not share your information with advertisers. We do not build profiles on you. Your messages and posts are encrypted in transit and at rest. You can request a copy of your data or ask us to delete it at any time. Read our full Privacy Policy for the detailed version — it is written in plain English, not legalese.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            Answers
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Frequently Asked <em className="not-italic gradient-text">Questions</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Honest answers to the most common questions about NotOnlyHere. If you do not find what you are looking for, we are just a message away.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <FadeSection key={i} delay={i * 60}>
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => toggleFAQ(i)}
              />
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 md:py-24 bg-foreground-950">
        <FadeSection className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-background-400 block mb-3">
            Still Curious?
          </span>
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-background-50 uppercase mb-4 leading-[0.9]">
            We Are <em className="not-italic gradient-text">Here</em> to Help
          </h2>
          <p className="font-mono text-sm text-background-400 leading-relaxed mb-8 max-w-md mx-auto">
            Could not find what you were looking for? Send us a message and we will get back to you within 48 hours.
          </p>
          <a
            href="/contact"
            className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-10 py-5 rounded-full whitespace-nowrap cursor-pointer inline-block"
          >
            Contact Us
          </a>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}