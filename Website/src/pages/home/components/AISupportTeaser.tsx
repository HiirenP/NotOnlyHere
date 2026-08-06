import { useRef, useEffect, useState } from 'react';

export default function AISupportTeaser() {
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
    <section ref={ref} className="py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <div
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-24px)',
          }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-950 block mb-4">
            AI Companion
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
            Support That Never <em className="not-italic gradient-text">Sleeps</em>
          </h2>
          <p className="font-mono text-base text-foreground-600 leading-relaxed mb-4">
            Meet our AI companion — trained on peer-support principles to offer a kind ear when circles are quiet.
          </p>
          <p className="font-mono text-sm text-foreground-500 leading-relaxed mb-6">
            It won&apos;t replace human connection. But it will listen without judgment, suggest grounding exercises, and point you toward real community when you&apos;re ready.
          </p>

          <div className="bg-background-50 border border-background-200 p-5 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-information-line text-lg text-foreground-500" />
              </div>
              <p className="font-mono text-xs text-foreground-500 leading-relaxed">
                <strong>Disclaimer:</strong> Our AI companion is a supportive tool, not a therapist or crisis service. If you are in crisis, please call or text <strong>988</strong> or contact local emergency services.
              </p>
            </div>
          </div>

          <a
            href="/ai-support"
            className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer inline-block"
          >
            Learn About AI Support
          </a>
        </div>

        <div
          className={`relative transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
        >
          <div className="relative bg-background-50 p-4 shadow-xl rotate-1">
            <div className="absolute top-3 left-1/3 w-20 h-5 bg-accent-300/70 rotate-[-8deg] z-10" style={{ borderRadius: '2px' }} />
            <div className="absolute bottom-8 right-4 w-16 h-4 bg-secondary-300/70 rotate-[5deg] z-10" style={{ borderRadius: '2px' }} />
            <img
              src="/images/ava-mascot.png"
              alt="Ava AI Companion chat interface with supportive conversation and conversation starters"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
            <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mt-4 text-center">
              Available 24/7 &mdash; Always free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}