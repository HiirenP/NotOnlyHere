import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: 'NotOnlyHere gave me a place to be honest without performing. Late Night Lounge is my 2am safe place — no judgment, just people who get it.',
    name: 'Anonymous member',
    role: 'Late Night Lounge',
    avatar: 'https://readdy.ai/api/search-image?query=Warm%20portrait%20of%20a%20young%20adult%20with%20a%20gentle%20smile%20soft%20natural%20light%20neutral%20background%20editorial%20headshot%20style%20warm%20tones&width=200&height=200&seq=testimonial-avatar-1&orientation=squarish',
  },
  {
    quote: 'I was struggling alone for months. The first time I posted anonymously, I got 40 thoughtful responses. It reminded me that people actually care.',
    name: 'Anonymous member',
    role: 'Gentle Support Circle',
    avatar: 'https://readdy.ai/api/search-image?query=Portrait%20of%20a%20thoughtful%20person%20looking%20away%20soft%20natural%20window%20light%20warm%20neutral%20background%20editorial%20photography%20warm%20earth%20tones&width=200&height=200&seq=testimonial-avatar-2&orientation=squarish',
  },
  {
    quote: 'The moderators here actually moderate. I have never seen a space this kind on the internet. It feels like being wrapped in a blanket.',
    name: 'Anonymous member',
    role: 'Night Shade Circle',
    avatar: 'https://readdy.ai/api/search-image?query=Warm%20portrait%20of%20a%20person%20with%20genuine%20smile%20soft%20studio%20light%20neutral%20background%20editorial%20headshot%20style%20warm%20natural%20tones&width=200&height=200&seq=testimonial-avatar-3&orientation=squarish',
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);

  return (
    <section className="py-20 md:py-32 bg-background-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: testimonial image */}
          <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '3/4' }}>
            <img
              src="https://readdy.ai/api/search-image?query=Community%20member%20sharing%20their%20story%20warm%20candid%20portrait%20soft%20natural%20light%20gentle%20expression%20editorial%20photography%20warm%20neutral%20earth%20tones&width=700&height=900&seq=testimonial-img&orientation=portrait"
              alt="Community member sharing their story"
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>

          {/* Right: quote content */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-8">
              Voices from the community
            </p>

            <div className="transition-all duration-500">
              <blockquote className="font-display text-3xl md:text-4xl leading-tight tracking-tighter text-foreground-950 mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-background-50 shadow-md flex-shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-foreground-950">{t.name}</p>
                  <p className="font-mono text-xs text-foreground-400 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  className="w-12 h-12 border-2 border-foreground-950 rounded-full flex items-center justify-center hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="font-mono text-xs text-foreground-400 uppercase tracking-widest">
                  {idx + 1} / {testimonials.length}
                </span>
                <button
                  onClick={next}
                  className="w-12 h-12 border-2 border-foreground-950 rounded-full flex items-center justify-center hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}