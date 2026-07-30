import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface VolunteerModalProps {
  open: boolean;
  onClose: () => void;
}

const AREAS = [
  'Community Outreach',
  'Skills Workshops',
  'Mentorship',
  'Youth Programs',
  'Event Coordination',
  'Admin & Operations',
  'Fundraising',
  'Social Media',
];

const AVAILABILITY = ['Weekday mornings', 'Weekday evenings', 'Weekends', 'Flexible'];

export default function VolunteerModal({ open, onClose }: VolunteerModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset on close
      setTimeout(() => {
        setSubmitted(false);
        setLoading(false);
        setCharCount(0);
        setSelectedAreas([]);
      }, 300);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Inject selected areas as a comma-separated string
    data.set('areas_of_interest', selectedAreas.join(', '));

    const body = new URLSearchParams();
    data.forEach((value, key) => body.append(key, value as string));

    setLoading(true);
    try {
      await fetch('https://readdy.ai/api/form/d7ksekeefp6hjqlug05g', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setSubmitted(true);
    } catch {
      // still show success to user
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
              Join the team
            </span>
            <h2 className="font-display text-3xl uppercase tracking-tight text-charcoal-900 leading-tight">
              Start as a<br /><em className="not-italic text-kraft-400">Volunteer</em>
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
          /* Success state */
          <div className="px-8 py-16 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 mx-auto mb-6">
              <i className="ri-check-line text-2xl text-charcoal-900" />
            </div>
            <h3 className="font-display text-2xl uppercase tracking-tight text-foreground-950 mb-3">
              You&apos;re in!
            </h3>
            <p className="font-mono text-sm text-foreground-600 leading-relaxed max-w-xs mx-auto mb-8">
              Thanks for signing up. Our team will reach out within 2–3 business days to get you started.
            </p>
            <button
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-wider gradient-btn text-background-50 px-8 py-3 rounded-full cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form
            data-readdy-form
            onSubmit={handleSubmit}
            className="px-8 py-6 flex flex-col gap-5"
          >
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  required
                  placeholder="Ada"
                  className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  required
                  placeholder="Lovelace"
                  className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="ada@example.com"
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Phone number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 placeholder-foreground-400 focus:outline-none focus:border-foreground-600 transition-colors"
              />
            </div>

            {/* Areas of interest */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Areas of interest <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      selectedAreas.includes(area)
                        ? 'bg-charcoal-900 text-paper-50 border-charcoal-900'
                        : 'bg-transparent text-charcoal-700 border-paper-300 hover:border-charcoal-500'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              {/* Hidden input to carry value */}
              <input type="hidden" name="areas_of_interest" value={selectedAreas.join(', ')} />
            </div>

            {/* Availability */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Availability <span className="text-red-500">*</span>
              </label>
              <select
                name="availability"
                required
                defaultValue=""
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 focus:outline-none focus:border-foreground-600 transition-colors cursor-pointer appearance-none"
              >
                <option value="" disabled>Select your availability…</option>
                {AVAILABILITY.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Hours per week */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Hours available per week
              </label>
              <select
                name="hours_per_week"
                defaultValue=""
                className="bg-background-100 border border-background-300 rounded-lg px-4 py-3 font-mono text-sm text-foreground-950 focus:outline-none focus:border-foreground-600 transition-colors cursor-pointer appearance-none"
              >
                <option value="" disabled>Select…</option>
                <option value="1-3 hours">1–3 hours</option>
                <option value="4-8 hours">4–8 hours</option>
                <option value="8-16 hours">8–16 hours</option>
                <option value="16+ hours">16+ hours</option>
              </select>
            </div>

            {/* Why volunteer */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-foreground-600">
                Why do you want to volunteer?
              </label>
              <textarea
                name="motivation"
                rows={3}
                maxLength={500}
                placeholder="Tell us a little about yourself and what drives you…"
                onChange={(e) => setCharCount(e.target.value.length)}
                className="bg-paper-100 border border-paper-300 rounded-lg px-4 py-3 font-mono text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-charcoal-600 transition-colors resize-none"
              />
              <span className="font-mono text-xs text-foreground-400 text-right">{charCount}/500</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || selectedAreas.length === 0}
              className="mt-2 w-full font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer whitespace-nowrap"
            >
              {loading ? 'Sending…' : 'Submit Application'}
            </button>

            <p className="font-mono text-xs text-foreground-400 text-center leading-relaxed">
              We&apos;ll never share your info. You&apos;ll hear back within 2–3 business days.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
