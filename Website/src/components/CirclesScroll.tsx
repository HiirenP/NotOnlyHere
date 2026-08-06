import { useRef, useEffect } from 'react';
import CirclesCards, { type CirclesCardsHandle } from '@/components/CirclesCards';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;

export default function CirclesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsLayerRef = useRef<CirclesCardsHandle>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const cardsHandle = cardsLayerRef.current;
    if (!section || !sticky || !eyebrow || !headline || !cardsHandle) return;

    const cards = cardsHandle.getCards();
    const config = cardsHandle.getConfig();

    let sectionTop = 0;
    let sectionHeight = 0;
    let viewportHeight = window.innerHeight;
    let rafId = 0;
    let pending = false;

    const cache = new Float32Array(16);
    for (let i = 0; i < 16; i++) cache[i] = -9999;

    function measure() {
      let el: HTMLElement | null = section;
      let top = 0;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      sectionTop = top;
      sectionHeight = section.offsetHeight;
      viewportHeight = window.innerHeight;
    }

    function paint(p: number) {
      const eyebrowOpacity = clamp(p / 0.25, 0, 1);
      if (Math.abs(eyebrowOpacity - cache[0]) > 0.005) {
        eyebrow.style.opacity = String(eyebrowOpacity);
        cache[0] = eyebrowOpacity;
      }

      const headlineT = clamp((p - 0.15) / 0.4, 0, 1);
      const headlineOpacity = 1 - headlineT * 0.45;
      if (Math.abs(headlineOpacity - cache[1]) > 0.005) {
        headline.style.opacity = String(headlineOpacity);
        cache[1] = headlineOpacity;
      }

      for (let i = 0; i < 4; i++) {
        const cardEl = cards[i];
        const cfg = config[i];
        if (!cardEl || !cfg) continue;

        const cBase = i * 4;

        let enterT = clamp((p - cfg.enterStart) / (cfg.enterEnd - cfg.enterStart), 0, 1);
        const easedEnter = easeOutCubic(enterT);

        let tx = cfg.fromX * (1 - easedEnter);
        let ty = cfg.fromY * (1 - easedEnter);
        let rot = cfg.fromRot + (cfg.toRot - cfg.fromRot) * easedEnter;
        let opacity = clamp(enterT * 1.5, 0, 1);

        if (cfg.exitStart !== undefined && cfg.exitEnd !== undefined && cfg.exitDy !== undefined) {
          let exitT = clamp((p - cfg.exitStart) / (cfg.exitEnd - cfg.exitStart), 0, 1);
          const easedExit = easeInCubic(exitT);
          ty += cfg.exitDy * easedExit;
          rot += (cfg.toRot > 0 ? 3 : -3) * easedExit;
          opacity *= 1 - easedExit;
        }

        const newTx = tx;
        const newTy = ty;
        const newRot = rot;
        const newOpacity = opacity;

        if (
          Math.abs(newTx - cache[cBase + 0]) > 0.05 ||
          Math.abs(newTy - cache[cBase + 1]) > 0.05 ||
          Math.abs(newRot - cache[cBase + 2]) > 0.05
        ) {
          cardEl.style.transform = `translate3d(${newTx}vw, ${newTy}vh, 0) rotate(${newRot}deg)`;
          cache[cBase + 0] = newTx;
          cache[cBase + 1] = newTy;
          cache[cBase + 2] = newRot;
        }

        if (Math.abs(newOpacity - cache[cBase + 3]) > 0.005) {
          cardEl.style.opacity = String(newOpacity);
          cache[cBase + 3] = newOpacity;
        }
      }
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(() => {
        pending = false;
        const scrollY = window.scrollY;
        const slack = 50;
        if (scrollY + viewportHeight < sectionTop - slack || scrollY > sectionTop + sectionHeight + slack) {
          return;
        }
        const progressHeight = sectionHeight - viewportHeight;
        const p = progressHeight > 0 ? clamp((scrollY - sectionTop) / progressHeight, 0, 1) : 0;
        paint(p);
      });
    }

    function onResize() {
      measure();
      onScroll();
    }

    measure();
    paint(0);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(section);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="our-circles"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '360vh', backgroundColor: '#faf9f8' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh', contain: 'layout paint' }}
      >
        {/* TOP LABELS (z-30) */}
        <div
          className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
          style={{ paddingTop: 'clamp(7rem, 10vh, 8rem)' }}
        >
          <div className="max-w-[1600px] mx-auto flex items-baseline justify-between px-6 md:px-10">
            <span
              ref={eyebrowRef}
              className="font-mono uppercase font-medium"
              style={{
                fontSize: '10px',
                letterSpacing: '0.35em',
                color: 'rgba(26,26,26,0.6)',
                opacity: 0,
                willChange: 'opacity',
              }}
            >
              Our Circles
            </span>
            <span
              className="hidden md:block font-mono uppercase font-medium"
              style={{
                fontSize: '10px',
                letterSpacing: '0.35em',
                color: 'rgba(26,26,26,0.6)',
              }}
            >
              Chapter 03 &middot; Find your people
            </span>
          </div>
        </div>

        {/* BIG CENTERED HEADLINE (z-10) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
          <h2
            ref={headlineRef}
            className="text-center select-none"
            style={{
              fontFamily: "'Anton', 'Cormorant Garamond', 'Georgia', sans-serif",
              fontSize: 'clamp(4.5rem, 13vw, 14rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
              whiteSpace: 'nowrap',
              opacity: 1,
              willChange: 'opacity, transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            <span style={{ color: '#1a1a1a', display: 'inline-block' }}>FIND YOUR</span>
            <span
              style={{
                display: 'inline-block',
                width: '0.25em',
              }}
            />
            <span
              style={{
                background: 'linear-gradient(135deg, #d97745 0%, #c17f5c 40%, #e8a87c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
              }}
            >
              PEOPLE
            </span>
          </h2>
        </div>

        {/* CARDS LAYER (z-40) */}
        <div className="absolute inset-0 z-40">
          <CirclesCards ref={cardsLayerRef} />
        </div>

        {/* CORNER META (z-50) */}
        <div className="absolute bottom-8 left-6 md:left-10 z-50 pointer-events-none">
          <div className="flex items-center gap-3">
            <span
              className="font-mono uppercase font-medium"
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(26,26,26,0.55)',
              }}
            >
              Chapter 03
            </span>
            <span
              className="inline-block w-8 h-[1px]"
              style={{ backgroundColor: 'rgba(26,26,26,0.4)' }}
            />
            <span
              className="font-mono uppercase font-medium"
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(26,26,26,0.55)',
              }}
            >
              Circles
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 md:right-10 z-50 pointer-events-none">
          <div className="flex items-center gap-3">
            <span
              className="font-mono uppercase font-medium"
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(26,26,26,0.55)',
              }}
            >
              Scroll to explore
            </span>
            <span
              className="inline-block w-8 h-[1px]"
              style={{ backgroundColor: 'rgba(26,26,26,0.4)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}