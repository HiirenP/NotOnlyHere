import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const faqs = [
  {
    question: 'Is NotOnlyHere really free?',
    answer: 'Yes — and it always will be. No paywalls, no premium tiers. We are funded by community donations and keep access open for everyone.',
  },
  {
    question: 'Can I post anonymously?',
    answer: 'Absolutely. Anonymous posting is core to our platform. Share without your name, and still be heard with the same kindness.',
  },
  {
    question: 'How are circles moderated?',
    answer: 'Every circle has trained human moderators who enforce our community guidelines. We have zero tolerance for harassment or harmful behavior.',
  },
  {
    question: 'What if I am in crisis right now?',
    answer: 'NotOnlyHere is peer support, not crisis care. If you are in immediate danger, please call or text 988 (Suicide & Crisis Lifeline) or contact local emergency services.',
  },
];

export default function FAQTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section ref={ref} className="py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 md:mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-950 block mb-3">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
            You Might <em className="not-italic gradient-text">Be Wondering</em>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="bg-background-50 border border-background-200 overflow-hidden transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-mono text-sm font-semibold text-foreground-950 pr-4">
                  {faq.question}
                </span>
                <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-foreground-400">
                  <i className={`${openIndex === i ? 'ri-subtract-line' : 'ri-add-line'} text-lg`} />
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/faq"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-foreground-950 hover:gradient-text transition-colors duration-200 cursor-pointer"
          >
            See all FAQs <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}