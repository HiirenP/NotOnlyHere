'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { CircleDetail, CircleDirectoryResponse, CircleMembersResponse } from '@notonlyhere/contracts';

export function CircleDirectoryPanel({ initial }: { initial: CircleDirectoryResponse }) {
  const router = useRouter();
  const [items, setItems] = useState(initial.items);
  const [query, setQuery] = useState(initial.query);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [loading, setLoading] = useState(false);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/circles?q=${encodeURIComponent(query)}`);
    setLoading(false);
    if (!response.ok) return;
    const payload: CircleDirectoryResponse = await response.json();
    setItems(payload.items);
    setCursor(payload.nextCursor);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={search} className="flex gap-2">
        <input
          className="flex-1 border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
          placeholder="Search circles"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary font-mono text-xs uppercase px-4 py-2">
          Search
        </button>
      </form>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="surface-card p-6 font-mono text-sm text-foreground-600">No circles found.</div>
        ) : (
          items.map((circle) => (
            <Link key={circle.id} href={`/app/circles/${circle.id}`} className="surface-card p-6 block hover:bg-background-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-mono text-sm text-foreground-900">{circle.name}</h3>
                  <p className="font-mono text-xs text-foreground-500 mt-1">{circle.description}</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">
                  {circle.visibility}
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 mt-3">
                {circle.memberCount} members · {circle.joinPolicy}
              </p>
            </Link>
          ))
        )}
      </div>
      {cursor ? (
        <button
          type="button"
          className="w-full font-mono text-xs uppercase border border-background-200 rounded-lg py-3"
          onClick={async () => {
            const response = await fetch(`/api/circles?cursor=${encodeURIComponent(cursor)}&q=${encodeURIComponent(query)}`);
            if (!response.ok) return;
            const payload: CircleDirectoryResponse = await response.json();
            setItems((current) => [...current, ...payload.items]);
            setCursor(payload.nextCursor);
            router.refresh();
          }}
        >
          Load more
        </button>
      ) : null}
    </div>
  );
}

export function CircleDetailPanel({
  circle,
  members,
}: {
  circle: CircleDetail;
  members: CircleMembersResponse | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function join() {
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/circles/${circle.id}/membership`, { method: 'POST' });
    setBusy(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.message ?? 'Could not join.');
      return;
    }
    router.refresh();
  }

  async function leave() {
    if (!confirm('Leave this circle?')) return;
    setBusy(true);
    const response = await fetch(`/api/circles/${circle.id}/membership`, { method: 'DELETE' });
    setBusy(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.message ?? 'Could not leave.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="surface-card p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl uppercase">{circle.name}</h2>
            <p className="font-mono text-xs text-foreground-500">@{circle.slug}</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">
            {circle.visibility} · {circle.joinPolicy}
          </span>
        </div>
        <p className="font-mono text-sm text-foreground-800">{circle.description}</p>
        {circle.guidelines ? (
          <div className="border border-background-200 rounded-lg p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 mb-2">Guidelines</p>
            <p className="font-mono text-sm text-foreground-700">{circle.guidelines}</p>
          </div>
        ) : null}
        <p className="font-mono text-xs text-foreground-500">{circle.memberCount} members</p>
        <div className="flex gap-3">
          {circle.viewer.canJoin ? (
            <button type="button" disabled={busy} onClick={join} className="btn-primary font-mono text-xs uppercase px-4 py-2">
              {circle.joinPolicy === 'APPROVAL' ? 'Request to join' : 'Join'}
            </button>
          ) : null}
          {circle.viewer.canLeave ? (
            <button type="button" disabled={busy} onClick={leave} className="font-mono text-xs uppercase text-red-700">
              Leave
            </button>
          ) : null}
          {circle.viewer.membershipStatus === 'PENDING' ? (
            <span className="font-mono text-xs text-foreground-600">Request pending</span>
          ) : null}
          {circle.viewer.isMember ? (
            <Link href={`/app/circles/${circle.id}/members`} className="font-mono text-xs uppercase text-foreground-600">
              View members
            </Link>
          ) : null}
        </div>
        {error ? <p className="font-mono text-sm text-red-600">{error}</p> : null}
      </div>
      {members ? (
        <div className="surface-card p-6 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-foreground-500">Members preview</h3>
          {members.items.map((member) => (
            <div key={member.userId} className="flex items-center justify-between font-mono text-sm">
              <span>{member.displayName}</span>
              <span className="text-[10px] uppercase text-foreground-500">{member.role}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CircleMemberListPanel({ members }: { members: CircleMembersResponse }) {
  return (
    <div className="surface-card p-6 space-y-3 max-w-2xl">
      <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-500">Members</h2>
      {members.items.map((member) => (
        <div key={member.userId} className="flex items-center justify-between border-b border-background-200 py-2 font-mono text-sm">
          <div>
            <p>{member.displayName}</p>
            <p className="text-xs text-foreground-500">@{member.username}</p>
          </div>
          <span className="text-[10px] uppercase text-foreground-500">{member.role}</span>
        </div>
      ))}
    </div>
  );
}
