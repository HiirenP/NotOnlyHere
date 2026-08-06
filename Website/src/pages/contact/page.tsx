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

const subjects = [
  'General Inquiry',
  'Partnership',
  'Report an Issue',
  'Request a Circle',
  'Media',
  'Other',
];

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [nlEmail, setNlEmail] = useState('');
  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);
  const [nlError, setNlError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const honeypot = (data.get('phone_alt') as string || '').trim();
    if (honeypot) {
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      return;
    }
    data.delete('phone_alt');

    setLoading(true);
    setFormError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch {
      setFormError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const honeypot = (data.get('company_alt') as string || '').trim();
    if (honeypot) {
      setNlSubmitted(true);
      return;
    }
    data.delete('company_alt');

    setNlLoading(true);
    setNlError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setNlSubmitted(true);
      setNlEmail('');
    } catch {
      setNlError('Unable to connect. Please try again.');
    } finally {
      setNlLoading(false);
    }
  };

  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            Get In Touch
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            We&apos;d Love to <em className="not-italic gradient-text">Hear</em> From You
          </h1>
          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto">
            Whether you have a question, want to partner with us, need help, or just want to say hello — we read every message and respond within 48 hours.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16">
          {/* Form */}
          <FadeSection className="lg:col-span-3">
            {submitted ? (
              <div className="bg-background-100 border border-background-200 p-10 md:p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-background-200">
                  <i className="ri-check-line text-2xl text-foreground-700" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl tracking-tighter text-foreground-950 uppercase mb-3">
                  Message <em className="not-italic gradient-text">Sent</em>
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed max-w-md mx-auto mb-8">
                  Thank you for reaching out. We read every message and do our best to respond within 48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-mono text-xs uppercase tracking-widest border-2 border-foreground-800 text-foreground-800 px-8 py-3 rounded-full cursor-pointer hover:bg-foreground-800 hover:text-background-50 transition-colors duration-200 whitespace-nowrap"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-background-100 border border-background-200 p-8 md:p-10"
              >
                {/* Honeypot */}
                <input
                  type="text"
                  name="phone_alt"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  readOnly
                  className="sr-only"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="contact-name" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full font-mono text-sm px-4 py-3 bg-white border border-background-200 focus:outline-none focus:border-foreground-400 text-foreground-950"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full font-mono text-sm px-4 py-3 bg-white border border-background-200 focus:outline-none focus:border-foreground-400 text-foreground-950"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="contact-subject" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
                    className="w-full font-mono text-sm px-4 py-3 bg-white border border-background-200 focus:outline-none focus:border-foreground-400 text-foreground-950 cursor-pointer appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: '40px' }}
                  >
                    <option value="">Select a topic</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={500}
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    className="w-full font-mono text-sm px-4 py-3 bg-white border border-background-200 focus:outline-none focus:border-foreground-400 text-foreground-950 resize-none"
                  />
                  <p className="font-mono text-xs text-foreground-400 mt-1 text-right">
                    {formState.message.length}/500
                  </p>
                </div>

                {formError && (
                  <p className="font-mono text-xs text-red-500 mb-4">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-10 py-4 text-center cursor-pointer disabled:opacity-50 whitespace-nowrap w-full sm:w-auto"
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </FadeSection>

          {/* Info Sidebar */}
          <FadeSection className="lg:col-span-2" delay={200}>
            <div className="space-y-8">
              <div>
                <h3 className="font-display text-2xl tracking-tighter text-foreground-950 uppercase mb-3 leading-[0.9]">
                  Email Us
                </h3>
                <a
                  href="mailto:info@notonlyhere.com"
                  className="font-mono text-sm text-foreground-600 hover:gradient-text transition-colors duration-200 cursor-pointer"
                >
                  info@notonlyhere.com
                </a>
              </div>

              <div>
                <h3 className="font-display text-2xl tracking-tighter text-foreground-950 uppercase mb-3 leading-[0.9]">
                  Response Time
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                  We read every message and respond within <strong className="text-foreground-950">48 hours</strong>. If you need immediate support, please call or text <strong>988</strong> for the Crisis Lifeline.
                </p>
              </div>

              <div className="border-t border-background-200 pt-8">
                <h3 className="font-display text-2xl tracking-tighter text-foreground-950 uppercase mb-4 leading-[0.9]">
                  Stay <em className="not-italic gradient-text">Connected</em>
                </h3>
                <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-5">
                  Get thoughtful reflections and community stories delivered to your inbox. No noise — just real writing.
                </p>

                {nlSubmitted ? (
                  <p className="font-mono text-sm text-foreground-600 bg-background-100 border border-background-200 px-4 py-3 text-center">
                    Thanks for subscribing!
                  </p>
                ) : (
                  <form
                    onSubmit={handleNewsletter}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input
                      type="text"
                      name="company_alt"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      readOnly
                      className="sr-only"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={nlEmail}
                      onChange={(e) => setNlEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 font-mono text-sm px-4 py-2.5 bg-white border border-background-200 focus:outline-none focus:border-foreground-400 text-foreground-950"
                    />
                    <button
                      type="submit"
                      disabled={nlLoading}
                      className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-5 py-2.5 whitespace-nowrap cursor-pointer disabled:opacity-50"
                    >
                      {nlLoading ? 'Sending…' : 'Subscribe'}
                    </button>
                    {nlError && (
                      <p className="font-mono text-xs text-red-500 w-full">{nlError}</p>
                    )}
                  </form>
                )}
              </div>

              <div className="bg-background-100 border-2 border-background-200 p-6 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-foreground-950 rounded-full mt-0.5">
                    <i className="ri-information-line text-background-50" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-foreground-600 leading-relaxed">
                      <strong className="text-foreground-950">NotOnlyHere is a peer-support community,</strong> not a crisis service. If you are in distress, please call or text <strong>988</strong> or contact local emergency services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}