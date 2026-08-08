import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';

interface Polaroid {
  src: string;
  alt: string;
  caption: string;
  tapeColor: string;
  tapeAngle: number;
  tapePos: 'top' | 'bottom' | 'left' | 'right';
  initRotate: number;
  initFx: number;
  initFy: number;
  zBase: number;
}

const POLAROIDS: Polaroid[] = [
  {
    src: '/images/polaroid-01.jpg',
    alt: 'Diverse friends laughing together outdoors',
    caption: 'Gentle Support Circle',
    tapeColor: 'rgba(34,200,207,0.70)',
    tapeAngle: -8,
    tapePos: 'top',
    initRotate: -4,
    initFx: 0.40,
    initFy: 0.06,
    zBase: 8,
  },
  {
    src: '/images/polaroid-02.jpg',
    alt: 'Multicultural group of women in conversation',
    caption: 'Community Gathering',
    tapeColor: 'rgba(106,76,247,0.65)',
    tapeAngle: 6,
    tapePos: 'top',
    initRotate: 3,
    initFx: 0.62,
    initFy: 0.04,
    zBase: 7,
  },
  {
    src: '/images/polaroid-03.jpg',
    alt: 'East Asian man in a quiet reflective moment',
    caption: 'Late Night Lounge',
    tapeColor: 'rgba(61,127,248,0.65)',
    tapeAngle: -4,
    tapePos: 'bottom',
    initRotate: -2,
    initFx: 0.78,
    initFy: 0.12,
    zBase: 6,
  },
  {
    src: '/images/polaroid-04.jpg',
    alt: 'Diverse colleagues in a supportive meeting',
    caption: 'Circle Chat 2025',
    tapeColor: 'rgba(34,200,207,0.70)',
    tapeAngle: 10,
    tapePos: 'top',
    initRotate: 5,
    initFx: 0.55,
    initFy: 0.42,
    zBase: 9,
  },
  {
    src: '/images/polaroid-05.jpg',
    alt: 'Black friends connecting outdoors',
    caption: 'First Time Here',
    tapeColor: 'rgba(34,200,207,0.60)',
    tapeAngle: -6,
    tapePos: 'top',
    initRotate: -6,
    initFx: 0.38,
    initFy: 0.55,
    zBase: 5,
  },
  {
    src: '/images/polaroid-06.jpg',
    alt: 'Multicultural team collaborating together',
    caption: 'Peer Listening',
    tapeColor: 'rgba(106,76,247,0.60)',
    tapeAngle: 5,
    tapePos: 'bottom',
    initRotate: 2,
    initFx: 0.70,
    initFy: 0.50,
    zBase: 6,
  },
  {
    src: '/images/polaroid-07.jpg',
    alt: 'Diverse community gathering indoors',
    caption: 'Anonymous Stories',
    tapeColor: 'rgba(106,76,247,0.50)',
    tapeAngle: -9,
    tapePos: 'top',
    initRotate: -3,
    initFx: 0.84,
    initFy: 0.44,
    zBase: 7,
  },
  {
    src: '/images/polaroid-08.jpg',
    alt: 'Diverse peers working together around a table',
    caption: 'Night Shade Circle',
    tapeColor: 'rgba(34,200,207,0.55)',
    tapeAngle: 7,
    tapePos: 'top',
    initRotate: 4,
    initFx: 0.48,
    initFy: 0.70,
    zBase: 5,
  },
];

const CARD_W = 290;
const CARD_IMG_H = 240;

interface Position {
  x: number;
  y: number;
  rotate: number;
  z: number;
}

