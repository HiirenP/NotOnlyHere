'use client';

import { Settings, UserPlus, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DesignLink } from '@/design/navigation';
import type {
  AccountResponse,
  CircleDetail,
  CircleDirectoryResponse,
  CircleMembersResponse,
  ConnectionItem,
  FeedResponse,
  NotificationsResponse,
  PostItem,
  ProfileResponse,
} from '@notonlyhere/contracts';
import {
  circleSummaryToGroup,
  conversationToListItem,
  notificationToListItem,
  postItemToFeedPost,
  profileToCurrentUser,
} from '@/design/api/mappers';
import { joinCircle, leaveCircle, sendConnectionRequest } from '@/design/api/post-actions';
import { PageHeader, TAvatar, TBadge, TBtn, TCard, TListItem, TSearch, TTabs } from '@/design/components/template';
import { GroupCard, PostCard } from '@/design/components/social';
import { circles as mockCircles, images } from '@/design/data/mock';
import type { CircleGroup, FeedPost } from '@/design/data/mock';
import { MemberShell } from '@/design/layouts/Shells';

export function CirclesScreen({ account }: { account: AccountResponse }) {
  const [tab, setTab] = useState('joined');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<CircleGroup[]>([]);

  useEffect(() => {
    const url = query.trim() ? `/api/circles?q=${encodeURIComponent(query.trim())}` : '/api/circles';
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CircleDirectoryResponse | null) => {
        if (data?.items) setItems(data.items.map(circleSummaryToGroup));
      });
  }, [query]);

  const joined = items.filter((c) => c.joined);
  const discover = items.filter((c) => !c.joined);

  return (
    <MemberShell account={account} fullWidth>
      <PageHeader title="Circles" subtitle="Discover and join peer-support communities" action={<TBtn>Create circle</TBtn>} />
      <TSearch placeholder="Search circles..." className="mb-4" value={query} onChange={(e) => setQuery(e.target.value)} />
      <TTabs className="mb-4" tabs={[{ id: 'joined', label: `Your circles (${joined.length})` }, { id: 'discover', label: 'Discover' }]} active={tab} onChange={setTab} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(tab === 'joined' ? joined : discover).map((circle) => (
          <GroupCard key={circle.id} circle={circle} />
        ))}
      </div>
    </MemberShell>
  );
}

