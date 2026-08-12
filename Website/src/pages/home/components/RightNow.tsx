import { useEffect, useRef, useState } from 'react';
import { HeartHandshake, MessageCircle, Sparkles, UserPlus, Users } from 'lucide-react';

const notifications = [
  { text: '46 people online', meta: 'Live now', icon: Users, live: true },
  { text: '15 conversations happening', meta: 'Just now', icon: MessageCircle, live: false },
  { text: 'Someone just received encouragement.', meta: 'Moments ago', icon: HeartHandshake, live: false },
  { text: 'Three new members joined today.', meta: 'Today', icon: UserPlus, live: false },
  { text: 'Someone in the Grief Circle is celebrating a small victory.', meta: 'Grief & Loss', icon: Sparkles, live: false },
];

export default function RightNow() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    setVisibleCount(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setVisibleCount(i);
      if (i < notifications.length) {
        timer = window.setTimeout(tick, 900);
      }
    };
    let timer = window.setTimeout(tick, 280);
    return () => window.clearTimeout(timer);
  }, [inView]);

  return (
    <section ref={ref} className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-100">
      <div className="max-w-lg mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4 text-center">
          Live community
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tighter text-foreground-950 uppercase mb-10 leading-[0.9] text-center">
          Right <em className="not-italic gradient-text">now</em>
        </h2>

        <div className="relative flex flex-col gap-3">
          {notifications.slice(0, visibleCount).map((item) => (
            <div key={item.text} className="notif-toast notif-toast-in">
              <div className="relative w-11 h-11 rounded-2xl bg-background-100 border border-background-200 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-foreground-800" />
                {item.live && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#0cbc87] notif-pulse" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-foreground-900 leading-snug">{item.text}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-400 mt-1">{item.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
