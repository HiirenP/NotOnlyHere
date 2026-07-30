import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function DeepDive() {
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
    <section
      id="mission"
      ref={ref}
      className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left: image polaroid */}
        <div
          className={`relative transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
        >
          <div className="relative bg-background-50 p-4 pb-12 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="absolute top-3 left-1/3 w-20 h-5 bg-primary-300/70 rotate-[-8deg] z-10" style={{ borderRadius: '2px' }} />
            <div className="absolute bottom-8 right-4 w-16 h-4 bg-accent-300/70 rotate-[5deg] z-10" style={{ borderRadius: '2px' }} />
            <div className="w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img
                src="https://readdy.ai/api/search-image?query=Community%20members%20gathering%20outdoors%20in%20a%20park%20warm%20sunset%20light%20genuine%20connection%20candid%20documentary%20photography%20soft%20earth%20tones%20editorial%20style&width=800&height=960&seq=deepdive-img&orientation=portrait"
                alt="Community members gathering outdoors"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mt-4 text-center">
              NotOnlyHere Community &mdash; 2025
            </p>
          </div>
        </div>

        {/* Right: editorial copy */}
        <div
          className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
            Our Approach
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase mb-6 leading-[0.9]">
            Building Belonging <em className="not-italic gradient-text">Together</em>
          </h2>

          <div className="font-mono text-base leading-relaxed text-foreground-700 space-y-4">
            <p>
              We believe real connection doesn&apos;t come from follower counts or polished profiles. It rises from honest words, gentle listening, and showing up — even quietly.
            </p>
            <p>
              NotOnlyHere was founded on a simple idea: that everyone deserves a place to be <em className="not-italic font-semibold text-foreground-950">seen</em>, not just visible. Our platform removes the pressure to perform and replaces it with Circles, anonymous posting, and human moderation.
            </p>
            <p>
              From night owls to first-timers, we&apos;ve built a community where honest stories find kind company — at 2pm or 2am.
            </p>
          </div>

          <a
            href="/about"
            className="mt-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-foreground-950 hover:gradient-text transition-colors duration-200 cursor-pointer"
          >
            Read our full story <ArrowRight size={16} />
          </a>

          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <p className="font-display text-3xl uppercase tracking-tighter text-foreground-950 leading-none mb-1">
                48<em className="not-italic gradient-text">+</em>
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400">
                Active Circles
              </p>
            </div>
            <div>
              <p className="font-display text-3xl uppercase tracking-tighter text-foreground-950 leading-none mb-1">
                2,400<em className="not-italic gradient-text">+</em>
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400">
                Community members
              </p>
            </div>
            <div>
              <p className="font-display text-3xl uppercase tracking-tighter text-foreground-950 leading-none mb-1">
                100<em className="not-italic gradient-text">%</em>
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400">
                Free to join
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}