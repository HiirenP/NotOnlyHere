import { Link } from 'react-router-dom';
import { Button, Input } from '@/design-system';
import { AuthShell } from '@/layouts/Shells';

export function LoginScreen() {
  return (
    <AuthShell>
      <div className="w-full max-w-md surface-card p-8 md:p-10 animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-950 uppercase mb-3 leading-[0.9]">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="font-mono text-sm text-foreground-600 leading-relaxed">
            Sign in to access your Circles, messages, community feed, and more — all in your browser.
          </p>
        </div>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input label="Email or Username" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <div className="flex justify-end">
            <Link to="/design/auth/forgot-password" className="font-mono text-xs text-foreground-500 hover:gradient-text">
              Forgot password?
            </Link>
          </div>
          <Button fullWidth size="lg">Log In</Button>
        </form>
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-background-200" />
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-400">or</span>
          <div className="flex-1 h-px bg-background-200" />
        </div>
        <div className="space-y-3">
          <Button variant="secondary" fullWidth>Continue with Google</Button>
          <Button variant="secondary" fullWidth>Continue with Apple</Button>
        </div>
        <p className="font-mono text-xs text-center text-foreground-600 mt-6">
          New here? <Link to="/design/auth/register" className="gradient-text">Join NotOnlyHere</Link>
        </p>
      </div>
    </AuthShell>
  );
}

export function RegisterScreen() {
  return (
    <AuthShell>
      <div className="w-full max-w-lg surface-card p-8 md:p-10 animate-fade-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl tracking-tighter text-foreground-950 uppercase mb-3 leading-[0.9]">
            Join <span className="gradient-text">NotOnlyHere</span>
          </h1>
          <p className="font-mono text-sm text-foreground-600">A peer-support community for people 16 and older.</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Display name" placeholder="How you want to appear" />
          <Input label="Username" placeholder="@username" />
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" hint="At least 8 characters with a number and symbol" />
          <label className="flex items-start gap-3 font-mono text-xs text-foreground-600">
            <input type="checkbox" className="mt-1" />
            I confirm I am 16 or older
          </label>
          <label className="flex items-start gap-3 font-mono text-xs text-foreground-600">
            <input type="checkbox" className="mt-1" />
            I accept the Terms and Community Guidelines
          </label>
          <Button fullWidth size="lg">Create account</Button>
        </form>
      </div>
    </AuthShell>
  );
}

export function VerifyEmailScreen() {
  return (
    <AuthShell>
      <div className="w-full max-w-md surface-card p-8 text-center animate-fade-up">
        <h1 className="font-display text-3xl uppercase text-foreground-950 mb-3">Check your email</h1>
        <p className="font-mono text-sm text-foreground-600 leading-relaxed mb-6">
          We sent a verification link to <strong>you@example.com</strong>. The link expires in 24 hours.
        </p>
        <Button variant="secondary" fullWidth>Resend email</Button>
      </div>
    </AuthShell>
  );
}

export function ForgotPasswordScreen() {
  return (
    <AuthShell>
      <div className="w-full max-w-md surface-card p-8 animate-fade-up">
        <h1 className="font-display text-3xl uppercase text-foreground-950 mb-3">Reset password</h1>
        <p className="font-mono text-sm text-foreground-600 mb-6">Enter your email and we will send a reset link.</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Email" type="email" />
          <Button fullWidth>Send reset link</Button>
        </form>
      </div>
    </AuthShell>
  );
}
