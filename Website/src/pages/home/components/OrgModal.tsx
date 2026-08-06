import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface OrgModalProps {
  open: boolean;
  onClose: () => void;
}

const ORG_TYPES = [
  'Non-Profit',
  'Community Group',
  'School / University',
  'Government Agency',
  'Social Enterprise',
  'Faith-Based Org',
  'Corporate CSR',
];

const FOCUS_AREAS = [
  'Education',
  'Food Security',
  'Mental Health',
  'Youth Development',
  'Environment',
  'Housing',
  'Employment',
  'Arts & Culture',
];

export default function OrgModal({ open, onClose }: OrgModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setTimeout(() => {
        setSubmitted(false);
        setLoading(false);
        setCharCount(0);
        setSelectedFocus([]);
      }, 300);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleFocus = (area: string) => {
    setSelectedFocus((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set('focus_areas', selectedFocus.join(', '));

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground-950/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-paper-50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-background-50 z-10 flex items-start justify-between px-8 pt-8 pb-4 border-b border-background-200">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-kraft-500 block mb-1">
              Partner with us
            </span>
            <h2 className="font-display text-3xl uppercase tracking-tight text-charcoal-900 leading-tight">
              Register Your<br /><em className="not-italic text-kraft-400">Organization</em>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-background-300 text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer mt-1"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="px-8 py-16 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 mx-auto mb-6">
              <i className="ri-building-line text-2xl text-charcoal-900" />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-tight text-foreground-950 mb-3">
              Application Received!
            </h3>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed max-w-xs mx-auto mb-8">
              Thanks for registering. Our partnerships team will review your application and be in touch within 3–5 business days.
            </p>
            <button
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-wider gradient-btn text-background-50 px-8 py-3 rounded-full cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="px-8 py-6 flex flex-col gap-5"
          >
            {/* Org name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Organization name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="org_name"
                required
                placeholder="e.g. Bright Futures Foundation"
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
              />
            </div>

            {/* Org type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Organization type <span className="text-red-500">*</span>
              </label>
              <select
                name="org_type"
                required
                defaultValue=""
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 focus:outline-none focus:border-foreground-600 transition-colors cursor-pointer appearance-none"
              >
                <option value="" disabled>Select type…</option>
                {ORG_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Contact name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  Contact first name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  placeholder="Jane"
                  className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  Contact last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  placeholder="Smith"
                  className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Work email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="jane@yourorg.org"
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
              />
            </div>

            {/* Website */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Website
              </label>
              <input
                type="url"
                name="website"
                placeholder="https://yourorg.org"
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
              />
            </div>

            {/* Focus areas */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Focus areas <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocus(area)}
                    className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      selectedFocus.includes(area)
                        ? 'bg-charcoal-900 text-paper-50 border-charcoal-900'
                        : 'bg-transparent text-charcoal-700 border-paper-300 hover:border-charcoal-500'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              <input type="hidden" name="focus_areas" value={selectedFocus.join(', ')} />
            </div>

            {/* Team size */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Team / member size
              </label>
              <select
                name="team_size"
                defaultValue=""
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 focus:outline-none focus:border-foreground-600 transition-colors cursor-pointer appearance-none"
              >
                <option value="" disabled>Select…</option>
                <option value="1-10">1–10 people</option>
                <option value="11-50">11–50 people</option>
                <option value="51-200">51–200 people</option>
                <option value="200+">200+ people</option>
              </select>
            </div>

            {/* How can we help */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                How can we support your org?
              </label>
              <textarea
                name="support_needed"
                rows={3}
                maxLength={500}
                placeholder="Tell us about your mission and what kind of partnership you&apos;re looking for…"
                onChange={(e) => setCharCount(e.target.value.length)}
                className="bg-paper-100 border border-paper-300 rounded-lg px-4 py-3 font-mono text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-charcoal-600 transition-colors resize-none"
              />
              <span className="font-mono text-xs text-foreground-400 text-right">{charCount}/500</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || selectedFocus.length === 0}
              className="mt-2 w-full font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer whitespace-nowrap"
            >
              {loading ? 'Sending…' : 'Submit Application'}
            </button>

            <p className="font-mono text-xs text-foreground-400 text-center leading-relaxed">
              We&apos;ll review your application and respond within 3–5 business days.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
