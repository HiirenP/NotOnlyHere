import { useRef, useEffect } from 'react';

const PHRASE = 'YOU DESERVE TO BE HEARD';
const ROW_COUNT = 5;

interface RowConfig {
  dir: number;
  delay: number;
}

const ROW_CONFIGS: RowConfig[] = [
  { dir: 1, delay: 0.10 },
  { dir: -1, delay: 0.05 },
  { dir: 1, delay: 0.00 },
  { dir: -1, delay: 0.05 },
  { dir: 1, delay: 0.10 },
];

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function cubicEaseOut(t: number): number {
  return 1 - (1 - t) * (1 - t) * (1 - t);
}

function mapRange(a: number, b: number, v: number): number {
  return clamp((v - a) / (b - a), 0, 1);
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tiledLayerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const cache = useRef({
    tiledOpacity: 0,
    rotation: 0,
    rowOffsets: [0, 0, 0, 0, 0] as number[],
    headlineScale: 0,
    subtitleOpacity: 0,
    subtitleY: 0,
  });

  const sectionMetrics = useRef({ top: 0, height: 0 });

  useEffect(() => {
    let rafId = 0;
    const c = cache.current;
    const m = sectionMetrics.current;

    function recalcMetrics() {
      const section = sectionRef.current;
      if (!section) return;
      let top = 0;
      let el: HTMLElement | null = section;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      m.top = top;
      m.height = section.offsetHeight;
    }

    recalcMetrics();

    const resizeObserver = new ResizeObserver(() => {
      recalcMetrics();
    });

    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recalcMetrics, 80);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;

        const section = sectionRef.current;
        if (!section) return;

        const viewH = window.innerHeight;
        const scrollY = window.scrollY;

        if (scrollY + viewH < m.top || scrollY > m.top + m.height) return;

        const p = clamp((scrollY - m.top) / (m.height - viewH), 0, 1);

        // ANIMATION 1 — Untwist (p: 0 → 0.6)
        const rotateRaw = mapRange(0, 0.6, p);
        const rotation = 32 * (1 - rotateRaw);

        // ANIMATION 2 — Rows slide inward (p: 0 → 0.55, per-row with delay)
        const slideOffsets: number[] = ROW_CONFIGS.map((cfg, i) => {
          const rowT = mapRange(cfg.delay, 0.55, p);
          const eased = cubicEaseOut(rowT);
          return cfg.dir * 140 * (1 - eased);
        });

        // ANIMATION 3 — Tiled layer fades out (p: 0.25 → 0.7)
        const tiledFade = mapRange(0.25, 0.7, p);
        const tiledOpacity = 1 - tiledFade;

        // ANIMATION 4 — Centered headline scales up (p: 0.1 → 0.65)
        const scaleRaw = mapRange(0.1, 0.65, p);
        const headlineScale = 0.9 + scaleRaw * 0.1;

        // ANIMATION 5 — Subtitle fades in + slides up (p: 0.72 → 0.92)
        const subRaw = mapRange(0.72, 0.92, p);
        const subtitleOpacity = subRaw;
        const subtitleY = (1 - subRaw) * 14;

        // Apply diff-cached writes
        if (Math.abs(c.tiledOpacity - tiledOpacity) > 0.005) {
          c.tiledOpacity = tiledOpacity;
          if (tiledLayerRef.current) {
            tiledLayerRef.current.style.opacity = String(tiledOpacity);
          }
        }

        const rotationChanged = Math.abs(c.rotation - rotation) > 0.05;

        ROW_CONFIGS.forEach((_, i) => {
          const rowRef = rowRefs.current[i];
          if (!rowRef) return;
          const offset = slideOffsets[i];
          const offsetChanged = Math.abs(c.rowOffsets[i] - offset) > 0.1;
          if (rotationChanged || offsetChanged) {
            c.rowOffsets[i] = offset;
            c.rotation = rotation;
            rowRef.style.transform = `translate3d(${offset}vw, 0, 0)`;
          }
        });

        if (tiledLayerRef.current && rotationChanged) {
          tiledLayerRef.current.style.transform = `rotate(${rotation}deg)`;
        }

        if (Math.abs(c.headlineScale - headlineScale) > 0.002) {
          c.headlineScale = headlineScale;
          if (headlineRef.current) {
            headlineRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${headlineScale})`;
          }
        }

        if (Math.abs(c.subtitleOpacity - subtitleOpacity) > 0.005) {
          c.subtitleOpacity = subtitleOpacity;
          if (subtitleRef.current) {
            subtitleRef.current.style.opacity = String(subtitleOpacity);
          }
        }

        if (Math.abs(c.subtitleY - subtitleY) > 0.05) {
          c.subtitleY = subtitleY;
          if (subtitleRef.current) {
            subtitleRef.current.style.transform = `translate3d(-50%, ${subtitleY}px, 0)`;
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const displayFont: React.CSSProperties = { fontFamily: "'Anton', sans-serif" };
  const subtitleFont: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
  const displayFontSize: React.CSSProperties = {
    fontSize: 'clamp(4rem, 9vw, 9.5rem)',
    letterSpacing: '-0.03em',
    fontWeight: 400,
  };
  const gpu: React.CSSProperties = { willChange: 'transform, opacity', backfaceVisibility: 'hidden' };
  const textColor = '#1a1a1a';

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative"
      style={{ height: '320vh', isolation: 'isolate', contain: 'layout paint' }}
    >
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ contain: 'layout paint' }}
      >

        {/* ===== Z-30: Top labels ===== */}
        <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-28 md:pt-32 flex justify-between">
            <span className="text-[10px] uppercase tracking-[0.35em] font-mono whitespace-nowrap" style={{ color: 'rgba(26,26,26,0.6)' }}>
              Our Belief
            </span>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.35em] font-mono whitespace-nowrap" style={{ color: 'rgba(26,26,26,0.6)' }}>
              A quiet manifesto
            </span>
          </div>
        </div>

        {/* ===== Z-10: Tiled background text ===== */}
        <div
          ref={tiledLayerRef}
          aria-hidden
          className="absolute z-10 pointer-events-none flex flex-col items-center justify-center"
          style={{
            width: '220%',
            height: '220%',
            left: '-60%',
            top: '-60%',
            transformOrigin: '50% 50%',
            transform: 'rotate(32deg)',
            ...gpu,
          }}
        >
          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="w-full whitespace-nowrap text-center select-none"
              style={{
                ...displayFont,
                ...displayFontSize,
                lineHeight: 0.95,
                paddingBlock: '0.05em',
                color: i === 2 ? 'rgba(26,26,26,0.14)' : 'rgba(26,26,26,0.10)',
                ...gpu,
              }}
            >
              {PHRASE}
            </div>
          ))}
        </div>

        {/* ===== Z-20: Centered content ===== */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <h2
            ref={headlineRef}
            className="absolute left-1/2 top-1/2 whitespace-nowrap flex"
            style={{
              ...displayFont,
              ...displayFontSize,
              transform: 'translate3d(-50%, -50%, 0) scale(0.9)',
              ...gpu,
            }}
          >
            <span style={{ color: textColor }}>YOU DESERVE TO BE</span>
            <span style={{ display: 'inline-block', width: '0.25em' }} />
            <span style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 35%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>HEARD</span>
          </h2>
          <p
            ref={subtitleRef}
            className="absolute left-1/2 top-[calc(50%+clamp(2.8rem,7.2vw,7.5rem))] text-center max-w-[720px] w-full px-6"
            style={{
              ...subtitleFont,
              fontSize: 'clamp(1.05rem, 1.45vw, 1.4rem)',
              color: textColor,
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.5,
              opacity: 0,
              transform: 'translate3d(-50%, 14px, 0)',
              ...gpu,
            }}
          >
            Not everything needs to be solved. Some things just need to be truly seen.
          </p>
        </div>

        {/* ===== Z-30: Bottom corner meta ===== */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 pb-8 md:pb-10 flex justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px" style={{ backgroundColor: 'rgba(26,26,26,0.25)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono whitespace-nowrap" style={{ color: 'rgba(26,26,26,0.55)' }}>
                Chapter 02 — Belief
              </span>
              <span className="w-8 h-px" style={{ backgroundColor: 'rgba(26,26,26,0.25)' }} />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-px" style={{ backgroundColor: 'rgba(26,26,26,0.25)' }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono whitespace-nowrap" style={{ color: 'rgba(26,26,26,0.55)' }}>
                Scroll to reveal
              </span>
              <span className="w-8 h-px" style={{ backgroundColor: 'rgba(26,26,26,0.25)' }} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}