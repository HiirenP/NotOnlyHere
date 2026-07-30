import { useRef, useEffect, useState } from 'react';

export default function WebCommunityAccess() {
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
    <section ref={ref} className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
      <div
        className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
          Web Community
        </span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
          Access Everything <em className="not-italic gradient-text">Online</em> — No App Required
        </h2>
        <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl mx-auto mb-10">
          NotOnlyHere is a full web-based community. Create a free account, log in from any phone, tablet, or computer, and access Circles, messaging, anonymous posting, wellness check-ins, and AI support — all in your browser. No download needed.
        </p>

        {/* Trust pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 bg-background-50 border border-background-200 px-5 py-3 rounded-full">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-100">
              <i className="ri-smartphone-line text-accent-600" />
            </div>
            <span className="font-mono text-sm text-foreground-700 whitespace-nowrap">Works on mobile browser</span>
          </div>
          <div className="flex items-center gap-2 bg-background-50 border border-background-200 px-5 py-3 rounded-full">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100">
              <i className="ri-computer-line text-primary-600" />
            </div>
            <span className="font-mono text-sm text-foreground-700 whitespace-nowrap">Works on desktop</span>
          </div>
          <div className="flex items-center gap-2 bg-background-50 border border-background-200 px-5 py-3 rounded-full">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-100">
              <i className="ri-link text-secondary-600" />
            </div>
            <span className="font-mono text-sm text-foreground-700 whitespace-nowrap">One account, any device</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="/register"
            className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer"
          >
            Create Free Account
          </a>
          <a
            href="/login"
            className="font-mono text-sm uppercase tracking-wider border-2 border-foreground-950 text-foreground-950 px-8 py-4 rounded-full hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Log In to Your Community
          </a>
        </div>

        <p className="font-mono text-xs text-foreground-400">
          The full community experience opens after you sign in.
        </p>
      </div>
    </section>
  );
}