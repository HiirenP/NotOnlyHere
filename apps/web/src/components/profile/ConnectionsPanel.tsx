'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ConnectionItem } from '@notonlyhere/contracts';

export function ConnectionsPanel({
  connections,
  currentUsername,
}: {
  connections: ConnectionItem[];
  currentUsername: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function sendRequest() {
    setError(null);
    const response = await fetch('/api/connections/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.detail ?? 'Could not send request.');
      return;
    }
    setUsername('');
    router.refresh();
  }

  async function acceptConnection(id: string) {
    await fetch(`/api/connections/${id}/accept`, { method: 'POST' });
    router.refresh();
  }

  async function removeConnection(id: string) {
    await fetch(`/api/connections/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <section className="surface-card p-6 space-y-3">
        <h2 className="font-display text-lg uppercase">Send request</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="button" onClick={sendRequest} className="btn-primary font-mono text-xs uppercase tracking-wider px-4">
            Connect
          </button>
        </div>
        {error ? <p className="font-mono text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="space-y-3">
        {connections.map((connection) => {
          const other =
            connection.requester.username === currentUsername ? connection.addressee : connection.requester;
          return (
            <div key={connection.id} className="surface-card p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-sm">@{other.username}</p>
                <p className="font-mono text-xs text-foreground-500">{other.displayName}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 mt-1">
                  {connection.status} · {connection.direction}
                </p>
              </div>
              <div className="flex gap-2">
                {connection.direction === 'incoming' && connection.status === 'PENDING' ? (
                  <button type="button" onClick={() => acceptConnection(connection.id)} className="btn-primary font-mono text-xs uppercase">
                    Accept
                  </button>
                ) : null}
                <button type="button" onClick={() => removeConnection(connection.id)} className="font-mono text-xs uppercase text-foreground-600">
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
