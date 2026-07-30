import { useRef, useEffect, useState } from 'react';

const stats = [
  { number: '48', suffix: '+', label: 'Active Circles' },
  { number: '2,400', suffix: '+', label: 'Community Members' },
  { number: '100', suffix: '%', label: 'Free to Join' },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="circles"
      ref={ref}
      className="py-16 md:py-24 bg-background-100 text-foreground-950"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 text-center mb-12">
          By the numbers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="font-display text-6xl md:text-7xl tracking-tighter mb-2">
                <em className="not-italic gradient-text">{s.number}</em>
                <span className="text-foreground-950">{s.suffix}</span>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}