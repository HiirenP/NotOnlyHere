'use client';

import { useEffect, useState } from 'react';
import type { NotificationsResponse } from '@notonlyhere/contracts';

export function NotificationsPanel({ initial }: { initial: NotificationsResponse }) {
  const [data, setData] = useState(initial);

  async function refresh() {
    const response = await fetch('/api/notifications');
    if (response.ok) setData(await response.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function markAllRead() {
    await fetch('/api/notifications/read-all', { method: 'POST' });
    await refresh();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-foreground-500">{data.unreadCount} unread</p>
        <button type="button" onClick={markAllRead} className="font-mono text-xs uppercase text-foreground-600">
          Mark all read
        </button>
      </div>
      {data.items.length === 0 ? (
        <div className="surface-card p-6 font-mono text-sm text-foreground-600">No notifications yet.</div>
      ) : (
        data.items.map((item) => (
          <article key={item.id} className="surface-card p-4 space-y-1">
            <p className="font-mono text-sm text-foreground-900">{item.titleKey}</p>
            <p className="font-mono text-xs text-foreground-600">{item.bodyKey}</p>
            <p className="font-mono text-[10px] text-foreground-500">
              {item.eventType} · {new Date(item.createdAt).toLocaleString()}
              {item.readAt ? '' : ' · Unread'}
            </p>
          </article>
        ))
      )}
    </div>
  );
}
