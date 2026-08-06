'use client';

import { Image, MapPin, Smile, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type {
  AccountResponse,
  CircleDirectoryResponse,
  CommentItem,
  ConnectionItem,
  FeedResponse,
  PostItem,
  ProfileResponse,
  SearchResponse,
} from '@notonlyhere/contracts';
import { commentToPreview, circleSummaryToGroup, postItemToFeedPost } from '@/design/api/mappers';
import { postComment, sendConnectionRequest, togglePostReaction } from '@/design/api/post-actions';
import { ColorIcon, PageHeader, TAvatar, TBtn, TCard, TSearch, TTabs } from '@/design/components/template';
import { CircleMomentsRail, CreatePostCard, GroupCard, PostCard } from '@/design/components/social';
import { images } from '@/design/data/mock';
import { MemberShell } from '@/design/layouts/Shells';
import type { FeedPost } from '@/design/data/mock';
import type { CircleGroup } from '@/design/data/mock';
import { DesignLink } from '@/design/navigation';

export function FeedScreen({ account }: { account: AccountResponse }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerAvatar, setViewerAvatar] = useState<string | undefined>();

  const loadFeed = useCallback(async () => {
    const response = await fetch('/api/feed?mode=CHRONOLOGICAL');
    if (!response.ok) {
      setLoading(false);
      return;
    }
    const data: FeedResponse = await response.json();
    setPosts(data.items.map((item) => postItemToFeedPost(item)));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFeed();
    fetch('/api/profile/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((p: ProfileResponse | null) => {
        if (p?.avatar?.url) setViewerAvatar(p.avatar.url);
      });
  }, [loadFeed]);

  async function handleReact(postId: string, liked: boolean) {
    const res = await togglePostReaction(postId, liked);
    if (!res.ok) throw new Error('reaction failed');
  }

  async function handleComment(postId: string, body: string) {
    const res = await postComment(postId, body);
    if (!res.ok) throw new Error('comment failed');
    await loadFeed();
  }

  return (
    <MemberShell account={account} showRightRail>
      <CircleMomentsRail />
      <CreatePostCard displayName={account.displayName} avatarUrl={viewerAvatar} />
      {loading ? (
        <TCard className="text-sm text-[#676a79]">Loading feed…</TCard>
      ) : posts.length === 0 ? (
        <TCard className="text-sm text-[#676a79]">No posts yet. Be the first to share something supportive.</TCard>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            viewerAvatar={viewerAvatar}
            viewerName={account.displayName}
            onReact={handleReact}
            onComment={handleComment}
          />
        ))
      )}
      {!loading && posts.length > 0 ? (
        <button
          type="button"
          onClick={loadFeed}
          className="w-full py-3 text-sm font-semibold text-[#676a79] hover:bg-white rounded-2xl border border-[#e8eaed] transition-colors"
        >
          Refresh feed
        </button>
      ) : null}
    </MemberShell>
  );
}

