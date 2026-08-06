'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@notonlyhere/ui';

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    ageConfirmed: false,
    termsAccepted: false,
    privacyAccepted: false,
    guidelinesAccepted: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.detail ?? data.message ?? 'Registration failed. Please check your details.');
      setLoading(false);
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
  }

  return (
    <div className="w-full max-w-lg surface-card p-8 md:p-10 animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl uppercase mb-3">
          Join <span className="gradient-text">NotOnlyHere</span>
        </h1>
        <p className="font-mono text-sm text-foreground-600">A peer-support community for people 16 and older.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Display name" value={form.displayName} onChange={(e) => update('displayName', e.target.value)} />
        <Input label="Username" value={form.username} onChange={(e) => update('username', e.target.value)} placeholder="yourname" />
        <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          hint="At least 8 characters with a number and symbol"
        />

        <label className="flex items-start gap-3 font-mono text-xs text-foreground-600">
          <input type="checkbox" checked={form.ageConfirmed} onChange={(e) => update('ageConfirmed', e.target.checked)} className="mt-1" />
          I confirm I am 16 or older
        </label>
        <label className="flex items-start gap-3 font-mono text-xs text-foreground-600">
          <input type="checkbox" checked={form.termsAccepted && form.privacyAccepted && form.guidelinesAccepted} onChange={(e) => {
            update('termsAccepted', e.target.checked);
            update('privacyAccepted', e.target.checked);
            update('guidelinesAccepted', e.target.checked);
          }} className="mt-1" />
          I accept the Terms, Privacy Policy, and Community Guidelines
        </label>

        {error && <p className="font-mono text-xs text-red-600" role="alert">{error}</p>}
        <Button fullWidth size="lg" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="font-mono text-xs text-center text-foreground-600 mt-6">
        Already have an account? <Link href="/login" className="gradient-text">Sign in</Link>
      </p>
    </div>
  );
}
