import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Heart, Users, Shield, MessageCircle, Globe, Moon } from 'lucide-react';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

const values = [
  {
    icon: Heart,
    title: 'Radical Kindness',
    description:
      'Every interaction is rooted in genuine care. We lead with compassion, assume good intent, and respond to vulnerability with warmth — always.',
  },
  {
    icon: Users,
    title: 'Peer First',
    description:
      'We are not therapists or experts. We are people who get it. Support flows horizontally — from person to person — because shared experience is its own kind of wisdom.',
  },
  {
    icon: Shield,
    title: 'Safety by Design',
    description:
      'Real human moderators, clear community guidelines, and zero tolerance for harassment. The space stays warm because we actively protect it together.',
  },
  {
    icon: MessageCircle,
    title: 'Listening, Not Likes',
    description:
      'No scores, no streaks, no popularity contests. The only metric that matters is whether someone felt heard. We optimize for depth, not engagement.',
  },
  {
    icon: Globe,
    title: 'Accessible to All',
    description:
      'Free forever, no paywalls, no premium tiers. Everyone deserves support regardless of income, background, or circumstance.',
  },
  {
    icon: Moon,
    title: 'Night Owls Welcome',
    description:
      'Struggles do not keep office hours. Our Late Night Lounge and 24/7 anonymous posting mean you are never alone, even at 3am.',
  },
];

const milestones = [
  { year: '2019', title: 'The First Circle', desc: 'A small group of friends start meeting online to share honest conversations about anxiety and isolation. NotOnlyHere is born from a simple need: to be seen.' },
  { year: '2020', title: 'Pandemic Pivot', desc: 'As the world isolates, the community grows from 200 to 2,000 members in six months. Late Night Lounge launches for those struggling with midnight loneliness.' },
  { year: '2021', title: 'Anonymous Mode', desc: 'Members ask for a way to share without attaching their name. Anonymous posting launches — honesty increases by 340% overnight.' },
  { year: '2022', title: 'Human Moderation', desc: 'The community hires its first paid moderators — all former members who understand the space from the inside. Trust scores reach 94%.' },
  { year: '2023', title: '48 Active Circles', desc: 'Themed Circles multiply: Gentle Support, Night Shade, First Time Here, Peer Listening, and more. Each carves out its own rhythm and community.' },
  { year: '2024', title: '12,000+ Messages', desc: 'Over twelve thousand support messages exchanged in a single year. The community proves that listening, not likes, is what people actually need.' },
  { year: '2025', title: 'You Are Truly Seen', desc: 'The community reaches 2,400+ members. The mission remains unchanged: a warm space where honest stories find kind company, at 2pm or 2am.' },
];

function ValueCard({
  value,
  index,
}: {
  value: (typeof values)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Icon = value.icon;

  return (
    <div
      ref={ref}
      className="bg-background-50 p-8 md:p-10 hover:shadow-lg transition-all duration-300 group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms, box-shadow 0.3s ease`,
      }}
    >
      <div className="w-12 h-12 flex items-center justify-center bg-primary-100 rounded-full mb-6 group-hover:bg-primary-200 transition-colors duration-300">
        <Icon size={22} className="text-secondary-600" />
      </div>
      <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-3">
        {value.title}
      </h3>
      <p className="font-mono text-sm text-foreground-600 leading-relaxed">
        {value.description}
      </p>
    </div>
  );
}

