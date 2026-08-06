'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AnonymousQuotaResponse,
  FeedMode,
  FeedResponse,
  PostItem,
  PostVisibility,
  ReactionKind,
} from '@notonlyhere/contracts';

export function FeedComposer({ onPosted }: { onPosted: () => void }) {
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [visibility, setVisibility] = useState<PostVisibility>('MEMBERS');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [quota, setQuota] = useState<AnonymousQuotaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch('/api/anonymous/quota')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => setQuota(payload))
      .catch(() => setQuota(null));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPosting(true);
    setError(null);
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body, visibility, isAnonymous, linkPreviewUrl: linkUrl || undefined }),
    });
    setPosting(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      if (payload.code === 'ANONYMOUS_QUOTA_EXCEEDED') {
        setQuota(payload.quota ?? quota);
        setError('Daily anonymous limit reached. Resets at midnight UTC.');
      } else {
        setError(payload.detail ?? payload.message ?? 'Could not publish post.');
      }
      return;
    }
    setBody('');
    setLinkUrl('');
    setIsAnonymous(false);
    const quotaResponse = await fetch('/api/anonymous/quota');
    if (quotaResponse.ok) setQuota(await quotaResponse.json());
    onPosted();
  }

  return (
    <form onSubmit={submit} className="surface-card p-6 space-y-4">
      <textarea
        className="w-full min-h-28 border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
        placeholder="Share something supportive…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={5000}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="font-mono text-xs uppercase tracking-widest text-foreground-500">
          Visibility
          <select
            className="ml-2 border border-background-200 rounded px-2 py-1 font-mono text-xs normal-case"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as PostVisibility)}
          >
            <option value="PUBLIC">Public</option>
            <option value="MEMBERS">Members</option>
            <option value="CONNECTIONS">Connections</option>
            <option value="ONLY_ME">Only me</option>
          </select>
        </label>
        <label className="font-mono text-xs text-foreground-600 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={quota?.remaining === 0}
          />
          Post anonymously
        </label>
      </div>
      {isAnonymous ? (
        <p className="font-mono text-xs text-foreground-600 bg-accent-500/10 border border-accent-500/20 rounded-lg p-3">
          You will appear under a one-time generated name. Admins can trace identity for safety; other members cannot
          see your profile or message you from this post.
        </p>
      ) : null}
      {quota ? (
        <p className="font-mono text-xs text-foreground-500">
          Anonymous quota today: {quota.remaining} of {quota.limit} remaining (resets {new Date(quota.resetsAt).toLocaleString()})
        </p>
      ) : null}
      <label className="font-mono text-xs uppercase tracking-widest text-foreground-500 block">
        Link (optional)
        <input
          className="mt-2 w-full border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
          placeholder="https://example.com"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />
      </label>
      <button type="submit" disabled={posting} className="btn-primary font-mono text-xs uppercase tracking-wider px-4 py-2">
        {posting ? 'Posting…' : 'Post'}
      </button>
      {error ? <p className="font-mono text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

function PostCard({ post, onChanged }: { post: PostItem; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(post.body);
  const [error, setError] = useState<string | null>(null);

  async function saveEdit() {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body, version: post.version }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.detail ?? 'Could not save edit.');
      return;
    }
    setEditing(false);
    onChanged();
  }

  async function deletePost() {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
    onChanged();
  }

  return (
    <article className="surface-card p-6 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-foreground-900">
            {post.author.isAnonymous ? post.author.displayLabel : post.author.displayName}
          </p>
          <p className="font-mono text-xs text-foreground-500">
            {post.author.isAnonymous ? (
              <>Anonymous · {new Date(post.createdAt).toLocaleString()}{post.isEdited ? ' · Edited' : ''}</>
            ) : (
              <>
                @{post.author.username} · {new Date(post.createdAt).toLocaleString()}
                {post.isEdited ? ' · Edited' : ''}
              </>
            )}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">
          {post.isAnonymous ? 'ANON' : post.visibility}
        </span>
      </div>
      {editing ? (
        <div className="space-y-2">
          <textarea
            className="w-full min-h-24 border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="button" onClick={saveEdit} className="btn-primary font-mono text-xs uppercase px-3 py-1">
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="font-mono text-xs uppercase text-foreground-600">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="font-mono text-sm text-foreground-800 whitespace-pre-wrap">{post.body}</p>
      )}
      {error ? <p className="font-mono text-sm text-red-600">{error}</p> : null}
      {post.viewer.isAuthor ? (
        <div className="flex gap-3">
          {post.viewer.canEdit ? (
            <button type="button" onClick={() => setEditing(true)} className="font-mono text-xs uppercase text-foreground-600">
              Edit
            </button>
          ) : null}
          {post.viewer.canDelete ? (
            <button type="button" onClick={deletePost} className="font-mono text-xs uppercase text-red-700">
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="flex gap-2 pt-2">
        {(['SUPPORT', 'HUG', 'INSIGHTFUL'] as ReactionKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={async () => {
              await fetch(`/api/posts/${post.id}/reactions/${kind}`, { method: 'PUT' });
              onChanged();
            }}
            className={`font-mono text-[10px] uppercase px-2 py-1 rounded border ${
              post.reactions?.viewerReaction === kind
                ? 'border-primary-500 text-primary-800 bg-primary-500/10'
                : 'border-background-200 text-foreground-500'
            }`}
          >
            {kind} {post.reactions?.counts?.[kind] ?? 0}
          </button>
        ))}
      </div>
      {post.linkPreview ? (
        <a
          href={post.linkPreview.canonicalUrl}
          className="block border border-background-200 rounded-lg p-3 font-mono text-xs text-foreground-600 hover:bg-background-100"
          target="_blank"
          rel="noreferrer"
        >
          <p className="font-semibold text-foreground-900">{post.linkPreview.title}</p>
          <p>{post.linkPreview.description}</p>
        </a>
      ) : null}
    </article>
  );
}

export function FeedPanel({ initialFeed }: { initialFeed: FeedResponse }) {
  const router = useRouter();
  const [mode, setMode] = useState<FeedMode>(initialFeed.mode);
  const [items, setItems] = useState<PostItem[]>(initialFeed.items);
  const [cursor, setCursor] = useState<string | null>(initialFeed.nextCursor);
  const [loadingMore, setLoadingMore] = useState(false);

  async function reloadFeed(nextMode = mode) {
    const response = await fetch(`/api/feed?mode=${nextMode}`);
    if (!response.ok) return;
    const feed: FeedResponse = await response.json();
    setItems(feed.items);
    setCursor(feed.nextCursor);
    router.refresh();
  }

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    const response = await fetch(`/api/feed?mode=${mode}&cursor=${encodeURIComponent(cursor)}`);
    setLoadingMore(false);
    if (!response.ok) return;
    const feed: FeedResponse = await response.json();
    setItems((current) => [...current, ...feed.items]);
    setCursor(feed.nextCursor);
  }

  async function changeMode(nextMode: FeedMode) {
    setMode(nextMode);
    await reloadFeed(nextMode);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <FeedComposer onPosted={() => reloadFeed()} />

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl uppercase">Feed</h2>
        <div className="flex gap-2">
          {(['RELEVANT', 'CHRONOLOGICAL'] as FeedMode[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => changeMode(value)}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${
                mode === value ? 'border-primary-500 text-primary-800 bg-primary-500/10' : 'border-background-200 text-foreground-500'
              }`}
            >
              {value === 'RELEVANT' ? 'Relevant' : 'Chronological'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="surface-card p-6 font-mono text-sm text-foreground-600">No posts yet. Share the first one.</div>
        ) : (
          items.map((post) => <PostCard key={post.id} post={post} onChanged={() => reloadFeed()} />)
        )}
      </div>

      {cursor ? (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full font-mono text-xs uppercase tracking-wider text-foreground-600 border border-background-200 rounded-lg py-3"
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      ) : null}
    </div>
  );
}
