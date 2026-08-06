'use client';

import { useState } from 'react';
import type { AccountResponse } from '@notonlyhere/contracts';
import { MemberShell } from '@/components/MemberShell';

type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  version: number;
};

export function AdminBlogPanel({
  account,
  initial,
}: {
  account: AccountResponse;
  initial: { items: AdminBlogPost[] };
}) {
  const [items, setItems] = useState(initial.items);
  const [message, setMessage] = useState<string | null>(null);

  async function createDraft() {
    const response = await fetch('/api/admin/blogs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'New draft',
        excerpt: 'Draft excerpt',
        bodyPlain: 'Draft body content.',
      }),
    });
    if (!response.ok) {
      setMessage('Could not create draft.');
      return;
    }
    const created = await response.json();
    setItems((prev) => [created, ...prev]);
    setMessage('Draft created.');
  }

  async function publish(id: string) {
    const response = await fetch(`/api/admin/blogs/${id}/publish`, { method: 'POST' });
    if (!response.ok) {
      setMessage('Could not publish.');
      return;
    }
    const updated = await response.json();
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setMessage('Published.');
  }

  return (
    <div className="max-w-3xl space-y-6">
      <button type="button" onClick={createDraft} className="btn-primary font-mono text-xs uppercase px-4 py-2">
        New draft
      </button>
      {message ? <p className="font-mono text-xs text-foreground-500">{message}</p> : null}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="surface-card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg uppercase">{item.title}</p>
              <p className="font-mono text-xs text-foreground-500">
                {item.status} · {item.slug}
              </p>
            </div>
            {item.status !== 'PUBLISHED' ? (
              <button type="button" onClick={() => publish(item.id)} className="btn-secondary font-mono text-xs uppercase px-3 py-2">
                Publish
              </button>
            ) : (
              <a href={`/blog/${item.slug}`} className="font-mono text-xs uppercase underline">
                View
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminBlogShell({
  account,
  initial,
}: {
  account: AccountResponse;
  initial: { items: AdminBlogPost[] };
}) {
  return (
    <MemberShell account={account} title="Blog admin">
      <AdminBlogPanel account={account} initial={initial} />
    </MemberShell>
  );
}
