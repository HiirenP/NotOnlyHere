import { Bell, Globe, Lock, Search, Settings, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, SegmentedControl } from '@/design-system';
import { GroupCard } from '@/components/social';
import { circles, conversations, currentUser, feedPosts, images, notifications } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';
import { PostCard } from '@/components/social';

export function CirclesScreen() {
  const [filter, setFilter] = useState('all');
  const joined = circles.filter((c) => c.joined);
  const discover = circles.filter((c) => !c.joined);

  return (
    <MemberShell showRightRail={false} fullWidth>
      <div className="max-w-5xl mx-auto">
        {/* Header banner */}
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-6 mb-6">
          <h1 className="font-display text-3xl uppercase tracking-tight text-foreground-950 mb-2">Circles</h1>
          <p className="font-mono text-sm text-foreground-600 max-w-xl">Your communities for peer support. Join circles that resonate, or discover new ones.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-400" />
              <input className="w-full font-mono text-sm pl-11 pr-4 py-3 bg-background-200/60 rounded-xl border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none" placeholder="Search circles..." />
            </div>
            <Button>Create circle</Button>
          </div>
        </div>

        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Your circles' },
            { value: 'discover', label: 'Discover' },
          ]}
          className="mb-6"
        />

        {/* Your circles — horizontal scroll on mobile */}
        <section className="mb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-600 mb-4">Joined ({joined.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {joined.map((circle) => (
              <GroupCard key={circle.id} circle={circle} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-600 mb-4">Discover circles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discover.map((circle) => (
              <GroupCard key={circle.id} circle={circle} />
            ))}
          </div>
        </section>
      </div>
    </MemberShell>
  );
}

