interface CircleItem {
  id: number;
  title: string;
  category: string;
  src: string;
  alt: string;
}

function RollingCircleItem({ item }: { item: CircleItem }) {
  return (
    <div className="group relative w-full cursor-pointer border-b border-foreground-200/40 py-8 md:py-10">
      {/* Rolling text container */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(42px, 5.5vw, 72px)' }}>
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
          {/* Normal state */}
          <div className="flex items-center" style={{ height: 'clamp(42px, 5.5vw, 72px)' }}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-foreground-950 uppercase tracking-tighter whitespace-nowrap select-none">
              {item.title}
            </h2>
          </div>
          {/* Hover state — italic with blue/cyan gradient */}
          <div className="flex items-center" style={{ height: 'clamp(42px, 5.5vw, 72px)' }}>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-tighter italic whitespace-nowrap select-none gradient-text"
            >
              {item.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Category label — fades on hover */}
      <span className="absolute top-10 md:top-12 right-0 text-xs font-bold uppercase tracking-widest text-foreground-400 transition-opacity duration-300 group-hover:opacity-0 hidden md:block whitespace-nowrap">
        {item.category}
      </span>

      {/* Image reveal on hover */}
      <div className="pointer-events-none absolute right-0 top-1/2 z-20 h-44 w-64 md:h-52 md:w-80 lg:h-56 lg:w-96 -translate-y-1/2 overflow-hidden rounded-xl shadow-2xl transition-all duration-500 ease-out opacity-0 scale-95 rotate-3 translate-x-6 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:translate-x-0 hidden md:block">
        <img
          src={item.src}
          alt={item.alt}
          className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
      </div>
    </div>
  );
}

const circles: CircleItem[] = [
  {
    id: 1,
    title: 'Gentle Support',
    category: 'Support Circle',
    src: '/images/rolling-circle-01.jpg',
    alt: 'Gentle Support — A warm space for sharing life\'s quieter struggles',
  },
  {
    id: 2,
    title: 'Late Night Lounge',
    category: 'Night Owl Circle',
    src: '/images/rolling-circle-02.jpg',
    alt: 'Late Night Lounge — For the 2am crowd and night owls',
  },
  {
    id: 3,
    title: 'Night Shade',
    category: 'Reflection Circle',
    src: '/images/rolling-circle-03.jpg',
    alt: 'Night Shade — A darker raw space for heavier topics',
  },
  {
    id: 4,
    title: 'First Time Here',
    category: 'Welcome Circle',
    src: '/images/rolling-circle-04.jpg',
    alt: 'First Time Here — New to peer support? Start here',
  },
];

export default function RollingCirclesList() {
  return (
    <section
      id="our-circles"
      className="relative w-full py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16"
      style={{ backgroundColor: '#faf9f8' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Headline area */}
        <div className="mb-10 md:mb-16">
          <span
            className="font-mono uppercase font-medium block mb-5 text-foreground-950"
            style={{
              fontSize: '10px',
              letterSpacing: '0.35em',
            }}
          >
            Our Circles
          </span>

          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter text-foreground-950 uppercase max-w-3xl leading-[0.9]">
            FIND YOUR <em className="not-italic gradient-text">PEOPLE</em>
          </h2>
        </div>

        {/* Rolling list */}
        <div className="flex flex-col border-t border-foreground-200/40">
          {circles.map((item) => (
            <RollingCircleItem key={item.id} item={item} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 md:mt-14 text-center">
          <a
            href="/circles"
            className="font-mono text-sm uppercase tracking-wider text-background-50 px-12 py-4 rounded-full whitespace-nowrap cursor-pointer inline-block gradient-btn"
          >
            Explore All Circles
          </a>
        </div>
      </div>
    </section>
  );
}