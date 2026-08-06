'use client';

import { useState } from 'react';
import type { ResourceSummary } from '@notonlyhere/contracts';

export function ResourcesPanel({ initial }: { initial: { items: ResourceSummary[] } }) {
  const [items, setItems] = useState(initial.items);
  const [selected, setSelected] = useState<ResourceSummary | null>(null);
  const [detail, setDetail] = useState<{ bodyPlain: string | null } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function openResource(item: ResourceSummary) {
    setSelected(item);
    const response = await fetch(`/api/resources/by-slug/${item.slug}`);
    if (!response.ok) {
      setDetail(null);
      setMessage(item.viewer.canAccess ? 'Could not load resource.' : 'Purchase required for this resource.');
      return;
    }
    setDetail(await response.json());
    setMessage(null);
  }

  async function markComplete() {
    if (!selected) return;
    const response = await fetch(`/api/resources/${selected.id}/progress`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ progressPercent: 100 }),
    });
    if (!response.ok) {
      setMessage('Could not save progress.');
      return;
    }
    setMessage('Progress saved.');
    const list = await fetch('/api/resources');
    if (list.ok) setItems((await list.json()).items);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="surface-card p-5 space-y-2">
            <button type="button" onClick={() => openResource(item)} className="text-left w-full">
              <h2 className="font-display text-xl uppercase">{item.title}</h2>
              <p className="font-mono text-xs text-foreground-500 uppercase">{item.kind} · {item.access}</p>
              <p className="font-mono text-sm text-foreground-700">{item.summary}</p>
            </button>
            <p className="font-mono text-xs text-foreground-500">
              Progress: {item.viewer.progressPercent}%
              {!item.viewer.canAccess ? ' · locked' : ''}
            </p>
          </li>
        ))}
      </ul>
      {selected && detail?.bodyPlain ? (
        <div className="surface-card p-5 space-y-3">
          <p className="font-mono text-sm text-foreground-700 whitespace-pre-wrap">{detail.bodyPlain}</p>
          <button type="button" onClick={markComplete} className="btn-primary font-mono text-xs uppercase px-4 py-2">
            Mark complete
          </button>
        </div>
      ) : null}
      {message ? <p className="font-mono text-sm text-foreground-600">{message}</p> : null}
    </div>
  );
}
