'use client';

import { useSearchParams } from 'next/navigation';
import { AppLink } from '@/components/AppLink';
import { usePrefixedPath } from '@/components/PathPrefixProvider';
import { Button, Input } from '@notonlyhere/ui';

export function LoginForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/app';
  const error = searchParams.get('error') === 'invalid' ? 'Invalid email or password.' : '';
  const loginAction = usePrefixedPath('/api/auth/login');
  const googleOAuthHref = usePrefixedPath('/api/auth/oauth/google');
  const appleOAuthHref = usePrefixedPath('/api/auth/oauth/apple');

  return (
    <div className="w-full max-w-md surface-card p-8 md:p-10 animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl uppercase mb-3">
          Welcome <span className="gradient-text">Back</span>
        </h1>
        <p className="font-mono text-sm text-foreground-600">
          Sign in to access your Circles, messages, and community feed.
        </p>
      </div>

      <form action={loginAction} method="POST" className="space-y-5">
        <input type="hidden" name="returnTo" value={returnTo} />
        <Input
          label="Email or Username"
          name="email"
          autoComplete="username"
          required
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
        {error && (
          <p className="font-mono text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <AppLink href="/forgot-password" className="font-mono text-xs text-foreground-500 hover:gradient-text">
            Forgot password?
          </AppLink>
        </div>
        <Button fullWidth size="lg" type="submit">
          Log In
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-background-200" />
        <span className="font-mono text-xs uppercase tracking-widest text-foreground-400">or</span>
        <div className="flex-1 h-px bg-background-200" />
      </div>

      <div className="space-y-3">
        <a href={googleOAuthHref} className="block">
          <Button variant="secondary" fullWidth type="button">
            Continue with Google
          </Button>
        </a>
        <a href={appleOAuthHref} className="block">
          <Button variant="secondary" fullWidth type="button">
            Continue with Apple
          </Button>
        </a>
      </div>

      <p className="font-mono text-xs text-center text-foreground-600 mt-6">
        New here? <AppLink href="/register" className="gradient-text">Join NotOnlyHere</AppLink>
      </p>
    </div>
  );
}
