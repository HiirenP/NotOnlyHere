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

export interface CirclesCardsHandle {
  getCards: () => Array<HTMLDivElement | null>;
  getConfig: () => CardMotion[];
}

const CARD_WIDTH = 'clamp(320px, 30vw, 440px)';
const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.12)';
const OVERLAY_GRADIENT = 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0) 100%)';

const cardMotions: CardMotion[] = [
  {
    finalLeft: '54%',
    finalTop: '12%',
    fromX: 34,
    fromY: -8,
    fromRot: 20,
    toRot: 5,
    enterStart: 0.0,
    enterEnd: 0.14,
    exitStart: 0.4,
    exitEnd: 0.56,
    exitDy: -60,
  },
  {
    finalLeft: '6%',
    finalTop: '24%',
    fromX: -28,
    fromY: 6,
    fromRot: -16,
    toRot: -4,
    enterStart: 0.18,
    enterEnd: 0.32,
    exitStart: 0.42,
    exitEnd: 0.58,
    exitDy: -60,
  },
  {
    finalLeft: '56%',
    finalTop: '28%',
    fromX: 22,
    fromY: 36,
    fromRot: 18,
    toRot: 6,
    enterStart: 0.6,
    enterEnd: 0.74,
  },
  {
    finalLeft: '6%',
    finalTop: '14%',
    fromX: -24,
    fromY: 30,
    fromRot: -22,
    toRot: -7,
    enterStart: 0.8,
    enterEnd: 0.94,
  },
];

interface CardData {
  image: string;
  alt: string;
  title: string;
  description: string;
  subLabel: string;
  accentColor: string;
}

const cardsData: CardData[] = [
  {
    image: '/images/circle-scroll-01.jpg',
    alt: 'Gentle Support — A warm space for sharing life\'s quieter struggles',
    title: 'Gentle Support',
    description: 'A warm space for sharing life\'s quieter struggles. Slow-paced, deeply moderated, always kind.',
    subLabel: 'You are not alone',
    accentColor: '#e8a87c',
  },
  {
    image: '/images/circle-scroll-02.jpg',
    alt: 'Late Night Lounge — For the 2am crowd and night owls',
    title: 'Late Night Lounge',
    description: 'For the 2am crowd. Low-pressure conversations with fellow night owls who understand the quiet hours.',
    subLabel: 'The night listens',
    accentColor: '#7b9cb8',
  },
  {
    image: '/images/circle-scroll-03.jpg',
    alt: 'Night Shade — A darker raw space for heavier topics',
    title: 'Night Shade',
    description: 'A darker, raw space for heavier topics. Real talk with people who have been through it.',
    subLabel: 'Bring your shadow',
    accentColor: '#8b7e9b',
  },
  {
    image: '/images/circle-scroll-04.jpg',
    alt: 'First Time Here — New to peer support? Start here',
    title: 'First Time Here',
    description: 'New to peer support? Start here. Friendly faces, gentle introductions, zero pressure.',
    subLabel: 'Take the first step',
    accentColor: '#a3b89b',
  },
];

const CirclesCards = forwardRef<CirclesCardsHandle, object>((_props, ref) => {
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
                CIRCLE &middot; 0{i + 1}
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
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: card.accentColor }}
                />
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

CirclesCards.displayName = 'CirclesCards';

export default CirclesCards;