interface DragState {
  id: number;
  startMouseX: number;
  startMouseY: number;
  startCardX: number;
  startCardY: number;
}

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [topZ, setTopZ] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const compute = () => {
      const el = sectionRef.current;
      if (!el) return;
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      setPositions(
        POLAROIDS.map((p) => ({
          x: Math.round(p.initFx * W),
          y: Math.round(p.initFy * H),
          rotate: p.initRotate,
          z: p.zBase,
        }))
      );
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const bringToFront = useCallback(
    (id: number) => {
      setTopZ((prev) => prev + 1);
      setPositions((prev) =>
        prev.map((p, i) => (i === id ? { ...p, z: topZ + 1 } : p))
      );
    },
    [topZ]
  );

  const clamp = useCallback((id: number, rawX: number, rawY: number): { x: number; y: number } => {
    const el = sectionRef.current;
    if (!el) return { x: rawX, y: rawY };
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    const x = Math.max(-30, Math.min(W - CARD_W + 30, rawX));
    const y = Math.max(-20, Math.min(H - 80, rawY));
    return { x, y };
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.preventDefault();
      bringToFront(id);
      setIsDragging(true);
      dragRef.current = {
        id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startCardX: positions[id]?.x ?? 0,
        startCardY: positions[id]?.y ?? 0,
      };
    },
    [positions, bringToFront]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent, id: number) => {
      bringToFront(id);
      const touch = e.touches[0];
      dragRef.current = {
        id,
        startMouseX: touch.clientX,
        startMouseY: touch.clientY,
        startCardX: positions[id]?.x ?? 0,
        startCardY: positions[id]?.y ?? 0,
      };
    },
    [positions, bringToFront]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { id, startMouseX, startMouseY, startCardX, startCardY } = dragRef.current;
      const rawX = startCardX + (e.clientX - startMouseX);
      const rawY = startCardY + (e.clientY - startMouseY);
      const { x, y } = clamp(id, rawX, rawY);
      setPositions((prev) =>
        prev.map((p, i) => (i === id ? { ...p, x, y } : p))
      );
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return;
      const touch = e.touches[0];
      const { id, startMouseX, startMouseY, startCardX, startCardY } = dragRef.current;
      const rawX = startCardX + (touch.clientX - startMouseX);
      const rawY = startCardY + (touch.clientY - startMouseY);
      const { x, y } = clamp(id, rawX, rawY);
      setPositions((prev) =>
        prev.map((p, i) => (i === id ? { ...p, x, y } : p))
      );
    };

    const onUp = () => {
      dragRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [clamp]);

  const getTapeStyle = (p: Polaroid): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: '80px',
      height: '24px',
      background: p.tapeColor,
      borderRadius: '2px',
      transform: `rotate(${p.tapeAngle}deg)`,
      zIndex: 10,
    };
    if (p.tapePos === 'top') return { ...base, top: '-12px', left: '50%', marginLeft: '-40px' };
    if (p.tapePos === 'bottom') return { ...base, bottom: '-12px', left: '50%', marginLeft: '-40px' };
    if (p.tapePos === 'left') return { ...base, left: '-12px', top: '50%', marginTop: '-12px' };
    return { ...base, right: '-12px', top: '50%', marginTop: '-12px' };
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden animated-gradient-bg"
      style={{
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Floating dots layer */}
      <div className="floating-dots">
        <span className="floating-dot dot-1" />
        <span className="floating-dot dot-2" />
        <span className="floating-dot dot-3" />
        <span className="floating-dot dot-4" />
        <span className="floating-dot dot-5" />
        <span className="floating-dot dot-6" />
        <span className="floating-dot dot-7" />
        <span className="floating-dot dot-8" />
        <span className="floating-dot dot-9" />
        <span className="floating-dot dot-10" />
        <span className="floating-dot dot-11" />
        <span className="floating-dot dot-12" />
      </div>

      {/* Light overlay for crisp text readability */}
      <div className="absolute inset-0 bg-background-50/30 pointer-events-none" />

      {/* Polaroid canvas */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {positions.length > 0 &&
          POLAROIDS.map((p, i) => (
            <div
              key={i}
              onMouseDown={(e) => onMouseDown(e, i)}
              onTouchStart={(e) => onTouchStart(e, i)}
              style={{
                position: 'absolute',
                left: `${positions[i].x}px`,
                top: `${positions[i].y}px`,
                width: `${CARD_W}px`,
                transform: `rotate(${positions[i].rotate}deg)`,
                zIndex: positions[i].z,
                cursor: isDragging && dragRef.current?.id === i ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: dragRef.current?.id === i ? 'none' : 'transform 0.15s ease',
              }}
            >
              <div style={getTapeStyle(p)} />
              <div
                className="bg-white"
                style={{
                  padding: '12px',
                  paddingBottom: '48px',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)',
                }}
              >
                <div style={{ width: '100%', height: `${CARD_IMG_H}px`, overflow: 'hidden' }}>
                  <img
                    src={p.src}
                    alt={p.alt}
                    draggable={false}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 mt-3 text-center">
                  {p.caption}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Foreground content */}
      <div
        className={`relative flex flex-col justify-center min-h-screen pt-28 pb-20 px-4 sm:px-6 md:px-12 lg:px-16 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ zIndex: 20, maxWidth: '560px', pointerEvents: 'none' }}
      >
        <span
          className="font-mono text-xs uppercase tracking-widest text-foreground-950 mb-6 block"
          style={{ pointerEvents: 'auto' }}
        >
          Community Driven &mdash; Peer Support
        </span>

        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6"
          style={{ pointerEvents: 'auto' }}
        >
          Stories That{' '}
          <em className="not-italic gradient-text whitespace-nowrap">Truly See</em>{' '}
          Us All
        </h1>

        <p
          className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-md mb-10"
          style={{ pointerEvents: 'auto' }}
        >
          NotOnlyHere is where honest stories find kind listeners, quiet nights find company, and small acts of vulnerability ripple into real belonging.
        </p>

        <div className="flex flex-col sm:flex-row gap-4" style={{ pointerEvents: 'auto' }}>
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}
            className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full text-center whitespace-nowrap cursor-pointer"
          >
            Join the Community
          </a>
          <a
            href="/how-it-works"
            onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}
            className="font-mono text-sm uppercase tracking-wider border-2 border-foreground-950 text-foreground-950 px-8 py-4 rounded-full hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 text-center whitespace-nowrap cursor-pointer"
          >
            See How It Works
          </a>
        </div>

        <p className="mt-6 font-mono text-sm text-foreground-500" style={{ pointerEvents: 'auto' }}>
          Already a member?{' '}
          <a
            href="/login"
            onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}
            className="text-foreground-700 hover:text-foreground-950 hover:underline transition-colors duration-200 cursor-pointer"
          >
            Log in
          </a>
        </p>

        <div className="mt-16 flex items-center gap-3 text-foreground-400" style={{ pointerEvents: 'auto' }}>
          <ArrowDown size={16} className="animate-bounce" />
          <span className="font-mono text-xs uppercase tracking-widest">Scroll to explore</span>
        </div>
      </div>

      {/* Drag hint */}
      <div
        className="absolute bottom-8 right-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground-400 select-none pointer-events-none"
        style={{ zIndex: 30 }}
      >
        <span className="inline-block w-3 h-3 border border-foreground-300 rounded-sm" />
        Drag photos to explore
      </div>
    </section>
  );
}