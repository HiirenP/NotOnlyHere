import { useState } from 'react';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth handled by Supabase connection when available
  };

  const canSubmit = name.trim() && email.trim() && username.trim() && password.trim() && ageConfirmed && termsConfirmed;

  return (
    <main className="bg-background-50 min-h-screen flex flex-col">
      <Nav />

      <section className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="bg-background-100 border border-background-200 p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-950 uppercase mb-3 leading-[0.9]">
                Join <em className="not-italic gradient-text">NotOnlyHere</em>
              </h1>
              <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                Create your free account in under a minute. Access the full community on the web — Circles, messaging, anonymous posting, and more. No download needed.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reg-name" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                  Name <span className="text-foreground-400">(optional display name)</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we call you?"
                  className="w-full font-mono text-sm px-4 py-3 bg-background-50 border border-background-200 focus:border-foreground-400 focus:outline-none text-foreground-950 placeholder:text-foreground-400"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                  Email <span className="text-foreground-400">(required)</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full font-mono text-sm px-4 py-3 bg-background-50 border border-background-200 focus:border-foreground-400 focus:outline-none text-foreground-950 placeholder:text-foreground-400"
                />
              </div>

              <div>
                <label htmlFor="reg-username" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                  Username <span className="text-foreground-400">(required)</span>
                </label>
                <input
                  id="reg-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full font-mono text-sm px-4 py-3 bg-background-50 border border-background-200 focus:border-foreground-400 focus:outline-none text-foreground-950 placeholder:text-foreground-400"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                  Password <span className="text-foreground-400">(required)</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full font-mono text-sm px-4 py-3 pr-12 bg-background-50 border border-background-200 focus:border-foreground-400 focus:outline-none text-foreground-950 placeholder:text-foreground-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 border-background-300 text-foreground-950 focus:ring-foreground-400 accent-foreground-950 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-foreground-600 leading-relaxed">
                    I confirm that I am <strong className="text-foreground-950">at least 16 years old</strong> (or have parental consent).
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsConfirmed}
                    onChange={(e) => setTermsConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 border-background-300 text-foreground-950 focus:ring-foreground-400 accent-foreground-950 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-foreground-600 leading-relaxed">
                    I agree to the{' '}
                    <a
                      href="/terms"
                      onClick={(e) => e.stopPropagation()}
                      className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="/guidelines"
                      onClick={(e) => e.stopPropagation()}
                      className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Community Guidelines
                    </a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 py-4 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </form>

            {/* Login link */}
            <p className="font-mono text-sm text-foreground-500 text-center mt-8">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer"
              >
                Log in
              </a>
            </p>

            <p className="font-mono text-xs text-foreground-400 text-center mt-4">
              After registering, log in from any browser to access your community.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}