'use client';

import { Bell, Calendar, Circle, Compass, Download, Lock, Search, Shield, Sparkles, User } from 'lucide-react';
import { DesignLink } from '@/design/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { AccountResponse, EventsListResponse, ResourcesListResponse, WellnessTrendsResponse } from '@notonlyhere/contracts';
import { resourceToCard } from '@/design/api/mappers';
import { rsvpEvent } from '@/design/api/post-actions';
import { ColorIcon, PageHeader, TBtn, TCard } from '@/design/components/template';
import { events, images, resources } from '@/design/data/mock';
import { MemberShell } from '@/design/layouts/Shells';

const avaStarters = [
  'I need help calming down',
  'How do I start a conversation in a circle?',
  'I feel lonely today',
  'Suggest a grounding exercise',
];

export function AvaScreen({ account }: { account: AccountResponse }) {
  const [consentAccepted, setConsentAccepted] = useState<boolean | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [message, setMessage] = useState('');
  const [quota, setQuota] = useState({ used: 0, limit: 50 });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/ai/consent').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/ai/quota').then((r) => (r.ok ? r.json() : null)),
    ]).then(([consent, q]) => {
      setConsentAccepted(Boolean(consent?.consents?.AI_USE));
      if (q) setQuota({ used: q.used ?? 0, limit: q.limit ?? 50 });
    });
  }, []);

  async function acceptConsent() {
    await fetch('/api/ai/consent', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ consentType: 'AI_USE', granted: true }),
    });
    setConsentAccepted(true);
    const convRes = await fetch('/api/ai/conversations', { method: 'POST' });
    if (convRes.ok) {
      const conv = await convRes.json();
      setConversationId(conv.id);
    }
  }

  async function sendAvaMessage() {
    if (!message.trim() || !conversationId || sending) return;
    setSending(true);
    setError('');
    const content = message.trim();
    setMessage('');
    setMessages((m) => [...m, { role: 'user', content }]);
    const res = await fetch(`/api/ai/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setSending(false);
    if (res.status === 429) {
      setError('Daily message limit reached. Your quota resets at midnight UTC.');
      setMessages((m) => m.slice(0, -1));
      return;
    }
    if (res.ok) {
      const data = await res.json();
      const reply = data.assistantMessage?.content ?? data.content ?? 'I hear you. Thank you for sharing.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      setQuota((q) => ({ ...q, used: q.used + 1 }));
    } else {
      setError('Unable to send message. Please try again.');
      setMessages((m) => m.slice(0, -1));
    }
  }

  useEffect(() => {
    if (!consentAccepted || conversationId) return;
    fetch('/api/ai/conversations', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((conv) => conv && setConversationId(conv.id));
  }, [consentAccepted, conversationId]);

  if (consentAccepted === null) {
    return (
      <MemberShell account={account}>
        <TCard className="text-sm text-[#676a79]">Loading Ava…</TCard>
      </MemberShell>
    );
  }

  if (!consentAccepted) {
    return (
      <MemberShell account={account}>
        <PageHeader title="Ava" subtitle="Your private AI companion on NotOnlyHere" />
        <TCard className="mb-4 border-[#0f6fec]/20 bg-[#0f6fec]/5">
          <p className="text-xs font-bold text-[#0f6fec] uppercase tracking-wide mb-2">Before you start</p>
          <p className="text-sm font-semibold text-[#14191e] mb-1">Ava is an AI companion, not a therapist or emergency service.</p>
          <p className="text-sm text-[#676a79]">NotOnlyHere does not automatically detect or escalate crises. If you are in danger, contact local emergency services or use our crisis resources.</p>
        </TCard>

        <TCard className="mb-4">
          <h3 className="text-sm font-bold text-[#14191e] mb-4">How Ava works</h3>
          <div className="space-y-4">
            {[
              { title: 'Private chat', desc: 'Only you can read your Ava conversations. They are not shown on your profile or in circles.', icon: Lock, color: 'blue' as const },
              { title: 'Supportive, not clinical', desc: 'Ava offers warm, non-clinical conversation. It does not diagnose, prescribe, or replace professional care.', icon: Shield, color: 'green' as const },
              { title: 'Daily limit', desc: 'You can send up to 50 messages per day. Your count resets at midnight UTC.', icon: Calendar, color: 'yellow' as const },
              { title: 'Your data', desc: 'Messages are sent to our AI provider under a no-training contract. You can delete history anytime in Settings.', icon: Download, color: 'purple' as const },
              { title: 'Optional extras', desc: 'You can separately opt in to personalization and circle recommendations in Settings > Ava data & consent.', icon: Sparkles, color: 'pink' as const },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <ColorIcon icon={item.icon} color={item.color} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-[#14191e]">{item.title}</p>
                  <p className="text-xs text-[#676a79] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </TCard>

        <TCard className="mb-4">
          <h3 className="text-sm font-bold text-[#14191e] mb-2">Crisis resources</h3>
          <p className="text-xs text-[#676a79] mb-3">Always available — even if you decline Ava or reach your daily limit.</p>
          <div className="flex flex-wrap gap-2">
            <TBtn variant="outline" size="sm">Crisis helplines</TBtn>
            <TBtn variant="outline" size="sm">Emergency guidance</TBtn>
          </div>
        </TCard>

        <div className="flex flex-col sm:flex-row gap-3">
          <TBtn className="flex-1" onClick={acceptConsent}>Accept & start chatting</TBtn>
          <DesignLink href="/app/feed" className="flex-1"><TBtn variant="outline" className="w-full">Decline</TBtn></DesignLink>
        </div>
        <p className="text-xs text-[#a1a5b3] text-center mt-4">
          Manage consent anytime in <DesignLink href="/app/settings" className="text-[#0f6fec] font-semibold hover:underline">Settings → Ava data & consent</DesignLink>
        </p>
      </MemberShell>
    );
  }

  return (
    <MemberShell account={account}>
      <PageHeader
        title="Ava"
        subtitle="Private AI companion · not a therapist"
        action={
          <DesignLink href="/app/settings">
            <TBtn variant="outline" size="sm">Ava settings</TBtn>
          </DesignLink>
        }
      />

      <TCard className="bg-[#0f6fec]/5 border-[#0f6fec]/20 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#0f6fec] uppercase">AI companion — not a therapist</p>
          <p className="text-xs text-[#676a79] mt-1">For crisis support, use <button type="button" className="text-[#0f6fec] font-semibold underline">crisis resources</button> — not Ava.</p>
        </div>
        <p className="text-xs font-semibold text-[#676a79] shrink-0">{quota.used} of {quota.limit} messages today</p>
      </TCard>

      {error ? <TCard className="mb-4 text-sm text-[#d6293e]">{error}</TCard> : null}

      <TCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f6fec] to-[#6610f2] flex items-center justify-center text-white text-lg">✨</div>
          <div>
            <p className="text-sm font-bold text-[#14191e]">Ava</p>
            <p className="text-xs text-[#676a79]">Private · AI-generated responses</p>
          </div>
        </div>

        <div className="p-4 space-y-4 min-h-80 bg-[#f5f6f8]/30">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white border border-[#e8eaed] rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                <span className="text-[10px] font-bold text-[#a1a5b3] uppercase block mb-1">Ava · AI</span>
                Hi {account.displayName.split(' ')[0]}. I&apos;m here for supportive conversation — not therapy or emergencies. What would feel helpful today?
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-[#0f6fec]/10 rounded-br-md' : 'bg-white border border-[#e8eaed] rounded-bl-md'}`}>
                {msg.role === 'assistant' && <span className="text-[10px] font-bold text-[#a1a5b3] uppercase block mb-1">Ava · AI</span>}
                {msg.content}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <p className="text-[10px] font-semibold text-[#a1a5b3] uppercase mb-2">Conversation starters</p>
            <div className="flex flex-wrap gap-2">
              {avaStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setMessage(starter)}
                  className="text-xs font-semibold px-3 py-2 rounded-full bg-white border border-[#e8eaed] text-[#676a79] hover:border-[#0f6fec]/30 hover:text-[#0f6fec] transition-colors"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#e8eaed] flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendAvaMessage()}
            className="flex-1 text-sm bg-[#f5f6f8] rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10"
            placeholder="Message Ava..."
          />
          <TBtn onClick={sendAvaMessage} disabled={sending || !message.trim()}>Send</TBtn>
        </div>
      </TCard>

      <TCard className="mt-4">
        <h3 className="text-sm font-bold text-[#14191e] mb-3">What Ava can help with</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#676a79]">
          <div className="p-3 rounded-xl bg-[#f5f6f8]">Reflect on how you&apos;re feeling</div>
          <div className="p-3 rounded-xl bg-[#f5f6f8]">Prepare to post in a circle</div>
          <div className="p-3 rounded-xl bg-[#f5f6f8]">Learn about grounding techniques</div>
          <div className="p-3 rounded-xl bg-[#f5f6f8]">Explore circles (with opt-in only)</div>
        </div>
        <p className="text-xs text-[#a1a5b3] mt-3">Ava cannot message other members, access your DMs, or replace peer support in circles.</p>
      </TCard>
    </MemberShell>
  );
}

