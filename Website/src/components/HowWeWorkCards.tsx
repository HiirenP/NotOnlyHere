import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface CardMotion {
  finalLeft: string;
  finalTop: string;
  fromX: number;
  fromY: number;
  fromRot: number;
  toRot: number;
  enterStart: number;
  enterEnd: number;
  exitStart?: number;
  exitEnd?: number;
  exitDy?: number;
}

export interface HowWeWorkCardsHandle {
  getCards: () => Array<HTMLDivElement | null>;
  getConfig: () => CardMotion[];
}

const CARD_WIDTH = 'clamp(320px, 30vw, 440px)';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.12)';
const OVERLAY_GRADIENT = 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0) 100%)';

const cardMotions: CardMotion[] = [
  {
    finalLeft: '6%',
    finalTop: '14%',
    fromX: -32,
    fromY: -6,
    fromRot: -18,
    toRot: -6,
    enterStart: 0.0,
    enterEnd: 0.14,
    exitStart: 0.42,
    exitEnd: 0.58,
    exitDy: -60,
  },
  {
    finalLeft: '54%',
    finalTop: '26%',
    fromX: 36,
    fromY: 4,
    fromRot: 22,
    toRot: 5,
    enterStart: 0.2,
    enterEnd: 0.34,
    exitStart: 0.44,
    exitEnd: 0.6,
    exitDy: -60,
  },
  {
    finalLeft: '8%',
    finalTop: '28%',
    fromX: -18,
    fromY: 34,
    fromRot: -20,
    toRot: -5,
    enterStart: 0.62,
    enterEnd: 0.76,
  },
  {
    finalLeft: '56%',
    finalTop: '12%',
    fromX: 20,
    fromY: 32,
    fromRot: 20,
    toRot: 7,
    enterStart: 0.82,
    enterEnd: 0.96,
  },
];

interface CardData {
  image: string;
  alt: string;
  title: string;
  description: string;
  subLabel: string;
}

const cardsData: CardData[] = [
  {
    image: 'https://readdy.ai/api/search-image?query=Soft%20warm%20glowing%20laptop%20screen%20on%20a%20wooden%20desk%20in%20a%20dim%20cozy%20room%2C%20gentle%20amber%20light%20spilling%20across%20the%20keyboard%2C%20a%20single%20small%20plant%20beside%20the%20laptop%2C%20warm%20earth%20tones%2C%20safe%20and%20inviting%20atmosphere%2C%20minimalist%20composition%2C%20soft%20shadows%2C%20dreamy%20shallow%20depth%20of%20field%2C%20editorial%20photography%20style%20with%20film%20grain%20texture&width=900&height=1200&seq=circle-card-01&orientation=portrait',
    alt: 'Step 01 — Create your account and join the community safely',
    title: 'Create Your Account',
    description: 'Sign up in under a minute. No real name required — pick a username that feels safe.',
    subLabel: 'Your safe space begins',
  },
  {
    image: 'https://readdy.ai/api/search-image?query=Warm%20abstract%20overlapping%20circles%20of%20soft%20golden%20light%20floating%20in%20a%20dark%20gentle%20space%2C%20each%20circle%20glowing%20with%20its%20own%20warmth%2C%20amber%20and%20honey%20tones%20blending%20together%2C%20feeling%20of%20community%20and%20gathering%2C%20soft%20bokeh%20effect%2C%20dreamy%20ethereal%20atmosphere%2C%20cozy%20nighttime%20vibe%2C%20editorial%20photography%20with%20soft%20focus&width=900&height=1200&seq=circle-card-02&orientation=portrait',
    alt: 'Step 02 — Find your circle among themed support groups',
    title: 'Find Your Circle',
    description: 'Browse themed circles like Gentle Support, Late Night Lounge, and Night Shade. Each has its own rhythm.',
    subLabel: 'Discover your people',
  },
  {
    image: 'https://readdy.ai/api/search-image?query=A%20quiet%20peaceful%20scene%20of%20open%20hands%20resting%20gently%20on%20a%20warm%20textured%20surface%2C%20soft%20golden%20hour%20light%20streaming%20from%20the%20side%2C%20feeling%20of%20sharing%20and%20listening%2C%20vulnerability%20held%20with%20kindness%2C%20warm%20earth%20and%20terracotta%20tones%2C%20minimalist%20composition%2C%20soft%20shadows%2C%20dreamy%20atmosphere%2C%20editorial%20photography%20with%20gentle%20texture&width=900&height=1200&seq=circle-card-03&orientation=portrait',
    alt: 'Step 03 — Share anonymously or simply listen with kindness',
    title: 'Share or Listen',
    description: 'Post anonymously, respond with kindness, or just read. There is no scoreboard — presence is enough.',
    subLabel: 'No judgment here',
  },
  {
    image: 'https://readdy.ai/api/search-image?query=Tender%20young%20green%20seedlings%20growing%20from%20rich%20dark%20soil%20in%20soft%20morning%20light%2C%20delicate%20stems%20reaching%20upward%2C%20warm%20sunbeams%20breaking%20through%20gentle%20mist%2C%20symbol%20of%20growth%20and%20hope%20and%20quiet%20connection%2C%20earth%20tones%20with%20soft%20green%20accents%2C%20minimalist%20composition%2C%20dreamy%20atmosphere%2C%20editorial%20photography%20style&width=900&height=1200&seq=circle-card-04&orientation=portrait',
    alt: 'Step 04 — Grow together, build quiet connections over time',
    title: 'Grow Together',
    description: 'Return when you need to. Build quiet connections over time. Belonging is a practice, not a performance.',
    subLabel: 'Belonging takes time',
  },
];

const HowWeWorkCards = forwardRef<HowWeWorkCardsHandle, object>((_props, ref) => {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);

  useImperativeHandle(ref, () => ({
    getCards: () => cardRefs.current,
    getConfig: () => cardMotions,
  }));

  return (
    <>
      {cardsData.map((card, i) => (
        <div
          key={i}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="absolute will-change-transform"
          style={{
            left: cardMotions[i].finalLeft,
            top: cardMotions[i].finalTop,
            width: CARD_WIDTH,
            transform: `translate3d(${cardMotions[i].fromX}vw, ${cardMotions[i].fromY}vh, 0) rotate(${cardMotions[i].fromRot}deg)`,
            opacity: 0,
            transformOrigin: '50% 50%',
            backfaceVisibility: 'hidden',
          }}
        >
          <article
            className="relative overflow-hidden rounded-2xl"
            style={{
              aspectRatio: '3 / 4',
              boxShadow: CARD_SHADOW,
            }}
          >
            <img
              src={card.image}
              alt={card.alt}
              className="absolute inset-0 w-full h-full object-cover object-center select-none"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0"
              style={{
                height: '62%',
                background: OVERLAY_GRADIENT,
              }}
            />
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between">
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.7)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                STEP &middot; 0{i + 1}
              </span>
              <span
                className="inline-block h-[1px] w-8"
                style={{ background: 'rgba(255,255,255,0.55)' }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 'clamp(1.15rem, 1.4vw, 1.45rem)',
                  lineHeight: 1.2,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: '#FFFFFF',
                  marginBottom: '0.625rem',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 'clamp(0.88rem, 1vw, 1rem)',
                  lineHeight: 1.5,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.75)',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                }}
              >
                {card.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c17f5c]" />
                <span
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.28em',
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  {card.subLabel}
                </span>
              </div>
            </div>
          </article>
        </div>
      ))}
    </>
  );
});

HowWeWorkCards.displayName = 'HowWeWorkCards';

export default HowWeWorkCards;