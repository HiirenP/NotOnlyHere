'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button, Input } from '@notonlyhere/ui';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.detail ?? data.message ?? 'Reset failed.');
      return;
    }
    setDone(true);
  }

  if (!token) {
    return <p className="font-mono text-sm text-foreground-600">This reset link is invalid.</p>;
  }

  return done ? (
    <div>
      <p className="font-mono text-sm text-foreground-600 mb-6">Your password was updated. Sign in with your new password.</p>
      <Link href="/login" className="gradient-btn inline-block font-mono text-xs uppercase tracking-wider text-background-50 px-5 py-3">
        Sign in
      </Link>
    </div>
  ) : (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="font-mono text-xs text-red-600">{error}</p>}
      <Button fullWidth type="submit">Update password</Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md surface-card p-8 animate-fade-up">
        <h1 className="font-display text-3xl uppercase mb-3">Choose a new password</h1>
        <Suspense fallback={<div className="font-mono text-sm">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