export function CircleDetailScreen({ account, circleId }: { account: AccountResponse; circleId?: string }) {
  const [circle, setCircle] = useState<CircleGroup | null>(null);
  const [circleDetail, setCircleDetail] = useState<CircleDetail | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [members, setMembers] = useState<CircleMembersResponse['items']>([]);
  const [tab, setTab] = useState('discussion');
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(true);

  const id = circleId ?? mockCircles[0].id;

  const load = useCallback(async () => {
    setLoading(true);
    const [circleRes, feedRes, membersRes] = await Promise.all([
      fetch(`/api/circles/${encodeURIComponent(id)}`),
      fetch(`/api/circles/${encodeURIComponent(id)}/feed`),
      fetch(`/api/circles/${encodeURIComponent(id)}/members`),
    ]);
    let circleName = 'Circle';
    if (circleRes.ok) {
      const data: CircleDetail = await circleRes.json();
      setCircleDetail(data);
      setCircle(circleSummaryToGroup(data));
      circleName = data.name;
    }
    if (feedRes.ok) {
      const feed: FeedResponse = await feedRes.json();
      setPosts(feed.items.map((item) => postItemToFeedPost(item, circleName)));
    }
    if (membersRes.ok) {
      const data: CircleMembersResponse = await membersRes.json();
      setMembers(data.items);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleMembership() {
    setJoining(true);
    if (circleDetail?.viewer.isMember) {
      await leaveCircle(id);
    } else {
      await joinCircle(id);
    }
    setJoining(false);
    await load();
  }

  const isMember = circleDetail?.viewer.isMember ?? circle?.joined ?? false;

  if (loading || !circle) {
    return (
      <MemberShell account={account} fullWidth>
        <TCard className="text-sm text-[#676a79]">Loading circle…</TCard>
      </MemberShell>
    );
  }

  return (
    <MemberShell account={account} fullWidth>
      <TCard className="p-0 overflow-hidden mb-4">
        <div className="relative h-48 md:h-56">
          <img src={circle.cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-14 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img src={circle.thumb} alt="" className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#14191e]">{circle.name}</h1>
              <p className="text-sm text-[#676a79] mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><Users size={14} /> {circle.members.toLocaleString()} members</span>
                <TBadge>{circle.access}</TBadge>
              </p>
            </div>
            <div className="flex gap-2">
              <TBtn variant="outline" size="sm"><UserPlus size={14} className="inline mr-1" />Invite</TBtn>
              <TBtn size="sm" onClick={toggleMembership} disabled={joining}>
                {isMember ? 'Leave circle' : circle.access === 'Request' ? 'Request to join' : 'Join circle'}
              </TBtn>
            </div>
          </div>
          <p className="text-sm text-[#676a79] mt-4">{circle.description}</p>
        </div>
      </TCard>

      <TCard className="p-0 overflow-hidden">
        <TTabs tabs={[{ id: 'discussion', label: 'Discussion' }, { id: 'about', label: 'About' }, { id: 'members', label: 'Members' }, { id: 'events', label: 'Events' }]} active={tab} onChange={setTab} />
        <div className="p-4">
          {tab === 'discussion' && (
            <>
              <div className="flex items-center gap-3 p-3 bg-[#f5f6f8] rounded-xl mb-4">
                <TAvatar name={account.displayName} />
                <DesignLink href={`/app/composer?circleId=${id}`} className="flex-1 text-sm text-[#a1a5b3]">Share with {circle.name}...</DesignLink>
              </div>
              {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} showCommentInput={false} />) : (
                <p className="text-sm text-[#676a79]">No posts in this circle yet.</p>
              )}
            </>
          )}
          {tab === 'about' && <p className="text-sm text-[#676a79]">{circle.description}</p>}
          {tab === 'members' && (
            <div className="grid sm:grid-cols-2 gap-2">
              {members.map((member) => (
                <DesignLink key={member.userId} href={`/app/profile/${member.username}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f6f8]">
                  <TAvatar name={member.displayName} />
                  <div>
                    <p className="text-sm font-semibold text-[#14191e]">{member.displayName}</p>
                    <p className="text-xs text-[#0f6fec] font-semibold">{member.role === 'ADMIN' ? 'Circle Admin' : 'Member'}</p>
                  </div>
                </DesignLink>
              ))}
            </div>
          )}
          {tab === 'events' && <p className="text-sm text-[#676a79]">No upcoming events. <DesignLink href="/app/events" className="text-[#0f6fec] font-semibold">Browse events</DesignLink></p>}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function ProfileScreen({ account, username }: { account: AccountResponse; username: string }) {
  const router = useRouter();
  const [tab, setTab] = useState('posts');
  const [profile, setProfile] = useState(profileToCurrentUser({
    userId: account.id,
    username: account.username,
    displayName: account.displayName,
    bio: '',
    joinDate: new Date().toISOString(),
    avatar: null,
    cover: null,
    connectionCount: 0,
    version: 1,
    viewer: { isSelf: true, connectionStatus: null, connectionId: null, isBlocked: false, isBlockedBy: false, canConnect: false, canMessage: false },
  }));
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [circleCount, setCircleCount] = useState(0);

  useEffect(() => {
    const profileUrl = username === account.username ? '/api/profile/me' : `/api/profiles/${encodeURIComponent(username)}`;
    const postsUrl = `/api/profiles/${encodeURIComponent(username)}/posts`;
    Promise.all([
      fetch(profileUrl).then((r) => (r.ok ? r.json() : null)),
      fetch(postsUrl).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/connections').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/circles').then((r) => (r.ok ? r.json() : null)),
    ]).then(([profileData, postsData, connData, circlesData]: [
      ProfileResponse | null,
      { items: PostItem[] } | null,
      ConnectionItem[],
      CircleDirectoryResponse | null,
    ]) => {
      if (profileData) {
        const userPosts = postsData?.items ?? [];
        const joined = circlesData?.items.filter((c) => c.viewer.isMember).length ?? 0;
        setCircleCount(joined);
        setProfile(profileToCurrentUser(profileData, userPosts.length, joined));
        setPosts(userPosts.map((item) => postItemToFeedPost(item)));
      }
      setConnections(Array.isArray(connData) ? connData : []);
    });
  }, [username, account.username, account.id]);

  async function handleConnect() {
    await sendConnectionRequest(username);
    router.refresh();
  }

  async function handleMessage() {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: profile.userId }),
    });
    if (res.ok) {
      const conv = await res.json();
      router.push(`/app/messages?conversation=${conv.id}`);
    }
  }

  return (
    <MemberShell account={account} fullWidth>
      <TCard className="p-0 mb-4" padding={false}>
        <div className="relative h-48 md:h-56">
          <img src={profile.cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          <img src={profile.avatar} alt="" className="absolute left-6 -bottom-14 w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover object-[center_20%] z-10 bg-white" />
        </div>
        <div className="px-6 pb-8 pt-20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#14191e]">{profile.displayName}</h1>
              <p className="text-sm text-[#676a79] mt-1">@{profile.username} · Joined {profile.joinedAt}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {profile.isSelf ? (
                <>
                  <DesignLink href="/app/settings"><TBtn variant="outline" size="sm">Edit profile</TBtn></DesignLink>
                  <DesignLink href="/app/settings"><TBtn variant="outline" size="sm"><Settings size={14} /></TBtn></DesignLink>
                </>
              ) : (
                <>
                  {profile.canConnect && (
                    <TBtn variant="soft" size="sm" onClick={handleConnect}>Connect</TBtn>
                  )}
                  {profile.canMessage && (
                    <TBtn size="sm" onClick={handleMessage}>Message</TBtn>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-sm text-[#676a79] mt-4 leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
            <span><strong className="text-[#14191e]">{profile.posts}</strong> <span className="text-[#676a79]">posts</span></span>
            <span><strong className="text-[#14191e]">{profile.connections}</strong> <span className="text-[#676a79]">connections</span></span>
            <span><strong className="text-[#14191e]">{profile.circles}</strong> <span className="text-[#676a79]">circles</span></span>
          </div>
        </div>
      </TCard>
      <TCard className="p-0 overflow-hidden">
        <TTabs className="px-2" tabs={[{ id: 'posts', label: 'Posts' }, { id: 'about', label: 'About' }, { id: 'connections', label: 'Connections' }]} active={tab} onChange={setTab} />
        <div className="p-4 pt-0">
          {tab === 'posts' && (posts.length ? posts.map((p) => <PostCard key={p.id} post={p} showCommentInput={false} />) : <p className="text-sm text-[#676a79] p-2">No posts yet.</p>)}
          {tab === 'about' && <p className="text-sm text-[#676a79] p-2">{profile.bio}</p>}
          {tab === 'connections' && (
            <div className="p-2 space-y-3">
              {connections.filter((c) => c.status === 'ACCEPTED').map((c) => {
                const other = c.requester.id === account.id ? c.addressee : c.requester;
                return (
                  <DesignLink key={c.id} href={`/app/profile/${other.username}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f6f8]">
                    <TAvatar name={other.displayName} src={other.avatar?.url} />
                    <span className="text-sm font-semibold text-[#14191e]">{other.displayName}</span>
                  </DesignLink>
                );
              })}
              {!connections.filter((c) => c.status === 'ACCEPTED').length && (
                <p className="text-sm text-[#676a79]">No connections yet.</p>
              )}
            </div>
          )}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function MessagesScreen({ account }: { account: AccountResponse }) {
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('conversation');
  const [conversations, setConversations] = useState<ReturnType<typeof conversationToListItem>[]>([]);
  const [selected, setSelected] = useState<string | null>(conversationParam);
  const [messages, setMessages] = useState<{ body: string; mine: boolean; id: string }[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileShowThread, setMobileShowThread] = useState(Boolean(conversationParam));

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data.map(conversationToListItem) : [];
        setConversations(list);
        if (conversationParam && list.some((c) => c.id === conversationParam)) {
          setSelected(conversationParam);
          setMobileShowThread(true);
        } else if (list[0] && !selected) {
          setSelected(list[0].id);
        }
      });
  }, [conversationParam, selected]);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/conversations/${encodeURIComponent(selected)}/messages`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.items) {
          setMessages(
            data.items.map((m: { id: string; body: string | null; senderUserId: string | null }) => ({
              id: m.id,
              body: m.body ?? '',
              mine: m.senderUserId === account.id,
            })),
          );
        }
      });
  }, [selected, account.id]);

  async function sendMessage() {
    if (!selected || !draft.trim() || sending) return;
    setSending(true);
    const res = await fetch(`/api/conversations/${encodeURIComponent(selected)}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body: draft.trim(), clientMessageId: crypto.randomUUID() }),
    });
    setSending(false);
    if (res.ok) {
      setDraft('');
      const data = await fetch(`/api/conversations/${encodeURIComponent(selected)}/messages`).then((r) => r.json());
      if (data?.items) {
        setMessages(
          data.items.map((m: { id: string; body: string | null; senderUserId: string | null }) => ({
            id: m.id,
            body: m.body ?? '',
            mine: m.senderUserId === account.id,
          })),
        );
      }
    }
  }

  const active = conversations.find((c) => c.id === selected);

  function selectConversation(id: string) {
    setSelected(id);
    setMobileShowThread(true);
  }

  const threadPanel = active ? (
    <>
      <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
        <button
          type="button"
          className="sm:hidden text-sm font-semibold text-[#0f6fec] shrink-0"
          onClick={() => setMobileShowThread(false)}
        >
          ← Back
        </button>
        <TAvatar src={active.avatar} name={active.name} online={active.online} />
        <div>
          <p className="text-sm font-bold text-[#14191e]">{active.name}</p>
          <p className="text-xs text-[#676a79]">Private conversation</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f6f8]/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${msg.mine ? 'bg-[#0f6fec] text-white rounded-br-md' : 'bg-white border border-[#e8eaed] rounded-bl-md'}`}>
              {msg.body}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#e8eaed] flex gap-2">
        <input
          className="flex-1 text-sm bg-[#f5f6f8] rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10"
          placeholder="Type a message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <TBtn onClick={sendMessage} disabled={sending || !draft.trim()}>Send</TBtn>
      </div>
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center text-sm text-[#676a79] p-6">Select a conversation</div>
  );

  return (
    <MemberShell account={account} fullWidth>
      <PageHeader title="Messages" subtitle="Private conversations with your connections" />
      <TCard className="p-0 overflow-hidden flex flex-col sm:flex-row h-[calc(100vh-220px)] min-h-[500px]">
        <div className={`w-full sm:w-80 border-r border-[#e8eaed] flex flex-col ${mobileShowThread ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#e8eaed]">
            <TSearch placeholder="Search messages" />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.map((c) => (
              <TListItem
                key={c.id}
                avatar={<TAvatar src={c.avatar} name={c.name} online={c.online} />}
                title={c.name}
                subtitle={c.preview}
                meta={c.time}
                unread={c.unread}
                onClick={() => selectConversation(c.id)}
              />
            ))}
          </div>
        </div>
        <div className={`flex-1 flex flex-col ${mobileShowThread ? 'flex' : 'hidden sm:flex'}`}>
          {threadPanel}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function NotificationsScreen({ account }: { account: AccountResponse }) {
  const router = useRouter();
  const [items, setItems] = useState<ReturnType<typeof notificationToListItem>[]>([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: NotificationsResponse | null) => {
        if (data?.items) setItems(data.items.map(notificationToListItem));
      });
  }, []);

  async function markAllRead() {
    await fetch('/api/notifications/read-all', { method: 'POST' });
    setItems((current) => current.map((n) => ({ ...n, unread: false })));
  }

  async function handleClick(n: ReturnType<typeof notificationToListItem>) {
    await markRead(n.id);
    if (n.postId) router.push(`/app/post/${n.postId}`);
    else if (n.circleId) router.push(`/app/circles/${n.circleId}`);
    else if (n.conversationId) router.push(`/app/messages?conversation=${n.conversationId}`);
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
    setItems((current) => current.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <MemberShell account={account}>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on community activity"
        action={<TBtn variant="soft" size="sm" onClick={markAllRead}>Mark all read</TBtn>}
      />
      <TCard className="p-0 overflow-hidden divide-y divide-[#e8eaed]">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-[#676a79]">No notifications yet.</p>
        ) : (
          items.map((n) => (
            <TListItem
              key={n.id}
              avatar={n.avatar ? <img src={n.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-[#f5f6f8] flex items-center justify-center">🔔</div>}
              title={n.text}
              subtitle={undefined}
              meta={n.time}
              unread={n.unread}
              onClick={() => handleClick(n)}
            />
          ))
        )}
      </TCard>
    </MemberShell>
  );
}
