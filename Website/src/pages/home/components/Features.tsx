import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PolaroidCardProps {
  children: React.ReactNode;
  rotate: string;
  tapeColor: string;
  tapePos: string;
  className?: string;
  delay?: number;
  to?: string;
}

function PolaroidCard({ children, rotate, tapeColor, tapePos, className = '', delay = 0, to }: PolaroidCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`relative bg-background-50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer ${rotate} ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, scale 0.3s ease`,
      }}
    >
      <div className={`absolute ${tapePos} w-16 h-4 ${tapeColor} z-10`} style={{ borderRadius: '2px' }} />
      {children}
    </div>
  );
}

export default function Features() {
  return (
    <section id="stories" className="py-16 md:py-28 px-4 sm:px-6 md:px-12 lg:px-16 bg-background-50">
      <div className="mb-12 md:mb-16 text-center">
        <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">
          What We Do
        </span>
        <h2 className="font-display text-5xl md:text-6xl tracking-tighter text-charcoal-900 uppercase max-w-3xl mx-auto leading-[0.9]">
          How We Show Up <em className="not-italic gradient-text">For Each Other</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Card 1 — Themed Circles */}
        <PolaroidCard
          rotate="-rotate-1"
          tapeColor="bg-primary-300/70"
          tapePos="top-3 right-8 rotate-[6deg]"
          className="md:col-span-7 p-3 pb-10 h-full"
          delay={0}
          to="/story/community-events"
        >
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <img
              src="https://readdy.ai/api/search-image?query=People%20in%20a%20supportive%20group%20conversation%20sitting%20in%20a%20circle%20warm%20indoor%20lighting%20soft%20natural%20light%20candid%20documentary%20photography%20muted%20earth%20tones%20cozy%20atmosphere&width=800&height=500&seq=feature-circles&orientation=landscape"
              alt="People in a supportive group conversation"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute top-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-foreground-950/80 text-background-50 px-3 py-1.5 rounded-sm">
                Live Circles
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="font-display text-3xl uppercase tracking-tight text-background-50 mb-2">
                Themed Circles
              </h3>
              <p className="font-mono text-sm text-background-200 leading-relaxed">
                Small group spaces for gentle support, late-night connection, and honest conversation — each with its own pace.
              </p>
            </div>
          </div>
        </PolaroidCard>

        {/* Card 2 — Share Without the Spotlight */}
        <PolaroidCard
          rotate="rotate-2"
          tapeColor="bg-secondary-300/70"
          tapePos="top-2 left-1/3 rotate-[-5deg]"
          className="md:col-span-5 p-3 pb-10"
          delay={100}
          to="/story/volunteer-programs"
        >
          <div className="w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <img
              src="https://readdy.ai/api/search-image?query=Quiet%20moment%20of%20reflection%20person%20sitting%20alone%20by%20a%20window%20soft%20moody%20lighting%20warm%20tones%20editorial%20photography%20intimate%20peaceful%20atmosphere&width=800&height=500&seq=feature-anon&orientation=landscape"
              alt="Quiet moment of reflection"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute top-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-foreground-950/80 text-background-50 px-3 py-1.5 rounded-sm">
                Anonymous mode
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-1">
              Share Without the Spotlight
            </h3>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed">
              Post anonymously when honesty feels safer without a name attached. Be real without fear of judgment.
            </p>
          </div>
        </PolaroidCard>

        {/* Card 3 — Moderated & Safe */}
        <PolaroidCard
          rotate="-rotate-1"
          tapeColor="bg-primary-300/70"
          tapePos="top-2 right-1/4 rotate-[4deg]"
          className="md:col-span-4 p-3 pb-10"
          delay={200}
          to="/story/skills-workshops"
        >
          <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://readdy.ai/api/search-image?query=Supportive%20team%20environment%20people%20working%20together%20warm%20indoor%20lighting%20collaborative%20atmosphere%20editorial%20photography%20soft%20neutral%20earth%20tones&width=800&height=500&seq=feature-moderated&orientation=landscape"
              alt="Supportive team environment"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute top-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-foreground-950/80 text-background-50 px-3 py-1.5 rounded-sm">
                Moderated
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-1">
              Moderated & Safe
            </h3>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed">
              Real moderators, clear guidelines, and zero tolerance for harassment keep the space warm for everyone.
            </p>
          </div>
        </PolaroidCard>

        {/* Card 4 — Stories & Reflections */}
        <PolaroidCard
          rotate="rotate-1"
          tapeColor="bg-primary-200/70"
          tapePos="top-2 left-1/4 rotate-[-4deg]"
          className="md:col-span-4 p-3 pb-10"
          delay={280}
          to="/story/mentorship-circles"
        >
          <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://readdy.ai/api/search-image?query=Journal%20and%20reflection%20notebook%20pen%20coffee%20cup%20on%20wooden%20desk%20warm%20morning%20light%20cozy%20quiet%20moment%20editorial%20photography%20soft%20neutral%20earth%20tones&width=800&height=500&seq=feature-stories&orientation=landscape"
              alt="Journal and reflection"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute top-4 left-4">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-foreground-950/80 text-background-50 px-3 py-1.5 rounded-sm">
                Stories
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-display text-xl uppercase tracking-tight text-foreground-950 mb-1">
              Stories & Reflections
            </h3>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed">
              A slow feed of honest posts from the community. Respond with support — nothing to win, no score to keep.
            </p>
          </div>
        </PolaroidCard>

        {/* Stat Card — Always Listening */}
        <div
          className="md:col-span-4 bg-foreground-950 p-8 flex flex-col justify-between rotate-[-1deg] hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          style={{ minHeight: '220px' }}
        >
          <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">Always listening</span>
          <p className="font-display text-5xl uppercase tracking-tighter text-background-50 leading-none mb-3">
            12,000<em className="not-italic gradient-text">+</em>
          </p>
          <p className="font-mono text-sm text-background-300 leading-relaxed">
            Support messages exchanged in our community last year — listening, not likes.
          </p>
        </div>

        {/* Stat Card — Free Forever */}
        <div
          className="md:col-span-4 bg-primary-500 p-8 flex flex-col justify-between rotate-1 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          style={{ minHeight: '200px' }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-800 block mb-4">Free forever</span>
          <p className="font-display text-5xl uppercase tracking-tighter text-foreground-950 leading-none mb-3">
            <em className="not-italic">$0</em>
          </p>
          <p className="font-mono text-sm text-foreground-800 leading-relaxed">
            No paywalls between you and people who genuinely care. Join in under a minute.
          </p>
          <a href="#join" className="mt-6 font-mono text-xs uppercase tracking-widest text-foreground-950 hover:text-foreground-700 transition-colors whitespace-nowrap cursor-pointer">
            Create your account &rarr;
          </a>
        </div>

        {/* Card 5 — Solidarity */}
        <PolaroidCard
          rotate="rotate-1"
          tapeColor="bg-primary-200/70"
          tapePos="top-2 left-1/4 rotate-[-6deg]"
          className="md:col-span-4 p-3 pb-10"
          delay={300}
          to="/story/solidarity"
        >
          <div className="w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
            <img
              src="https://readdy.ai/api/search-image?query=Friends%20together%20in%20community%20outdoors%20warm%20golden%20hour%20light%20genuine%20connection%20candid%20documentary%20photography%20soft%20earth%20tones%20editorial%20style&width=600&height=600&seq=feature-solidarity&orientation=squarish"
              alt="Friends together in community"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <p className="font-mono text-xs uppercase tracking-widest gradient-text block mb-2">Solidarity — always</p>
            <p className="font-display text-xl uppercase tracking-tight text-foreground-950 leading-tight">
              &ldquo;Being heard changes how heavy things feel.&rdquo;
            </p>
          </div>
        </PolaroidCard>

        {/* Card 6 — Quote card */}
        <div
          className="md:col-span-4 bg-background-100 border-2 border-background-200 p-8 flex flex-col justify-center rotate-[-1deg] hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          style={{ minHeight: '200px' }}
        >
          <p className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">In their words</p>
          <p className="font-display text-2xl uppercase tracking-tight text-foreground-950 mb-4 leading-tight">
            &ldquo;I felt heard — not judged.&rdquo;
          </p>
        </div>

        {/* Card 7 — Quote card 2 */}
        <div
          className="md:col-span-4 bg-background-100 border-2 border-background-200 p-8 flex flex-col justify-center rotate-1 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          style={{ minHeight: '200px' }}
        >
          <p className="font-mono text-xs uppercase tracking-widest gradient-text block mb-3">Quiet belonging</p>
          <p className="font-display text-2xl uppercase tracking-tight text-foreground-950 mb-4 leading-tight">
            &ldquo;I found my people.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}