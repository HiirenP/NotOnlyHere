import { Settings, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, TAvatar, TBadge, TBtn, TCard, TListItem, TSearch, TTabs } from '@/components/template';
import { GroupCard, PostCard } from '@/components/social';
import { circles, conversations, currentUser, feedPosts, images, notifications } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';

export function CirclesScreen() {
  const [tab, setTab] = useState('joined');
  const joined = circles.filter((c) => c.joined);
  const discover = circles.filter((c) => !c.joined);

  return (
    <MemberShell fullWidth>
      <PageHeader title="Circles" subtitle="Discover and join peer-support communities" action={<TBtn>Create circle</TBtn>} />
      <TSearch placeholder="Search circles..." className="mb-4" />
      <TTabs className="mb-4" tabs={[{ id: 'joined', label: `Your circles (${joined.length})` }, { id: 'discover', label: 'Discover' }]} active={tab} onChange={setTab} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(tab === 'joined' ? joined : discover).map((circle) => (
          <GroupCard key={circle.id} circle={circle} />
        ))}
      </div>
    </MemberShell>
  );
}

export function CircleDetailScreen() {
  const circle = circles[0];
  const [tab, setTab] = useState('discussion');

  return (
    <MemberShell fullWidth>
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
              <TBtn variant="outline" size="sm"><Settings size={14} /></TBtn>
              <TBtn size="sm">Joined ✓</TBtn>
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
                <TAvatar src={currentUser.avatar} name={currentUser.displayName} />
                <Link to="/design/app/composer" className="flex-1 text-sm text-[#a1a5b3]">Share with {circle.name}...</Link>
              </div>
              {feedPosts.filter((p) => p.circleId === 'c1').map((post) => <PostCard key={post.id} post={post} />)}
            </>
          )}
          {tab === 'about' && <p className="text-sm text-[#676a79]">{circle.description}</p>}
          {tab === 'members' && (
            <div className="grid sm:grid-cols-2 gap-2">
              {circle.admins.map((admin, i) => (
                <div key={admin} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f6f8]">
                  <TAvatar src={[images.avatar1, images.avatar2, images.avatar3][i]} name={admin} />
                  <div>
                    <p className="text-sm font-semibold text-[#14191e]">{admin}</p>
                    <p className="text-xs text-[#0f6fec] font-semibold">Circle Admin</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'events' && <p className="text-sm text-[#676a79]">No upcoming events. <Link to="/design/app/events" className="text-[#0f6fec] font-semibold">Browse events</Link></p>}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function ProfileScreen() {
  const [tab, setTab] = useState('posts');
  return (
    <MemberShell fullWidth>
      <TCard className="p-0 mb-4" padding={false}>
        <div className="relative h-48 md:h-56">
          <img src={currentUser.cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          <img
            src={currentUser.avatar}
            alt=""
            className="absolute left-6 -bottom-14 w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover object-[center_20%] z-10 bg-white"
          />
        </div>
        <div className="px-6 pb-8 pt-20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#14191e]">{currentUser.displayName}</h1>
              <p className="text-sm text-[#676a79] mt-1">@{currentUser.username} · Joined {currentUser.joinedAt}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <TBtn variant="outline" size="sm">Edit profile</TBtn>
              <Link to="/design/app/settings"><TBtn variant="outline" size="sm"><Settings size={14} /></TBtn></Link>
            </div>
          </div>
          <p className="text-sm text-[#676a79] mt-4 leading-relaxed">{currentUser.bio}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
            <span><strong className="text-[#14191e]">{currentUser.posts}</strong> <span className="text-[#676a79]">posts</span></span>
            <span><strong className="text-[#14191e]">{currentUser.connections}</strong> <span className="text-[#676a79]">connections</span></span>
            <span><strong className="text-[#14191e]">{currentUser.circles}</strong> <span className="text-[#676a79]">circles</span></span>
          </div>
        </div>
      </TCard>
      <TCard className="p-0 overflow-hidden">
        <TTabs className="px-2" tabs={[{ id: 'posts', label: 'Posts' }, { id: 'about', label: 'About' }, { id: 'connections', label: 'Connections' }]} active={tab} onChange={setTab} />
        <div className="p-4 pt-0">
          {tab === 'posts' && feedPosts.slice(0, 2).map((p) => <PostCard key={p.id} post={p} />)}
          {tab === 'about' && <p className="text-sm text-[#676a79] p-2">{currentUser.bio}</p>}
          {tab === 'connections' && (
            <div className="p-2 space-y-3">
              <p className="text-sm text-[#676a79]">
                Connections are people you&apos;ve mutually agreed to connect with. Once connected, you can send private messages.
              </p>
              <p className="text-sm font-semibold text-[#14191e]">{currentUser.connections} connections</p>
              <TBtn variant="soft" size="sm">Manage connection requests</TBtn>
            </div>
          )}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function MessagesScreen() {
  const [selected, setSelected] = useState('m1');
  const active = conversations.find((c) => c.id === selected);

  return (
    <MemberShell fullWidth>
      <PageHeader title="Messages" subtitle="Private conversations with your connections" />
      <TCard className="p-0 overflow-hidden flex flex-col sm:flex-row h-[calc(100vh-220px)] min-h-[500px]">
        <div className="w-full sm:w-80 border-r border-[#e8eaed] flex flex-col">
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
                onClick={() => setSelected(c.id)}
              />
            ))}
          </div>
        </div>
        <div className="hidden sm:flex flex-1 flex-col">
          {active && (
            <>
              <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
                <TAvatar src={active.avatar} name={active.name} online={active.online} />
                <div>
                  <p className="text-sm font-bold text-[#14191e]">{active.name}</p>
                  <p className="text-xs text-[#0cbc87]">{active.online ? 'Active now' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f6f8]/50">
                <div className="flex justify-start"><div className="max-w-[70%] bg-white border border-[#e8eaed] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">Thanks for checking in yesterday.</div></div>
                <div className="flex justify-end"><div className="max-w-[70%] bg-[#0f6fec] text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm">Glad you're doing better today.</div></div>
                <div className="flex justify-start"><div className="max-w-[70%] bg-white border border-[#e8eaed] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">That resource was helpful 🙏</div></div>
              </div>
              <div className="p-4 border-t border-[#e8eaed] flex gap-2">
                <input className="flex-1 text-sm bg-[#f5f6f8] rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10" placeholder="Type a message..." />
                <TBtn>Send</TBtn>
              </div>
            </>
          )}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function NotificationsScreen() {
  return (
    <MemberShell>
      <PageHeader title="Notifications" subtitle="Stay updated on community activity" action={<TBtn variant="soft" size="sm">Mark all read</TBtn>} />
      <TCard className="p-0 overflow-hidden divide-y divide-[#e8eaed]">
        {notifications.map((n) => (
          <TListItem
            key={n.id}
            avatar={n.avatar ? <img src={n.avatar} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-[#f5f6f8] flex items-center justify-center">🔔</div>}
            title={n.text}
            meta={n.time}
            unread={n.unread}
          />
        ))}
      </TCard>
    </MemberShell>
  );
}
