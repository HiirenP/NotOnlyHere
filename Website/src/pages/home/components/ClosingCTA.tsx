import { useRef, useEffect, useState } from 'react';

export default function ClosingCTA() {
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
      id="join"
      ref={ref}
      className="py-20 md:py-32 bg-foreground-950"
    >
      <div
        className={`max-w-3xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tighter text-background-50 uppercase mb-6 leading-[0.9]">
          Ready to be <em className="not-italic gradient-text">truly seen</em>?
        </h2>
        <p className="font-mono text-lg text-background-300 mb-12 max-w-xl mx-auto leading-relaxed">
          Whether you need to share, listen, or just be near people who get it — there&apos;s a place for you here.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => {}}
            className="font-mono text-sm uppercase tracking-wider bg-background-50 text-foreground-950 px-10 py-5 rounded-full hover:bg-background-100 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
          >
            Join free
          </button>
          <button
            type="button"
            onClick={() => {}}
            className="font-mono text-sm uppercase tracking-wider border-2 border-background-300 text-background-300 px-10 py-5 rounded-full hover:bg-background-50 hover:text-foreground-950 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            See how it works
          </button>
        </div>

        <p className="block mt-8 font-mono text-sm uppercase tracking-wider text-background-400">
          Already a member?{' '}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-background-200 hover:text-white hover:underline transition-colors duration-200 cursor-pointer">
            Log in
          </a>
        </p>
      </div>
    </section>
  );
}