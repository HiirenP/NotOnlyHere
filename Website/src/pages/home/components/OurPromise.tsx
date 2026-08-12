import { useEffect, useRef, useState } from 'react';
import { EyeOff, HeartHandshake, Lock, Shield, Smile, Sparkles } from 'lucide-react';

const promises = [
  { icon: Sparkles, title: 'Free to join', body: 'The community is open. No paywall between you and people who care.' },
  { icon: Lock, title: 'Privacy first', body: 'Your story stays yours. Share only what feels safe.' },
  { icon: Shield, title: 'Human moderation', body: 'Real people keep the space warm — not engagement algorithms.' },
  { icon: EyeOff, title: 'Anonymous when you choose', body: 'Post with your name, or without it. Honesty without the spotlight.' },
  { icon: Smile, title: 'No judgment', body: 'You do not have to perform wellness here. Showing up is enough.' },
  { icon: HeartHandshake, title: 'Kindness over algorithms', body: 'We reward listening and support — not popularity or virality.' },
];

export default function OurPromise() {
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
        className="max-w-5xl mx-auto transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div className="text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">
            Why join
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
            Our <em className="not-italic gradient-text">Promise</em>
          </h2>
          <p className="font-mono text-base text-foreground-600 leading-relaxed max-w-xl mx-auto">
            Not a popularity contest. A place to be heard — on your terms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promises.map((item) => (
            <div
              key={item.title}
              className="bg-background-100 border border-background-200 p-6 md:p-8 hover:border-foreground-300 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-background-50 border border-background-200 flex items-center justify-center mb-5">
                <item.icon size={18} className="text-foreground-800" />
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
                {item.title}
              </h3>
              <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
