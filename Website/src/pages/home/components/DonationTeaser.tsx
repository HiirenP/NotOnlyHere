import { useRef, useEffect, useState } from 'react';

export default function DonationTeaser() {
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
    <section ref={ref} className="py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
      <div
        className="max-w-3xl mx-auto text-center transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-foreground-950 block mb-4">
          Support Our Mission
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
          Help Keep This Space <em className="not-italic gradient-text">Free Forever</em>
        </h2>
        <p className="font-mono text-base text-foreground-600 leading-relaxed max-w-xl mx-auto mb-10">
          NotOnlyHere will always be free for everyone. Your support — at any amount — helps us keep the servers running, the moderators paid, and the lights on.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-background-100 border-2 border-background-200 p-8 rounded-lg hover:border-foreground-300 transition-colors duration-200">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-3">Monthly</p>
            <p className="font-display text-4xl uppercase tracking-tighter text-foreground-950 mb-2">
              $5<span className="text-2xl text-foreground-400">/mo</span>
            </p>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-5">
              The price of a coffee. A quiet way to say &ldquo;this matters.&rdquo;
            </p>
            <a
              href="/support"
              className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-6 py-3 rounded-full whitespace-nowrap cursor-pointer inline-block"
            >
              Become a Supporter
            </a>
          </div>

          <div className="bg-background-100 border-2 border-background-200 p-8 rounded-lg hover:border-foreground-300 transition-colors duration-200">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-3">One-Time</p>
            <p className="font-display text-4xl uppercase tracking-tighter text-foreground-950 mb-2">
              Any <em className="not-italic gradient-text">Amount</em>
            </p>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-5">
              Give once, give occasionally. Every dollar keeps this community warm and open.
            </p>
            <a
              href="/support"
              className="font-mono text-xs uppercase tracking-widest border-2 border-foreground-950 text-foreground-950 px-6 py-3 rounded-full hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 whitespace-nowrap cursor-pointer inline-block"
            >
              Make a Donation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}