function MilestoneItem({
  item,
  index,
  isLast,
}: {
  item: (typeof milestones)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative pl-10 md:pl-14"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-16px)',
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms`,
      }}
    >
      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-primary-500 border-4 border-background-50" />
      {!isLast && (
        <div className="absolute left-[9px] top-6 w-0.5 h-full bg-background-200" />
      )}

      <span className="font-display text-3xl md:text-4xl uppercase tracking-tighter gradient-text leading-none block mb-2">
        {item.year}
      </span>
      <h4 className="font-display text-lg uppercase tracking-tight text-foreground-950 mb-2">
        {item.title}
      </h4>
      <p className="font-mono text-sm text-foreground-600 leading-relaxed pb-10">
        {item.desc}
      </p>
    </div>
  );
}

export default function MissionPage() {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background-50">
      <Nav />

      {/* Hero */}
      <div className="relative w-full bg-foreground-950" style={{ minHeight: '500px', height: '60vh' }}>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/mission-hero.jpg"
            alt="Community gathering"
            className="w-full h-full object-cover object-top opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground-950/50 via-foreground-950/70 to-foreground-950" />

        <div
          className={`relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 md:px-12 lg:px-16 pb-12 md:pb-20 transition-all duration-700 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] gradient-text block mb-4">
            About Us
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-background-50 leading-[0.85] mb-6 max-w-4xl">
            You&apos;re Truly <em className="not-italic gradient-text">Seen</em> Here
          </h1>
          <p className="font-mono text-base md:text-lg text-background-300 leading-relaxed max-w-xl">
            NotOnlyHere is a warm, moderated peer-support community where honest stories find kind listeners, quiet nights find company, and small acts of vulnerability ripple into real belonging.
          </p>
        </div>
      </div>

      {/* Origin Story */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center max-w-6xl mx-auto">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
              Where It All Began
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-foreground-950 leading-[0.9] mb-6">
              One <em className="not-italic gradient-text">Honest</em> Conversation
            </h2>
            <div className="font-mono text-base leading-relaxed text-foreground-700 space-y-4">
              <p>
                In the winter of 2019, a small group of friends started meeting online to talk about the things they couldn&apos;t share anywhere else. Anxiety. Loneliness. The pressure to appear okay when they weren&apos;t.
              </p>
              <p>
                There was no app, no brand, no plan. Just a simple agreement: show up as you are, listen without fixing, and never judge what someone else is carrying. The group grew by word of mouth — not because it was marketed, but because it worked.
              </p>
              <p>
                By 2021, thousands had found their way to what would become NotOnlyHere. Today, the community spans 48+ active Circles, 2,400+ members, and countless late-night conversations that turned isolation into connection.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-background-50 p-4 pb-10 shadow-xl rotate-1">
              <div className="absolute top-3 left-1/3 w-20 h-5 bg-primary-300/70 rotate-[-8deg] z-10" style={{ borderRadius: '2px' }} />
              <div className="w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <img
                  src="/images/mission-origin.jpg"
                  alt="The first NotOnlyHere conversation"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mt-4 text-center">
                The First Circle &mdash; Winter 2019
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-background-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-3">
              What We Stand For
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-foreground-950 leading-[0.9]">
              Our Core <em className="not-italic gradient-text">Values</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((v, i) => (
              <ValueCard key={v.title} value={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center max-w-6xl mx-auto">
          <div className="order-2 lg:order-1 relative">
            <div className="w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img
                src="/images/mission-approach.jpg"
                alt="Quiet reflection and journaling"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-4">
              How We Work
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-foreground-950 leading-[0.9] mb-6">
              Gentle First, <em className="not-italic gradient-text">Always</em>
            </h2>
            <div className="font-mono text-base leading-relaxed text-foreground-700 space-y-4">
              <p>
                Traditional support spaces often feel clinical or performative. We designed NotOnlyHere to feel like a quiet living room — a place where you can breathe, share, and simply exist without pressure.
              </p>
              <p>
                Our platform is intentionally simple. No feeds designed to addict. No likes, streaks, or follower counts. Just Circles for real-time conversation, anonymous posting for honesty that feels safer without a name, and a slow feed of stories that moves at human speed.
              </p>
              <p>
                Every member agrees to community guidelines before joining. Real moderators — not algorithms — review reports and keep the space warm. And because we are funded by donations, not venture capital, we never have to choose between growth and safety.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
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

      {/* Timeline */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-background-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground-400 block mb-3">
              Our Journey
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-foreground-950 leading-[0.9]">
              Milestones & <em className="not-italic gradient-text">Moments</em>
            </h2>
          </div>

          <div className="relative">
            {milestones.map((m, i) => (
              <MilestoneItem
                key={m.year}
                item={m}
                index={i}
                isLast={i === milestones.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 md:py-24 bg-foreground-950 text-background-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 text-center mb-12">
            Impact by the Numbers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { number: '12,000', suffix: '+', label: 'Support Messages' },
              { number: '2,400', suffix: '+', label: 'Community Members' },
              { number: '48', suffix: '+', label: 'Active Circles' },
              { number: '$0', suffix: '', label: 'Cost to Join' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-5xl md:text-6xl tracking-tighter mb-2">
                  <em className="not-italic gradient-text">{s.number}</em>
                  <span className="text-background-50">{s.suffix}</span>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-foreground-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-primary-300">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter text-foreground-950 leading-[0.9] mb-6">
            Be Part of the <em className="not-italic text-background-50">Community</em>
          </h2>
          <p className="font-mono text-base text-foreground-800 leading-relaxed mb-8">
            Whether you need to share, listen, or just sit quietly among people who understand — you belong here. No pressure. No performance. Just presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/#join')}
              className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-10 py-5 rounded-full whitespace-nowrap cursor-pointer"
            >
              Join Free
            </button>
            <button
              onClick={() => navigate('/stories')}
              className="font-mono text-sm uppercase tracking-wider border-2 border-foreground-950 text-foreground-950 px-10 py-5 rounded-full hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              Read the Stories
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}