export function ComposerScreen({ account }: { account: AccountResponse }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const circleId = searchParams.get('circleId');
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [publishing, setPublishing] = useState(false);

  async function publish() {
    if (!body.trim()) return;
    setPublishing(true);
    const payload: Record<string, unknown> = { body, visibility: 'MEMBERS', isAnonymous };
    if (circleId) payload.circleId = circleId;
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setPublishing(false);
    if (response.ok) router.push(circleId ? `/app/circles/${circleId}` : '/app/feed');
  }

  return (
    <MemberShell account={account}>
      <PageHeader title="Create post" subtitle="Share with your community" />
      <TCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
          <TAvatar name={account.displayName} />
          <div>
            <p className="text-sm font-bold text-[#14191e]">{account.displayName}</p>
            <button type="button" className="text-xs font-semibold text-[#0f6fec] bg-[#0f6fec]/10 px-2 py-0.5 rounded-md mt-0.5">
              {circleId ? 'Circle post' : 'Members'} ▾
            </button>
          </div>
        </div>
        <textarea
          className="w-full min-h-48 text-base p-4 focus:outline-none resize-none placeholder:text-[#a1a5b3]"
          placeholder="Share what feels comfortable..."
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="px-4 py-3 border-t border-[#e8eaed] flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#676a79] font-semibold mr-1">Add:</span>
          {[
            { icon: Image, label: 'Photo', color: 'green' as const },
            { icon: Smile, label: 'Mood', color: 'yellow' as const },
            { icon: Users, label: 'Circle', color: 'teal' as const },
            { icon: MapPin, label: 'Event', color: 'red' as const },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#676a79] hover:bg-[#f5f6f8] px-2 py-1.5 rounded-lg transition-colors"
            >
              <ColorIcon icon={item.icon} color={item.color} size="sm" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="px-4 py-4 bg-[#f5f6f8] border-t border-[#e8eaed] flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button type="button" className="text-xs font-semibold px-3 py-1.5 border border-[#e8eaed] rounded-lg bg-white">
              Post as: {account.displayName.split(' ')[0]}
            </button>
            <button
              type="button"
              onClick={() => setIsAnonymous((v) => !v)}
              className={`text-xs font-semibold px-3 py-1.5 border rounded-lg ${
                isAnonymous
                  ? 'border-[#6610f2]/30 bg-[#6610f2]/5 text-[#6610f2]'
                  : 'border-[#e8eaed] bg-white text-[#676a79]'
              }`}
            >
              Anonymous
            </button>
          </div>
          <TBtn onClick={publish} disabled={publishing || !body.trim()}>
            {publishing ? 'Publishing…' : 'Publish post'}
          </TBtn>
        </div>
      </TCard>
    </MemberShell>
  );
}

export function SearchScreen({ account }: { account: AccountResponse }) {
  const [tab, setTab] = useState('posts');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [apiCircles, setApiCircles] = useState<CircleGroup[]>([]);
  const [people, setPeople] = useState<{ name: string; username: string; avatar: string }[]>([]);

  async function reloadPosts() {
    const q = query.trim();
    const url = q ? `/api/feed/search?q=${encodeURIComponent(q)}` : '/api/feed?mode=CHRONOLOGICAL';
    const response = await fetch(url);
    if (!response.ok) return;
    const data: SearchResponse | FeedResponse = await response.json();
    if (data?.items) setPosts(data.items.map((item) => postItemToFeedPost(item)));
  }

  async function handleReact(postId: string, liked: boolean) {
    const res = await togglePostReaction(postId, liked);
    if (res.ok) await reloadPosts();
  }

  async function handleComment(postId: string, body: string) {
    const res = await postComment(postId, body);
    if (res.ok) await reloadPosts();
  }

  useEffect(() => {
    const q = query.trim();
    if (tab === 'posts') {
      const url = q ? `/api/feed/search?q=${encodeURIComponent(q)}` : '/api/feed?mode=CHRONOLOGICAL';
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: SearchResponse | FeedResponse | null) => {
          if (data?.items) setPosts(data.items.map((item) => postItemToFeedPost(item)));
        });
    }
    if (tab === 'circles' || tab === 'posts') {
      const url = q ? `/api/circles?q=${encodeURIComponent(q)}` : '/api/circles';
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: CircleDirectoryResponse | null) => {
          if (data?.items) setApiCircles(data.items.map(circleSummaryToGroup));
        });
    }
    if (tab === 'members') {
      fetch('/api/connections')
        .then((r) => (r.ok ? r.json() : []))
        .then(async (connections: ConnectionItem[]) => {
          const list = connections
            .filter((c) => c.status === 'ACCEPTED' || c.status === 'PENDING')
            .map((c) => {
              const other = c.requester.id === account.id ? c.addressee : c.requester;
              return {
                name: other.displayName,
                username: other.username,
                avatar: other.avatar?.url ?? images.avatar2,
              };
            })
            .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.username.toLowerCase().includes(q.toLowerCase()));
          if (q && /^[a-z0-9_]+$/i.test(q)) {
            const profileRes = await fetch(`/api/profiles/${encodeURIComponent(q)}`);
            if (profileRes.ok) {
              const profile: ProfileResponse = await profileRes.json();
              if (!list.some((p) => p.username === profile.username)) {
                list.unshift({
                  name: profile.displayName,
                  username: profile.username,
                  avatar: profile.avatar?.url ?? images.avatar2,
                });
              }
            }
          }
          setPeople(list);
        });
    }
  }, [tab, query, account.id]);

  return (
    <MemberShell account={account} fullWidth>
      <PageHeader title="Search" subtitle="Find posts, people, and circles" />
      <TSearch
        placeholder="Search posts, members, circles..."
        className="mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <TTabs
        tabs={[
          { id: 'posts', label: 'Posts' },
          { id: 'members', label: 'People' },
          { id: 'circles', label: 'Circles' },
        ]}
        active={tab}
        onChange={setTab}
        className="mb-4"
      />
      {tab === 'posts' && (
        <div className="space-y-4">
          {posts.length ? posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showCommentInput={false}
              onReact={handleReact}
              onComment={handleComment}
            />
          )) : (
            <TCard className="text-sm text-[#676a79]">No posts found.</TCard>
          )}
        </div>
      )}
      {tab === 'members' && (
        <TCard>
          <div className="space-y-3">
            {people.map((m) => (
              <div key={m.username} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f6f8]">
                <TAvatar src={m.avatar} name={m.name} />
                <div className="flex-1">
                  <DesignLink href={`/app/profile/${m.username}`} className="text-sm font-semibold text-[#14191e] hover:text-[#0f6fec]">
                    {m.name}
                  </DesignLink>
                  <p className="text-xs text-[#676a79]">@{m.username}</p>
                </div>
                <TBtn
                  size="sm"
                  variant="soft"
                  onClick={() => sendConnectionRequest(m.username)}
                >
                  Connect
                </TBtn>
              </div>
            ))}
            {!people.length && <p className="text-sm text-[#676a79]">No people found.</p>}
          </div>
        </TCard>
      )}
      {tab === 'circles' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiCircles.map((circle) => (
            <GroupCard key={circle.id} circle={circle} />
          ))}
        </div>
      )}
    </MemberShell>
  );
}

