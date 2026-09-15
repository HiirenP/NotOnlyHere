import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Circles', href: '/circles' },
  { label: 'Ava', href: '/ai-support' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    navigate(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background-50/95 backdrop-blur-sm border-b border-background-200' : 'bg-transparent'
      }`}
    >
      <nav className="px-4 sm:px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); setOpen(false); }} className="cursor-pointer flex-shrink-0">
          <img
            src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
            alt="NotOnlyHere — Real People. Real Connections."
            className="h-10 w-auto object-contain"
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="font-mono text-xs uppercase tracking-widest text-foreground-700 hover:gradient-text transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="/login"
            onClick={(e) => handleNavClick(e, '/login')}
            className="font-mono text-xs uppercase tracking-widest text-foreground-700 hover:gradient-text transition-colors duration-200 cursor-pointer"
          >
            Log In
          </a>
          <a
            href="/register"
            onClick={(e) => handleNavClick(e, '/register')}
            className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-5 py-2.5 rounded-full whitespace-nowrap cursor-pointer"
          >
            Join Free
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground-900 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-background-50 border-t border-background-200 px-6 py-8 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => handleNavClick(e, l.href)}
              className="font-mono text-sm uppercase tracking-widest text-foreground-800 hover:gradient-text transition-colors cursor-pointer"
            >
              {l.label}
            </a>
          ))}
          <div className="border-t border-background-200 pt-5 mt-2 flex flex-col gap-4">
            <a
              href="/login"
              onClick={(e) => handleNavClick(e, '/login')}
              className="font-mono text-sm uppercase tracking-widest text-foreground-700 hover:gradient-text transition-colors cursor-pointer"
            >
              Log In
            </a>
            <a
              href="/register"
              onClick={(e) => handleNavClick(e, '/register')}
              className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-5 py-3 rounded-full text-center cursor-pointer whitespace-nowrap"
            >
              Join Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}