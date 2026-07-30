import { useState } from 'react';
import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth handled by Supabase connection when available
  };

  return (
    <main className="bg-background-50 min-h-screen flex flex-col">
      <Nav />

      <section className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="bg-background-100 border border-background-200 p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-950 uppercase mb-3 leading-[0.9]">
                Welcome <em className="not-italic gradient-text">Back</em>
              </h1>
              <p className="font-mono text-sm text-foreground-600 leading-relaxed">
                Sign in to access your Circles, messages, community feed, and more — all in your browser.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                  Email or Username
                </label>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full font-mono text-sm px-4 py-3 bg-background-50 border border-background-200 focus:border-foreground-400 focus:outline-none text-foreground-950 placeholder:text-foreground-400"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="font-mono text-xs uppercase tracking-widest text-foreground-500 block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              <div className="flex justify-end">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-mono text-xs text-foreground-500 hover:gradient-text transition-colors cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 py-4 whitespace-nowrap cursor-pointer"
              >
                Log In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-background-200" />
              <span className="font-mono text-xs uppercase tracking-widest text-foreground-400">or</span>
              <div className="flex-1 h-px bg-background-200" />
            </div>

            {/* Social buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full font-mono text-sm flex items-center justify-center gap-3 px-4 py-3 border border-background-200 text-foreground-700 hover:bg-background-200 transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-google-line text-lg" />
                Continue with Google
              </button>
              <button
                type="button"
                className="w-full font-mono text-sm flex items-center justify-center gap-3 px-4 py-3 border border-background-200 text-foreground-700 hover:bg-background-200 transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-apple-line text-lg" />
                Continue with Apple
              </button>
            </div>

            {/* Login link */}
            <p className="font-mono text-sm text-foreground-500 text-center mt-8">
              Don&apos;t have an account?{' '}
              <a
                href="/register"
                className="text-foreground-950 underline hover:gradient-text transition-colors cursor-pointer"
              >
                Join free
              </a>
            </p>

            <p className="font-mono text-xs text-foreground-400 text-center mt-4">
              No app required. NotOnlyHere works on any device with a web browser.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}