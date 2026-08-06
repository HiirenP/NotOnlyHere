'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@notonlyhere/ui';
import { AuthPageShell } from '@/components/auth/AuthPageShell';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(token ? 'pending' : 'pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setStatus('success');
          setMessage('Your email is verified. You can sign in now.');
        } else {
          setStatus('error');
          setMessage(data.detail ?? data.message ?? 'This link is invalid or expired.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Verification failed. Please try again.');
      });
  }, [token]);

  async function resend() {
    if (!email) return;
    await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setMessage('If your account is unverified, we sent a new email.');
  }

  return (
    <div className="w-full max-w-md surface-card p-8 text-center animate-fade-up">
      <h1 className="font-display text-3xl uppercase mb-3">
        {status === 'success' ? 'Email verified' : 'Check your email'}
      </h1>
      {token ? (
        <p className="font-mono text-sm text-foreground-600 mb-6">{message}</p>
      ) : (
        <p className="font-mono text-sm text-foreground-600 mb-6">
          We sent a verification link{email ? ` to ${email}` : ''}. The link expires in 24 hours.
        </p>
      )}
      {status === 'success' ? (
        <Link href="/login" className="gradient-btn inline-block font-mono text-xs uppercase tracking-wider text-background-50 px-5 py-3">
          Sign in
        </Link>
      ) : (
        <Button variant="secondary" fullWidth onClick={resend} disabled={!email}>
          Resend email
        </Button>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={<div className="font-ui text-sm text-[#676a79]">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthPageShell>
  );
}
