'use client';

import { useRouter } from 'next/navigation';
import type { ProfileResponse } from '@notonlyhere/contracts';

export function ProfileActions({ profile }: { profile: ProfileResponse }) {
  const router = useRouter();

  async function sendRequest() {
    await fetch('/api/connections/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: profile.username }),
    });
    router.refresh();
  }

  async function acceptConnection() {
    if (!profile.viewer.connectionId) return;
    await fetch(`/api/connections/${profile.viewer.connectionId}/accept`, { method: 'POST' });
    router.refresh();
  }

  async function blockUser() {
    await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: profile.username }),
    });
    router.refresh();
  }

  if (profile.viewer.isSelf) {
    return (
      <a href="/app/profile/edit" className="btn-primary font-mono text-xs uppercase tracking-wider px-4 py-2">
        Edit profile
      </a>
    );
  }

  if (profile.viewer.isBlocked) return null;

  return (
    <div className="flex gap-2">
      {profile.viewer.connectionStatus === 'PENDING' && profile.viewer.connectionId ? (
        <button type="button" onClick={acceptConnection} className="btn-primary font-mono text-xs uppercase">
          Accept
        </button>
      ) : null}
      {profile.viewer.canConnect ? (
        <button type="button" onClick={sendRequest} className="btn-primary font-mono text-xs uppercase">
          Connect
        </button>
      ) : null}
      <button type="button" onClick={blockUser} className="font-mono text-xs uppercase text-foreground-600 border border-background-200 rounded-lg px-3 py-2">
        Block
      </button>
    </div>
  );
}
