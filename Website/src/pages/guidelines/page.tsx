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

const rules = [
  {
    icon: 'ri-shield-user-line',
    title: '1. Be Kind, Always',
    description: 'Kindness is not optional here — it is the foundation of everything we do. Speak to others the way you would want to be spoken to on your hardest day. Disagreement is fine. Cruelty is not. Assume good intent, lead with empathy, and remember that everyone here is carrying something.',
  },
  {
    icon: 'ri-eye-off-line',
    title: '2. Respect Anonymity',
    description: 'Anonymity is sacred in this space. Never attempt to identify, track down, or expose another member\'s real identity. Do not ask for personal information. Do not share screenshots of conversations outside the community. What happens in NotOnlyHere stays in NotOnlyHere.',
  },
  {
    icon: 'ri-megaphone-line',
    title: '3. No Harassment or Hate Speech',
    description: 'We have zero tolerance for harassment, hate speech, threats, bullying, or discrimination of any kind — including based on race, gender, sexuality, religion, disability, or mental health status. Violations result in immediate removal. This is non-negotiable.',
  },
  {
    icon: 'ri-heart-pulse-line',
    title: '4. No Crisis Content or Graphic Descriptions',
    description: 'If you are in immediate crisis, this community is not the right place — please call or text 988. We ask members to avoid graphic descriptions of self-harm, suicide methods, or violence, as these can be deeply distressing to others. Share your feelings, not the details that could harm.',
  },
  {
    icon: 'ri-hand-heart-line',
    title: '5. Give Support, Not Advice',
    description: 'We are peers, not professionals. Share your own experiences and what helped you — but avoid telling others what they "should" do. Phrases like "what worked for me was..." land very differently than "you need to..." Presence and listening are more powerful than prescriptions.',
  },
  {
    icon: 'ri-user-voice-line',
    title: '6. Respect Boundaries and Consent',
    description: 'Do not send unsolicited direct messages. If someone does not respond, respect that silence. If someone asks you to stop a conversation, stop immediately. Everyone here has the right to participate at their own comfort level — including the right to simply read without posting.',
  },
  {
    icon: 'ri-alert-line',
    title: '7. Report, Do Not Retaliate',
    description: 'If you see something that violates these guidelines, use the Report button. Do not engage, do not escalate, do not try to handle it yourself. Our moderation team is trained to handle these situations with care. Reporting helps keep the entire community safe.',
  },
];

export default function GuidelinesPage() {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            Our Promise
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Community <em className="not-italic gradient-text">Guidelines</em>
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            These guidelines exist to keep NotOnlyHere safe, kind, and genuinely supportive for everyone. By joining, you agree to uphold them. They are not fine print — they are the heartbeat of this space.
          </p>
        </div>
      </section>

      {/* Preamble */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-base text-foreground-600 leading-relaxed">
            NotOnlyHere is a <strong className="text-foreground-950">peer-support community</strong> — not a social network, not a therapy platform, and not a free-for-all. Every rule below exists for one reason: to protect the safety, dignity, and emotional well-being of the people who show up here. If you cannot follow them, this space is not for you — and that is okay.
          </p>
        </FadeSection>
      </section>

      {/* Rules */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-3xl mx-auto space-y-8">
          {rules.map((rule, i) => (
            <FadeSection key={rule.title} delay={i * 80}>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-full bg-foreground-950 mt-1">
                  <i className={`${rule.icon} text-background-50 text-lg`} />
                </div>
                <div>
                  <h3 className="font-display text-xl tracking-tighter text-foreground-950 uppercase mb-2 leading-[0.9]">
                    {rule.title}
                  </h3>
                  <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Reporting Process */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <FadeSection className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-950 uppercase mb-8 leading-[0.9]">
            How to <em className="not-italic gradient-text">Report</em> a Concern
          </h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-background-100 border border-background-200 rounded-full">
                <span className="font-display text-sm gradient-text">1</span>
              </div>
              <div>
                <h4 className="font-display text-lg tracking-tighter text-foreground-950 uppercase mb-1">
                  Use the Report Button
                </h4>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  Every post and message has a Report button. Click it, select a reason, and submit. Your report is anonymous — the person you report will never know it was you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-background-100 border border-background-200 rounded-full">
                <span className="font-display text-sm gradient-text">2</span>
              </div>
              <div>
                <h4 className="font-display text-lg tracking-tighter text-foreground-950 uppercase mb-1">
                  Moderation Review
                </h4>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  Our trained moderation team reviews every report — usually within a few hours. They assess the situation, review context, and take appropriate action based on these guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-background-100 border border-background-200 rounded-full">
                <span className="font-display text-sm gradient-text">3</span>
              </div>
              <div>
                <h4 className="font-display text-lg tracking-tighter text-foreground-950 uppercase mb-1">
                  Action &amp; Follow-Up
                </h4>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  Depending on severity, actions range from a gentle reminder to permanent removal. We follow up with reporters when possible. If you believe a report was mishandled, you can escalate by emailing info@notonlyhere.com.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-background-100 border border-background-200 rounded-full">
                <span className="font-display text-sm gradient-text">4</span>
              </div>
              <div>
                <h4 className="font-display text-lg tracking-tighter text-foreground-950 uppercase mb-1">
                  Email for Urgent Issues
                </h4>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  For urgent safety concerns that cannot wait for the standard review process, email us directly at <a href="mailto:info@notonlyhere.com" className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer">info@notonlyhere.com</a> with &ldquo;URGENT&rdquo; in the subject line.
                </p>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* Crisis Box */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <FadeSection className="max-w-3xl mx-auto">
          <div className="bg-foreground-950 border-2 border-foreground-800 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-background-50 rounded-full mt-0.5">
                <i className="ri-alert-line text-foreground-950 text-xl" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-background-50 uppercase mb-4 leading-[0.9]">
                  If You Are in <em className="not-italic gradient-text">Crisis</em>
                </h2>
                <p className="font-mono text-sm text-background-400 leading-relaxed mb-5">
                  NotOnlyHere is a peer-support community, not a crisis or emergency service. If you are in immediate danger, experiencing thoughts of suicide, or need urgent support, please reach out to one of these resources:
                </p>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <span className="gradient-text flex-shrink-0 mt-0.5">&mdash;</span>
                    <div>
                      <p className="text-background-50 font-semibold">988 Suicide &amp; Crisis Lifeline</p>
                      <p className="text-background-400">Call or text <strong className="text-background-50">988</strong> — available 24/7, free, confidential.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="gradient-text flex-shrink-0 mt-0.5">&mdash;</span>
                    <div>
                      <p className="text-background-50 font-semibold">Crisis Text Line</p>
                      <p className="text-background-400">Text <strong className="text-background-50">HOME</strong> to <strong className="text-background-50">741741</strong> — free, 24/7 support via text.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="gradient-text flex-shrink-0 mt-0.5">&mdash;</span>
                    <div>
                      <p className="text-background-50 font-semibold">Emergency Services</p>
                      <p className="text-background-400">Call <strong className="text-background-50">911</strong> (US/Canada) or your local emergency number for immediate danger.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="gradient-text flex-shrink-0 mt-0.5">&mdash;</span>
                    <div>
                      <p className="text-background-50 font-semibold">The Trevor Project (LGBTQ+ Youth)</p>
                      <p className="text-background-400">Call <strong className="text-background-50">1-866-488-7386</strong> or text <strong className="text-background-50">START</strong> to <strong className="text-background-50">678678</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      <Footer />
    </main>
  );
}