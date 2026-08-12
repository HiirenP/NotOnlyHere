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
          <div className="bg-white border border-background-200 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-background-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-500 to-accent-500 flex items-center justify-center text-background-50 font-mono text-xs">
                Ava
              </div>
              <div>
                <p className="font-mono text-sm font-semibold text-foreground-950">Ava</p>
                <p className="font-mono text-xs text-foreground-500">Private · not a therapist</p>
              </div>
            </div>
            <div className="p-4 space-y-3 bg-background-100 min-h-[280px]">
              <div className="max-w-[90%] bg-background-50 border border-background-200 rounded-2xl rounded-bl-md px-4 py-3">
                <p className="font-mono text-xs text-foreground-800 leading-relaxed">
                  Hi. I’m here for supportive conversation. What would feel helpful today?
                </p>
              </div>
              <div className="ml-auto max-w-[85%] bg-secondary-500/10 rounded-2xl rounded-br-md px-4 py-3">
                <p className="font-mono text-xs text-foreground-800 leading-relaxed">I feel lonely tonight.</p>
              </div>
              <div className="max-w-[90%] bg-background-50 border border-background-200 rounded-2xl rounded-bl-md px-4 py-3">
                <p className="font-mono text-xs text-foreground-800 leading-relaxed">
                  You’re not the only one awake. Would you like a grounding exercise, or a Circle that stays open late?
                </p>
              </div>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-400 py-3 text-center border-t border-background-200">
              Available 24/7 — Always free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}