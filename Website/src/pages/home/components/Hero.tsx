import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden hero-wash">
      <div className="hero-photo" aria-hidden="true">
        <img
          src="/images/HeroImage.png"
          alt=""
          className="hero-photo-img"
          loading="eager"
        />
      </div>

      <div
        className={`relative z-10 max-w-7xl mx-auto min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-6 md:px-12 lg:px-16 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-xl lg:max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-950 mb-6 block">
            Community Driven — Peer Support
          </span>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-foreground-950 uppercase mb-6">
            Stories That{' '}
            <em className="not-italic gradient-text whitespace-nowrap">Truly See</em>{' '}
            Us All
          </h1>

          <p className="font-mono text-base md:text-lg text-foreground-600 leading-relaxed max-w-md mb-10">
            NotOnlyHere is where honest stories find kind listeners, quiet nights find company, and small acts of vulnerability ripple into real belonging.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full text-center whitespace-nowrap cursor-pointer"
            >
              Find Your Circle
            </button>
            <button
              type="button"
              onClick={() => navigate('/how-it-works')}
              className="font-mono text-sm uppercase tracking-wider border-2 border-foreground-950 text-foreground-950 px-8 py-4 rounded-full hover:bg-foreground-950 hover:text-background-50 transition-all duration-200 text-center whitespace-nowrap cursor-pointer"
            >
              See How It Works
            </button>
          </div>

          <p className="mt-6 font-mono text-sm text-foreground-500">
            Already a member?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-foreground-700 hover:text-foreground-950 hover:underline transition-colors duration-200 cursor-pointer"
            >
              Log in
            </button>
          </p>

          <div className="mt-16 flex items-center gap-3 text-foreground-400">
            <ArrowDown size={16} className="animate-bounce" />
            <span className="font-mono text-xs uppercase tracking-widest">Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  );
}
