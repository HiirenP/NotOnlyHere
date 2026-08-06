'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProfileResponse } from '@notonlyhere/contracts';

export function ProfileEditForm({ profile }: { profile: ProfileResponse }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ displayName, bio, version: profile.version }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.detail ?? 'Could not save profile.');
      return;
    }
    router.push(`/app/profile/${profile.username}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="surface-card p-6 space-y-4 max-w-2xl mx-auto">
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-foreground-500">Display name</label>
        <input
          className="mt-2 w-full border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-foreground-500">Bio</label>
        <textarea
          className="mt-2 w-full border border-background-200 rounded-lg px-3 py-2 font-mono text-sm min-h-28"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
        />
      </div>
      {error ? <p className="font-mono text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={saving} className="btn-primary font-mono text-xs uppercase tracking-wider">
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}