export function MoodScreen({ account }: { account: AccountResponse }) {
  const [period, setPeriod] = useState('7');
  const [mood, setMood] = useState(4);
  const [note, setNote] = useState('');
  const [trends, setTrends] = useState<WellnessTrendsResponse | null>(null);

  const loadTrends = useCallback(async (windowDays: string) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch(`/api/wellness/trends?window=${windowDays}d&timeZone=${encodeURIComponent(tz)}`);
    if (res.ok) setTrends(await res.json());
  }, []);

  useEffect(() => {
    loadTrends(period);
  }, [period, loadTrends]);

  async function saveCheckin() {
    await fetch('/api/wellness/checkins', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mood, note: note || null, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    });
    setNote('');
    await loadTrends(period);
  }
  return (
    <MemberShell account={account}>
      <PageHeader title="Mood check-in" subtitle="Private to you — not shared on your profile" />
      <TCard className="mb-4">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">How are you feeling today?</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {['😔', '😕', '😐', '🙂', '😊'].map((e, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMood(i + 1)}
              className={`p-4 rounded-xl border text-2xl transition-all ${mood === i + 1 ? 'border-[#0f6fec] bg-[#0f6fec]/5 shadow-sm' : 'border-[#e8eaed] hover:border-[#0f6fec]/30'}`}
            >
              {e}
            </button>
          ))}
        </div>
        <textarea
          className="w-full min-h-24 text-sm p-4 bg-[#f5f6f8] rounded-xl border-0 focus:ring-2 focus:ring-[#0f6fec]/10 focus:outline-none mb-4"
          placeholder="Optional private note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <TBtn className="w-full" onClick={saveCheckin}>Save check-in</TBtn>
      </TCard>
      <TCard>
        <h3 className="text-sm font-bold text-[#14191e] mb-3">Your trend</h3>
        <div className="flex gap-1 border-b border-[#e8eaed] mb-4">
          {[{ id: '7', label: '7 days' }, { id: '30', label: '30 days' }].map((t) => (
            <button key={t.id} type="button" onClick={() => setPeriod(t.id)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${period === t.id ? 'border-[#0f6fec] text-[#0f6fec]' : 'border-transparent text-[#676a79]'}`}>{t.label}</button>
          ))}
        </div>
        <div className="h-40 flex items-end gap-1.5 mt-4">
          {(trends?.points ?? [3, 2, 4, 3, 5, 4, 3]).map((point, i) => {
            const v = typeof point === 'number' ? point : (point.mood ?? 3);
            return (
              <div
                key={i}
                className="flex-1 bg-[#0f6fec]/70 hover:bg-[#0f6fec] rounded-t-md transition-colors"
                style={{ height: `${v * 18}%` }}
              />
            );
          })}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function EventsScreen({ account }: { account: AccountResponse }) {
  const [apiEvents, setApiEvents] = useState<(typeof events[0] & { viewerRsvp?: string | null })[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    setLoading(true);
    const from = new Date().toISOString();
    const to = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch(`/api/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&view=list`);
    setLoading(false);
    if (!res.ok) return;
    const data: EventsListResponse = await res.json();
    if (!data?.items?.length) {
      setApiEvents([]);
      return;
    }
    setApiEvents(
      data.items.map((event, i) => ({
        id: event.id,
        title: event.title,
        date: new Date(event.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        time: new Date(event.startsAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
        location: event.locationName ?? 'Online',
        rsvp: `${event.counts.going} going`,
        cover: [images.event1, images.event2][i % 2],
        viewerRsvp: event.viewer.rsvpStatus,
      })),
    );
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleRsvp(eventId: string) {
    await rsvpEvent(eventId, 'GOING');
    await loadEvents();
  }
  return (
    <MemberShell account={account} fullWidth>
      <PageHeader title="Events" subtitle="Community events and workshops" action={<TBtn variant="soft" size="sm">Staff: Create event</TBtn>} />
      <div className="space-y-4">
        {loading ? (
          <TCard className="text-sm text-[#676a79]">Loading events…</TCard>
        ) : apiEvents.length === 0 ? (
          <TCard className="text-sm text-[#676a79]">No upcoming events.</TCard>
        ) : apiEvents.map((event) => (
          <TCard key={event.id} className="p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative sm:w-48 h-36 sm:h-auto shrink-0">
                <img src={event.cover} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent sm:hidden" />
              </div>
              <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ColorIcon icon={Calendar} color="red" size="sm" />
                    <span className="text-xs font-semibold text-[#0f6fec]">{event.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#14191e]">{event.title}</h3>
                  <p className="text-xs text-[#676a79] mt-1">{event.time} · {event.location}</p>
                  <p className="text-xs text-[#0cbc87] font-semibold mt-2">{event.rsvp} attending</p>
                </div>
                <TBtn size="sm" variant={event.viewerRsvp === 'GOING' ? 'outline' : 'primary'} onClick={() => handleRsvp(event.id)}>
                  {event.viewerRsvp === 'GOING' ? 'Going ✓' : 'RSVP'}
                </TBtn>
              </div>
            </div>
          </TCard>
        ))}
      </div>
    </MemberShell>
  );
}

export function ResourcesScreen({ account }: { account: AccountResponse }) {
  const [items, setItems] = useState<(typeof resources[0] & { slug?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/resources')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ResourcesListResponse | null) => {
        setLoading(false);
        if (!data?.items?.length) {
          setItems([]);
          return;
        }
        setItems(
          data.items.map((item, i) => {
            const card = resourceToCard(item, i);
            return {
              id: card.id,
              slug: card.slug,
              title: card.title,
              type: card.kind,
              access: item.access === 'PUBLIC_FREE' ? 'Free' : 'Members',
              cover: card.image,
              progress: item.viewer.progressPercent,
            };
          }),
        );
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter((r) => !query.trim() || r.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <MemberShell account={account} fullWidth>
      <PageHeader title="Resources" subtitle="Learning library and progress" />
      <input
        className="w-full text-sm px-5 py-3.5 bg-white border border-[#e8eaed] rounded-xl shadow-sm mb-5 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10"
        placeholder="Search resources..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <TCard className="text-sm text-[#676a79] sm:col-span-2 lg:col-span-3">Loading resources…</TCard>
        ) : filtered.length === 0 ? (
          <TCard className="text-sm text-[#676a79] sm:col-span-2 lg:col-span-3">No resources found.</TCard>
        ) : filtered.map((r) => (
          <TCard key={r.id} className="p-0 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-36">
              <img src={r.cover} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-white/90 text-[#676a79]">{r.type}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-[#14191e]">{r.title}</h3>
              <p className="text-xs text-[#676a79] mt-1">{r.access}</p>
              {r.progress > 0 && r.progress < 100 && (
                <div className="mt-3 h-1.5 bg-[#f5f6f8] rounded-full"><div className="h-full bg-[#0f6fec] rounded-full" style={{ width: `${r.progress}%` }} /></div>
              )}
              <DesignLink href={r.slug ? `/app/resources/${r.slug}` : '/app/resources'}>
                <TBtn size="sm" className="mt-4" variant={r.progress === 100 ? 'outline' : 'primary'}>
                  {r.progress === 100 ? 'Completed' : r.progress > 0 ? 'Continue' : 'Open'}
                </TBtn>
              </DesignLink>
            </div>
          </TCard>
        ))}
      </div>
    </MemberShell>
  );
}

export function ExploreScreen({ account }: { account: AccountResponse }) {
  const items = [
    { title: 'Search', desc: 'Find posts, members, circles', image: images.exploreSearch, icon: Search, color: 'blue' as const, to: '/app/search' },
    { title: 'Circles', desc: 'Peer-support communities', image: images.exploreCircles, icon: Circle, color: 'teal' as const, to: '/app/circles' },
    { title: 'Events', desc: 'Upcoming community events', image: images.exploreEvents, icon: Calendar, color: 'red' as const, to: '/app/events' },
    { title: 'Resources', desc: 'Learning library', image: images.exploreResources, icon: Compass, color: 'yellow' as const, to: '/app/resources' },
    { title: 'Ava', desc: 'Private AI companion chat', image: images.exploreAva, icon: Sparkles, color: 'pink' as const, to: '/app/ava' },
    { title: 'Mood', desc: 'Private check-in', image: images.exploreMood, icon: Bell, color: 'purple' as const, to: '/app/mood' },
  ];
  return (
    <MemberShell account={account} fullWidth>
      <PageHeader title="Explore" subtitle="Discover everything NotOnlyHere offers" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <DesignLink key={item.title} href={item.to} className="block group">
            <TCard className="p-0 overflow-hidden hover:shadow-md hover:border-[#0f6fec]/20 transition-all h-full">
              <div className="relative h-32">
                <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <ColorIcon icon={item.icon} color={item.color} size="sm" className="!bg-white/90 shadow-sm" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-[#14191e] group-hover:text-[#0f6fec] transition-colors">{item.title}</h3>
                <p className="text-xs text-[#676a79] mt-1">{item.desc}</p>
              </div>
            </TCard>
          </DesignLink>
        ))}
      </div>
    </MemberShell>
  );
}

export function SettingsScreen({ account }: { account: AccountResponse }) {
  const [active, setActive] = useState('Profile');
  const [displayName, setDisplayName] = useState(account.displayName);
  const [bio, setBio] = useState('');
  const [profileVersion, setProfileVersion] = useState(1);
  const [connections, setConnections] = useState<import('@notonlyhere/contracts').ConnectionItem[]>([]);
  const [sessions, setSessions] = useState<{ id: string; userAgentSummary: string; lastUsedAt: string; isCurrent?: boolean }[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/profile/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (p) {
          setDisplayName(p.displayName);
          setBio(p.bio ?? '');
          setProfileVersion(p.version);
        }
      });
    fetch('/api/connections').then((r) => (r.ok ? r.json() : [])).then(setConnections);
  }, []);

  useEffect(() => {
    if (active === 'Active sessions') {
      fetch('/api/account/sessions').then((r) => (r.ok ? r.json() : [])).then(setSessions);
    }
  }, [active]);

  async function saveProfile() {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ displayName, bio, version: profileVersion }),
    });
    if (res.ok) {
      const p = await res.json();
      setProfileVersion(p.version);
      setMessage('Profile saved.');
    }
  }

  async function requestExport() {
    const res = await fetch('/api/account/export', { method: 'POST' });
    setMessage(res.ok ? 'Export requested. You will be notified when ready.' : 'Export request failed.');
  }

  const sections = [
    { title: 'Profile', desc: 'Display name, bio, avatar', icon: User, color: 'blue' as const },
    { title: 'Connections', desc: 'Requests and mutual connections for messaging', icon: User, color: 'green' as const },
    { title: 'Active sessions', desc: 'Signed-in devices', icon: Lock, color: 'purple' as const },
    { title: 'Ava data & consent', desc: 'AI preferences, consent, and chat history', icon: Sparkles, color: 'pink' as const },
    { title: 'Account data export', desc: 'GDPR data request', icon: Download, color: 'teal' as const },
  ];

  return (
    <MemberShell account={account}>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      {message && <TCard className="mb-4 text-sm text-[#0cbc87]">{message}</TCard>}
      <div className="grid lg:grid-cols-3 gap-4">
        <TCard className="p-0 overflow-hidden divide-y divide-[#e8eaed] lg:col-span-1">
          {sections.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => { setActive(s.title); setMessage(''); }}
              className={`w-full text-left p-4 transition-colors flex items-center gap-3 group ${active === s.title ? 'bg-[#0f6fec]/5' : 'hover:bg-[#f5f6f8]'}`}
            >
              <ColorIcon icon={s.icon} color={s.color} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#14191e]">{s.title}</p>
                <p className="text-xs text-[#676a79] mt-0.5">{s.desc}</p>
              </div>
            </button>
          ))}
        </TCard>
        <TCard className="lg:col-span-2">
          {active === 'Profile' && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#14191e]">Display name
                <input className="mt-1 w-full text-sm border border-[#e8eaed] rounded-lg px-3 py-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </label>
              <label className="block text-sm font-semibold text-[#14191e]">Bio
                <textarea className="mt-1 w-full text-sm border border-[#e8eaed] rounded-lg px-3 py-2 min-h-24" value={bio} onChange={(e) => setBio(e.target.value)} />
              </label>
              <TBtn onClick={saveProfile}>Save profile</TBtn>
            </div>
          )}
          {active === 'Connections' && (
            <div className="space-y-3">
              {connections.map((c) => {
                const other = c.requester.id === account.id ? c.addressee : c.requester;
                return (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-[#f5f6f8]">
                    <span className="text-sm font-semibold">{other.displayName} · {c.status}</span>
                    {c.status === 'PENDING' && c.direction === 'incoming' && (
                      <TBtn size="sm" onClick={() => fetch(`/api/connections/${c.id}/accept`, { method: 'POST' }).then(() => window.location.reload())}>Accept</TBtn>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {active === 'Active sessions' && (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="text-sm p-2 rounded-lg bg-[#f5f6f8]">
                  <p className="font-semibold text-[#14191e]">{s.userAgentSummary ?? 'Unknown device'}{s.isCurrent ? ' (this device)' : ''}</p>
                  <p className="text-xs text-[#676a79]">Last active {new Date(s.lastUsedAt).toLocaleString()}</p>
                </div>
              ))}
              {!sessions.length && <p className="text-sm text-[#676a79]">No active sessions found.</p>}
            </div>
          )}
          {active === 'Ava data & consent' && (
            <div className="space-y-3">
              <p className="text-sm text-[#676a79]">Manage your Ava AI consent and preferences.</p>
              <DesignLink href="/app/ava"><TBtn variant="soft">Open Ava settings</TBtn></DesignLink>
            </div>
          )}
          {active === 'Account data export' && (
            <div className="space-y-3">
              <p className="text-sm text-[#676a79]">Request a copy of your account data.</p>
              <TBtn onClick={requestExport}>Request export</TBtn>
            </div>
          )}
        </TCard>
      </div>
    </MemberShell>
  );
}
