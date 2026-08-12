import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';

type Tab = 'feed' | 'circles' | 'ava' | 'anonymous';

const avatars = {
  jordan: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  sam: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
};

const circles = [
  {
    name: 'Anxiety Support',
    line: 'A calm place when your mind won’t quiet down',
    active: 38,
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=320&fit=crop',
    joined: true,
  },
  {
    name: 'Grief & Loss',
    line: 'A gentle space that doesn’t rush your process',
    active: 14,
    cover: 'https://images.unsplash.com/photo-1517456793572-1d8aabeb110a?w=800&h=320&fit=crop',
    joined: false,
  },
  {
    name: 'Work Stress',
    line: 'I’m joining Work Stress Circle tonight',
    active: 41,
    cover: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=320&fit=crop',
    joined: false,
  },
];

function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-background-200 shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-white">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#f5f6f8] border-b border-[#e8eaed]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#d6293e]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#f7c32e]/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#0cbc87]/80" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-[#a1a5b3]">
          app.notonlyhere.com
        </span>
      </div>
      <div className="bg-[#eff2f6] p-3 sm:p-5 min-h-[420px] max-h-[540px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function FeedView() {
  return (
    <div className="space-y-3 max-w-lg mx-auto">
      <article className="bg-white border border-[#e8eaed] rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 pb-2">
          <img src={avatars.jordan} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-bold text-[#14191e]">Jordan Lee</p>
            <p className="text-xs text-[#a1a5b3]">2h · In Anxiety Support</p>
          </div>
        </div>
        <p className="px-4 pb-3 text-sm text-[#14191e] leading-relaxed">I finally got out of bed today.</p>
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
          alt=""
          className="w-full h-40 object-cover"
        />
        <div className="px-4 py-2.5 flex items-center gap-4 text-xs font-semibold text-[#676a79] border-t border-[#e8eaed]">
          <span className="flex items-center gap-1.5 text-[#0f6fec]"><Heart size={14} className="fill-[#0f6fec]" /> 24</span>
          <span className="flex items-center gap-1.5"><MessageCircle size={14} /> 9</span>
        </div>
        <div className="px-4 py-3 bg-[#fafbfc] border-t border-[#e8eaed] text-sm">
          <span className="font-bold text-[#14191e]">Sam R.</span>{' '}
          <span className="text-[#676a79]">That counts. Really glad you shared it here.</span>
        </div>
      </article>

      <article className="bg-white border border-[#e8eaed] rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className="w-10 h-10 rounded-full bg-[#6610f2]/15 text-[#6610f2] flex items-center justify-center font-bold text-sm">?</div>
          <div>
            <p className="text-sm font-bold text-[#14191e]">Anonymous</p>
            <p className="text-xs text-[#a1a5b3]">4h · Anxiety Support</p>
          </div>
        </div>
        <p className="px-4 pb-2 text-sm text-[#14191e] leading-relaxed">Today was my first panic-free morning in weeks.</p>
        <span className="inline-block mx-4 mb-3 text-[10px] font-bold px-2 py-0.5 bg-[#6610f2]/10 text-[#6610f2] rounded uppercase">
          Anonymous
        </span>
        <div className="px-4 py-3 bg-[#fafbfc] border-t border-[#e8eaed] text-sm">
          <span className="font-bold text-[#14191e]">Anonymous</span>{' '}
          <span className="text-[#676a79]">I heard you. Holding that with you.</span>
        </div>
      </article>
    </div>
  );
}

function CirclesView() {
  return (
    <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
      {circles.map((circle) => (
        <div key={circle.name} className="bg-white border border-[#e8eaed] rounded-lg overflow-hidden">
          <div className="relative h-24">
            <img src={circle.cover} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-3">
            <p className="text-sm font-bold text-[#14191e]">{circle.name}</p>
            <p className="text-xs text-[#676a79] mt-1 leading-relaxed">{circle.line}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-[#a1a5b3]">{circle.active} people active today</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-md ${circle.joined ? 'bg-[#f5f6f8] text-[#676a79]' : 'bg-[#0f6fec] text-white'}`}>
                {circle.joined ? 'Joined' : 'Join'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AvaView() {
  return (
    <div className="max-w-lg mx-auto bg-white border border-[#e8eaed] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f6fec] to-[#6610f2] flex items-center justify-center text-white">
          <Sparkles size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#14191e]">Ava</p>
          <p className="text-xs text-[#676a79]">Private · AI companion — not a therapist</p>
        </div>
      </div>
      <div className="p-4 space-y-3 bg-[#f5f6f8]/40 min-h-[280px]">
        <div className="max-w-[85%] bg-white border border-[#e8eaed] rounded-2xl rounded-bl-md px-4 py-3 text-sm text-[#14191e]">
          <span className="text-[10px] font-bold text-[#a1a5b3] uppercase block mb-1">Ava · AI</span>
          Hi. I’m here for supportive conversation — not therapy or emergencies. What would feel helpful today?
        </div>
        <div className="ml-auto max-w-[85%] bg-[#0f6fec]/10 rounded-2xl rounded-br-md px-4 py-3 text-sm text-[#14191e]">
          I’m feeling overwhelmed about work.
        </div>
        <div className="max-w-[85%] bg-white border border-[#e8eaed] rounded-2xl rounded-bl-md px-4 py-3 text-sm text-[#14191e]">
          Would it help to name one small thing that felt manageable today? You don’t have to solve everything at once.
        </div>
      </div>
      <div className="p-3 border-t border-[#e8eaed] flex gap-2">
        <div className="flex-1 text-sm text-[#a1a5b3] bg-[#f5f6f8] rounded-full px-4 py-2.5">Message Ava...</div>
        <span className="text-xs font-bold bg-[#0f6fec] text-white px-4 py-2.5 rounded-md">Send</span>
      </div>
    </div>
  );
}

function AnonymousView() {
  return (
    <div className="space-y-3 max-w-lg mx-auto">
      <div className="bg-white border border-[#e8eaed] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6610f2]/15 text-[#6610f2] flex items-center justify-center font-bold text-sm">?</div>
          <div>
            <p className="text-sm font-bold text-[#14191e]">Posting as Anonymous</p>
            <p className="text-xs text-[#6610f2] font-semibold">Visible in Anxiety Support · no name attached</p>
          </div>
        </div>
        <p className="px-4 py-6 text-sm text-[#a1a5b3]">What’s one true sentence for today?</p>
        <div className="px-4 py-3 bg-[#f5f6f8] border-t border-[#e8eaed] flex items-center justify-between gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 border border-[#6610f2]/30 bg-[#6610f2]/5 text-[#6610f2] rounded-lg">
            Anonymous
          </span>
          <span className="text-xs font-bold bg-[#0f6fec] text-white px-4 py-2 rounded-md">Publish post</span>
        </div>
      </div>

      <article className="bg-white border border-[#e8eaed] rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className="w-10 h-10 rounded-full bg-[#6610f2]/15 text-[#6610f2] flex items-center justify-center font-bold text-sm">?</div>
          <div>
            <p className="text-sm font-bold text-[#14191e]">Anonymous</p>
            <p className="text-xs text-[#a1a5b3]">2d · Grief & Loss</p>
          </div>
        </div>
        <p className="px-4 pb-2 text-sm text-[#14191e] leading-relaxed">
          I don’t need advice today. I just needed someone to hear me.
        </p>
        <span className="inline-block mx-4 mb-3 text-[10px] font-bold px-2 py-0.5 bg-[#6610f2]/10 text-[#6610f2] rounded uppercase">
          Anonymous
        </span>
        <div className="px-4 py-3 bg-[#fafbfc] border-t border-[#e8eaed] text-sm">
          <span className="font-bold text-[#14191e]">Riley N.</span>{' '}
          <span className="text-[#676a79]">You’re welcome here exactly as you are.</span>
        </div>
      </article>
    </div>
  );
}

export default function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState<Tab>('feed');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'feed', label: 'The feed' },
    { id: 'circles', label: 'Circles' },
    { id: 'ava', label: 'Ava' },
    { id: 'anonymous', label: 'Anonymous posting' },
  ];

  return (
    <section ref={ref} id="inside" className="py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
      <div
        className="max-w-5xl mx-auto transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <div className="text-center mb-10">
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
            Inside the community
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase max-w-3xl mx-auto leading-[0.9] mb-4">
            Picture yourself <em className="not-italic gradient-text">here</em>
          </h2>
          <p className="font-mono text-base text-foreground-600 leading-relaxed max-w-xl mx-auto">
            This is the member app — the feed, Circles, Ava, and anonymous posting. Same screens you’ll use after you join.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors cursor-pointer ${
                tab === item.id
                  ? 'gradient-btn text-background-50'
                  : 'bg-background-50 border border-background-200 text-foreground-700 hover:border-foreground-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <AppChrome>
          {tab === 'feed' && <FeedView />}
          {tab === 'circles' && <CirclesView />}
          {tab === 'ava' && <AvaView />}
          {tab === 'anonymous' && <AnonymousView />}
        </AppChrome>
      </div>
    </section>
  );
}