export function PostDetailScreen({ account, postId }: { account: AccountResponse; postId: string }) {
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [viewerAvatar, setViewerAvatar] = useState<string | undefined>();

  async function load() {
    const [postRes, commentsRes, profileRes] = await Promise.all([
      fetch(`/api/posts/${encodeURIComponent(postId)}`),
      fetch(`/api/posts/${encodeURIComponent(postId)}/comments`),
      fetch('/api/profile/me'),
    ]);
    if (postRes.ok) {
      const item: PostItem = await postRes.json();
      const commentList: CommentItem[] = commentsRes.ok ? await commentsRes.json() : [];
      setComments(commentList);
      setPost(postItemToFeedPost(item, undefined, commentList.length));
    }
    if (profileRes.ok) {
      const p: ProfileResponse = await profileRes.json();
      if (p.avatar?.url) setViewerAvatar(p.avatar.url);
    }
  }

  useEffect(() => {
    load();
  }, [postId]);

  async function submitComment() {
    if (!commentBody.trim()) return;
    const res = await postComment(postId, commentBody.trim());
    if (res.ok) {
      setCommentBody('');
      await load();
    }
  }

  if (!post) {
    return (
      <MemberShell account={account}>
        <TCard className="text-sm text-[#676a79]">Loading post…</TCard>
      </MemberShell>
    );
  }

  return (
    <MemberShell account={account}>
      <PostCard
        post={post}
        showCommentInput={false}
        viewerAvatar={viewerAvatar}
        onReact={async (id, liked) => {
          await togglePostReaction(id, liked);
          await load();
        }}
      />
      <TCard>
        <h2 className="text-sm font-bold text-[#14191e] mb-4">Comments ({comments.length})</h2>
        <div className="space-y-4 mb-4">
          {comments.length ? comments.map((c) => {
            const preview = commentToPreview(c);
            return (
              <div key={c.id} className="flex gap-3">
                <TAvatar name={preview.author} size="sm" />
                <div className="flex-1 bg-[#f5f6f8] rounded-2xl px-4 py-3">
                  <p className="text-xs font-bold text-[#14191e]">{preview.author}</p>
                  <p className="text-sm text-[#676a79] mt-1">{preview.text}</p>
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-[#676a79]">Be the first to comment on this post.</p>
          )}
        </div>
        <div className="flex gap-3 pt-3 border-t border-[#e8eaed]">
          <TAvatar name={account.displayName} size="sm" src={viewerAvatar} />
          <div className="flex-1 flex gap-2">
            <input
              className="flex-1 text-sm bg-[#f5f6f8] rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10"
              placeholder="Write a comment..."
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
            />
            <TBtn size="sm" onClick={submitComment}>Post</TBtn>
          </div>
        </div>
      </TCard>
    </MemberShell>
  );
}
