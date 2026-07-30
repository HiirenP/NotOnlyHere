import { useRef, useEffect, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in under a minute. No real name required — pick a username that feels safe.',
    icon: 'ri-user-add-line',
  },
  {
    number: '02',
    title: 'Find Your Circle',
    description: 'Browse themed circles like Gentle Support, Late Night Lounge, and Night Shade. Each has its own rhythm.',
    icon: 'ri-group-line',
  },
  {
    number: '03',
    title: 'Share or Listen',
    description: 'Post anonymously, respond with kindness, or just read. There is no scoreboard — presence is enough.',
    icon: 'ri-chat-1-line',
  },
  {
    number: '04',
    title: 'Grow Together',
    description: 'Return when you need to. Build quiet connections over time. Belonging is a practice, not a performance.',
    icon: 'ri-heart-line',
  },
];

export default function HowItWorks() {
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
      <div className="mb-12 md:mb-16 text-center">
        <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
          How It Works
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-2xl mx-auto leading-[0.9]">
          Four Steps to <em className="not-italic gradient-text">Belonging</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="bg-background-50 border border-background-200 p-6 md:p-8 transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: `${i * 120}ms`,
            }}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background-100 mb-5">
              <i className={`${step.icon} text-xl text-foreground-700`} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-2">
              {step.number}
            </span>
            <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
              {step.title}
            </h3>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <a
          href="/register"
          className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-10 py-4 rounded-full whitespace-nowrap cursor-pointer inline-block"
        >
          Join the Community
        </a>
      </div>
    </section>
  );
}