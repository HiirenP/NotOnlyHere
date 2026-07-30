import { useRef, useEffect, useState } from 'react';

const circles = [
  {
    name: 'Gentle Support',
    description: 'A warm space for sharing life\'s quieter struggles. Slow-paced, deeply moderated, always kind.',
    icon: 'ri-heart-pulse-line',
    color: 'bg-accent-500',
  },
  {
    name: 'Late Night Lounge',
    description: 'For the 2am crowd. Low-pressure conversations with fellow night owls who understand the quiet hours.',
    icon: 'ri-moon-line',
    color: 'bg-secondary-500',
  },
  {
    name: 'Night Shade',
    description: 'A darker, raw space for heavier topics. Real talk with people who have been through it.',
    icon: 'ri-contrast-2-line',
    color: 'bg-foreground-800',
  },
  {
    name: 'First Time Here',
    description: 'New to peer support? Start here. Friendly faces, gentle introductions, zero pressure.',
    icon: 'ri-seedling-line',
    color: 'bg-primary-500',
  },
];

export default function CirclesPreview() {
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
    <section ref={ref} className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
      <div className="mb-12 md:mb-16 text-center">
        <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
          Our Circles
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
          Find Your <em className="not-italic gradient-text">People</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {circles.map((circle, i) => (
          <div
            key={circle.name}
            className="bg-background-100 border border-background-200 p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? undefined : 'translateY(24px)',
              transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
            }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${circle.color} mb-5`}>
              <i className={`${circle.icon} text-lg text-background-50`} />
            </div>
            <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
              {circle.name}
            </h3>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed">
              {circle.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <a
          href="/circles"
          className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-10 py-4 rounded-full whitespace-nowrap cursor-pointer inline-block"
        >
          Explore All Circles
        </a>
      </div>
    </section>
  );
}