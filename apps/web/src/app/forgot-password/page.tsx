'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Input } from '@notonlyhere/ui';
import { AuthPageShell } from '@/components/auth/AuthPageShell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <AuthPageShell>
      <div className="w-full max-w-md bg-white border border-[#e8eaed] rounded-2xl shadow-lg p-8">
        <h1 className="font-display text-3xl uppercase mb-3">Reset password</h1>
        {sent ? (
          <p className="font-mono text-sm text-foreground-600 mb-6">
            If an account exists for that email, we sent a password reset link.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="font-mono text-sm text-foreground-600">Enter your email and we will send a reset link.</p>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button fullWidth type="submit">Send reset link</Button>
          </form>
        )}
        <p className="font-mono text-xs text-center mt-6">
          <Link href="/login" className="hover:gradient-text">Back to sign in</Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
