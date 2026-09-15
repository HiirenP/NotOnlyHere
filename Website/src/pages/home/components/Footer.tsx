import { useState } from 'react';

const exploreLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Circles', href: '/circles' },
  { label: 'Blog', href: '/blog' },
  { label: 'Services', href: '/services' },
];

const communityLinks = [
  { label: 'Ava', href: '/ai-support' },
  { label: 'Support Us', href: '/support' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Community Guidelines', href: '/guidelines' },
];

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const honeypot = (data.get('website_alt') as string || '').trim();
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    data.delete('website_alt');

    const body = new URLSearchParams();
    data.forEach((value, key) => body.append(key, value as string));

    setLoading(true);
    setFormError('');
    try {
      const res = await fetch('https://readdy.ai/api/form/d9k3hn0hpes2mi34sfq0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const text = await res.text();
      let parsed: any = {};
      try { parsed = JSON.parse(text); } catch { /* ignore */ }
      if (res.ok && parsed?.code === 'OK') {
        setSubmitted(true);
        setEmail('');
      } else {
        const msg = parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || text || 'Something went wrong. Please try again.';
        setFormError(msg);
      }
    } catch {
      setFormError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-background-100 text-foreground-950 py-16 px-4 sm:px-6 md:px-12 lg:px-16 border-t border-background-200">
      <div className="mb-12">
        <img
          src="https://static.readdy.ai/image/625b665eabd64e8e26dc00b3dfd3bc8f/0f7f3e340b64adaf58909c4de1c45074.png"
          alt="NotOnlyHere — Real People. Real Connections."
          className="h-12 w-auto object-contain"
        />
        <p className="font-mono text-sm text-foreground-600 mt-3">You&apos;re Truly Seen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
        {/* Col1: Brand */}
        <div className="md:col-span-4">
          <p className="font-mono text-sm leading-relaxed text-foreground-600 max-w-xs mb-6">
            A warm peer-support community — accessible from any browser. No app download required.
          </p>
          <div className="flex gap-3">
            {['ri-twitter-x-line', 'ri-instagram-line', 'ri-facebook-line', 'ri-linkedin-line'].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-background-200 rounded-full hover:bg-background-200 transition-colors duration-200 cursor-pointer"
                aria-label={icon}
              >
                <i className={`${icon} text-foreground-600`} />
              </a>
            ))}
          </div>
        </div>

        {/* Col2: Explore */}
        <div className="md:col-span-2">
          <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-4">
            Explore
          </h4>
          <ul className="space-y-2">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-foreground-700 hover:text-foreground-950 transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col3: Community */}
        <div className="md:col-span-2">
          <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-4">
            Community
          </h4>
          <ul className="space-y-2">
            {communityLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-foreground-700 hover:text-foreground-950 transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col4: Legal + Newsletter */}
        <div className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-4">
            Legal
          </h4>
          <ul className="space-y-2 mb-6">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-foreground-700 hover:text-foreground-950 transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <h4 className="font-mono text-xs uppercase tracking-widest text-foreground-400 mb-3">
            A gentle letter, monthly
          </h4>
          <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-4">
            Reflections and community news. No noise, unsubscribe anytime.
          </p>

          {submitted ? (
            <p className="font-mono text-sm text-foreground-600 bg-background-200 px-4 py-3 rounded-full text-center">
              Thanks for subscribing! You&apos;ll hear from us soon.
            </p>
          ) : (
            <form
              data-readdy-form
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                name="website_alt"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                readOnly
                className="sr-only"
              />
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 font-mono text-sm px-4 py-2.5 bg-white border border-background-200 rounded-full focus:outline-none focus:border-foreground-400 text-foreground-950"
              />
              <button
                type="submit"
                disabled={loading}
                className="font-mono text-xs uppercase tracking-widest gradient-btn text-background-50 px-5 py-2.5 rounded-full whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Subscribe'}
              </button>
              {formError && (
                <p className="font-mono text-xs text-red-500 w-full">{formError}</p>
              )}
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-background-200 pt-8">
        <p className="font-mono text-xs text-foreground-500 leading-relaxed mb-6">
          <strong>If you are in crisis:</strong> NotOnlyHere is a peer-support community, not a substitute for professional mental health care. If you are in crisis, call or text <strong>988</strong> (Suicide & Crisis Lifeline) or contact local emergency services.
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-foreground-400">
            &copy; 2026 NotOnlyHere | <a href="mailto:info@notonlyhere.com" className="hover:text-foreground-700 transition-colors cursor-pointer">info@notonlyhere.com</a>
          </p>
          <div className="flex gap-6">
            {legalLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                rel="nofollow"
                className="font-mono text-xs text-foreground-400 hover:text-foreground-700 transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}