export function CircleDetailScreen() {
  const circle = circles[0];
  const [tab, setTab] = useState('discussion');

  return (
    <MemberShell showRightRail={false} fullWidth>
      <div className="max-w-4xl mx-auto pb-8">
        {/* Cover + header — Facebook Group style */}
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden mb-4">
          <div className="relative h-48 md:h-64">
            <img src={circle.cover} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          <div className="px-6 pb-6 -mt-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <img src={circle.thumb} alt="" className="w-24 h-24 rounded-2xl border-4 border-background-100 shadow-lg object-cover" />
              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-foreground-950">{circle.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 font-mono text-xs text-foreground-600">
                  <span className="flex items-center gap-1"><Lock size={12} /> {circle.privacy}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {circle.members.toLocaleString()} members</span>
                  <span className="flex items-center gap-1"><Globe size={12} /> {circle.access}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm"><UserPlus size={16} className="mr-1" /> Invite</Button>
                <Button variant="secondary" size="sm"><Settings size={16} /></Button>
                <Button size="sm">Joined ✓</Button>
              </div>
            </div>
            <p className="font-mono text-sm text-foreground-700 mt-4 leading-relaxed">{circle.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm mb-4 overflow-hidden">
          <div className="flex border-b border-background-200 overflow-x-auto">
            {[
              { id: 'discussion', label: 'Discussion' },
              { id: 'about', label: 'About' },
              { id: 'members', label: 'Members' },
              { id: 'events', label: 'Events' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`font-mono text-xs uppercase tracking-wider px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id ? 'border-primary-500 text-primary-700 bg-primary-50/50' : 'border-transparent text-foreground-600 hover:bg-background-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'discussion' && (
            <div className="p-4">
              <div className="flex items-center gap-3 p-3 bg-background-200/50 rounded-xl mb-4">
                <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <Link to="/design/app/composer" className="flex-1 font-mono text-sm text-foreground-500 bg-background-100 rounded-full px-4 py-2.5 hover:bg-background-50 transition-colors">
                  Share with {circle.name}...
                </Link>
              </div>
              {feedPosts.filter((p) => p.circleId === 'c1').map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {tab === 'about' && (
            <div className="p-6 space-y-4 font-mono text-sm text-foreground-700">
              <p>{circle.description}</p>
              <div><strong className="text-foreground-900">Admins:</strong> {circle.admins.join(', ')}</div>
              <div><strong className="text-foreground-900">Privacy:</strong> {circle.privacy}</div>
            </div>
          )}

          {tab === 'members' && (
            <div className="p-4 grid sm:grid-cols-2 gap-3">
              {circle.admins.map((admin, i) => (
                <div key={admin} className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-200 transition-colors">
                  <img src={[images.avatar1, images.avatar2, images.avatar3][i]} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-mono text-sm text-foreground-900">{admin}</p>
                    <p className="font-mono text-[10px] text-primary-600 uppercase tracking-wider">Circle Admin</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'events' && (
            <div className="p-6 text-center font-mono text-sm text-foreground-500">No upcoming circle events. <Link to="/design/app/events" className="text-primary-600 hover:underline">Browse community events</Link></div>
          )}
        </div>
      </div>
    </MemberShell>
  );
}

export function ProfileScreen() {
  const [tab, setTab] = useState('posts');
  return (
    <MemberShell showRightRail={false} fullWidth>
      <div className="max-w-4xl mx-auto pb-8">
        {/* Cover + profile — Facebook style */}
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden mb-4">
          <div className="relative h-48 md:h-72">
            <img src={currentUser.cover} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
              <img src={currentUser.avatar} alt="" className="w-32 h-32 rounded-full border-4 border-background-100 shadow-lg object-cover" />
              <div className="flex-1 sm:pb-2">
                <h1 className="font-display text-3xl uppercase tracking-tight text-foreground-950">{currentUser.displayName}</h1>
                <p className="font-mono text-sm text-foreground-500">@{currentUser.username} · Joined {currentUser.joinedAt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Edit profile</Button>
                <Link to="/design/app/settings"><Button variant="secondary" size="sm"><Settings size={16} /></Button></Link>
              </div>
            </div>
            <p className="font-mono text-sm text-foreground-700 mt-4">{currentUser.bio}</p>
            <div className="flex gap-6 mt-4 font-mono text-sm">
              <span><strong className="text-foreground-900">{currentUser.connections}</strong> <span className="text-foreground-500">connections</span></span>
              <span><strong className="text-foreground-900">{currentUser.circles}</strong> <span className="text-foreground-500">circles</span></span>
            </div>
          </div>
        </div>

        {/* Profile tabs */}
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-background-200">
            {['posts', 'about', 'connections'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`font-mono text-xs uppercase tracking-wider px-6 py-4 border-b-2 capitalize ${
                  tab === t ? 'border-primary-500 text-primary-700' : 'border-transparent text-foreground-600 hover:bg-background-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === 'posts' && feedPosts.slice(0, 2).map((post) => <PostCard key={post.id} post={post} />)}
            {tab === 'about' && <p className="font-mono text-sm text-foreground-700 p-4">{currentUser.bio}</p>}
            {tab === 'connections' && <p className="font-mono text-sm text-foreground-500 p-4">48 connections</p>}
          </div>
        </div>
      </div>
    </MemberShell>
  );
}

export function MessagesScreen() {
  const [selected, setSelected] = useState('m1');
  const active = conversations.find((c) => c.id === selected);

  return (
    <MemberShell showRightRail={false} fullWidth>
      <div className="max-w-5xl mx-auto bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] min-h-[500px] flex">
        {/* Conversation list — Messenger sidebar */}
        <div className="w-full sm:w-80 border-r border-background-200 flex flex-col">
          <div className="p-4 border-b border-background-200">
            <h2 className="font-display text-xl uppercase text-foreground-950">Messages</h2>
            <div className="relative mt-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400" />
              <input className="w-full font-mono text-xs pl-9 pr-3 py-2 bg-background-200/60 rounded-full focus:outline-none" placeholder="Search messages" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-background-200/60 transition-colors text-left ${
                  selected === c.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <img src={c.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  {c.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success-500 border-2 border-background-100 rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-mono text-sm text-foreground-900 truncate">{c.name}</p>
                    <span className="font-mono text-[10px] text-foreground-500 shrink-0 ml-2">{c.time}</span>
                  </div>
                  <p className={`font-mono text-xs truncate ${c.unread ? 'text-foreground-900 font-medium' : 'text-foreground-500'}`}>{c.preview}</p>
                </div>
                {c.unread && <span className="w-2.5 h-2.5 bg-primary-500 rounded-full shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Thread — Messenger bubbles */}
        <div className="hidden sm:flex flex-1 flex-col">
          {active && (
            <>
              <div className="p-4 border-b border-background-200 flex items-center gap-3">
                <img src={active.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-mono text-sm text-foreground-900">{active.name}</p>
                  <p className="font-mono text-[10px] text-foreground-500">{active.online ? 'Active now' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background-50/50">
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-background-200 rounded-2xl rounded-bl-md px-4 py-2.5">
                    <p className="font-mono text-sm text-foreground-800">Thanks for checking in yesterday. It really meant a lot.</p>
                    <p className="font-mono text-[10px] text-foreground-500 mt-1">10:30 AM</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[70%] gradient-btn rounded-2xl rounded-br-md px-4 py-2.5">
                    <p className="font-mono text-sm text-background-50">Glad you're doing a bit better today. Here if you need to talk.</p>
                    <p className="font-mono text-[10px] text-background-50/70 mt-1 text-right">10:42 AM</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-background-200 rounded-2xl rounded-bl-md px-4 py-2.5">
                    <p className="font-mono text-sm text-foreground-800">That resource you shared was helpful too 🙏</p>
                    <p className="font-mono text-[10px] text-foreground-500 mt-1">10:45 AM</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-background-200 flex gap-2">
                <button type="button" className="w-10 h-10 rounded-full hover:bg-background-200 flex items-center justify-center text-lg">😊</button>
                <input className="flex-1 font-mono text-sm px-4 py-2.5 bg-background-200/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="Aa" />
                <button type="button" className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center text-background-50">➤</button>
              </div>
            </>
          )}
        </div>
      </div>
    </MemberShell>
  );
}

export function NotificationsScreen() {
  return (
    <MemberShell showRightRail={false}>
      <div className="max-w-xl mx-auto">
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-background-200 flex items-center justify-between">
            <h2 className="font-display text-xl uppercase text-foreground-950">Notifications</h2>
            <button type="button" className="font-mono text-xs text-primary-600 hover:underline">Mark all read</button>
          </div>
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-background-200 last:border-0 hover:bg-background-200/40 transition-colors ${n.unread ? 'bg-primary-50/30' : ''}`}>
              {n.avatar ? (
                <img src={n.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-background-300 flex items-center justify-center shrink-0"><Bell size={16} /></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm text-foreground-800">{n.text}</p>
                <p className="font-mono text-[11px] text-foreground-500 mt-1">{n.time}</p>
              </div>
              {n.unread && <span className="w-2.5 h-2.5 bg-primary-500 rounded-full shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      </div>
    </MemberShell>
  );
}
