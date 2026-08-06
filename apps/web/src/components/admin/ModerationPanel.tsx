'use client';

import { useState } from 'react';

type FlagItem = {
  id: string;
  category: string;
  confidence: number | null;
  status: string;
  target: { type: string; body: string } | null;
};

export function ModerationPanel({ initial }: { initial: { items: FlagItem[] } }) {
  const [items, setItems] = useState(initial.items);
  const [message, setMessage] = useState<string | null>(null);

  async function review(flagId: string, status: 'REVIEWED' | 'DISMISSED') {
    const response = await fetch(`/api/admin/ai/flags/${flagId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status, resolutionNote: `${status} in admin UI` }),
    });
    if (!response.ok) {
      setMessage('Could not update flag.');
      return;
    }
    setMessage('Flag updated.');
    const refreshed = await fetch('/api/admin/ai/flags');
    if (refreshed.ok) setItems((await refreshed.json()).items);
  }

  return (
    <div className="max-w-3xl space-y-4">
      <p className="font-mono text-xs text-foreground-600">
        AI moderation-assist flags are advisory only. They do not automatically remove content or suspend users.
      </p>
      {message ? <p className="font-mono text-sm text-foreground-600">{message}</p> : null}
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="surface-card p-5 space-y-2">
            <p className="font-mono text-xs uppercase text-foreground-500">
              {item.category} · {item.status}
              {item.confidence !== null ? ` · ${Math.round(item.confidence * 100)}%` : ''}
            </p>
            <p className="font-mono text-sm text-foreground-700">{item.target?.body}</p>
            {item.status === 'OPEN' ? (
              <div className="flex gap-2">
                <button type="button" onClick={() => review(item.id, 'REVIEWED')} className="btn-primary font-mono text-xs uppercase px-3 py-2">
                  Mark reviewed
                </button>
                <button type="button" onClick={() => review(item.id, 'DISMISSED')} className="font-mono text-xs uppercase px-3 py-2 border rounded-lg">
                  Dismiss
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
