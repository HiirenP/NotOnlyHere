import { Bell, Calendar, Circle, Compass, Download, Lock, Search, Shield, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ColorIcon, PageHeader, TBtn, TCard } from '@/components/template';
import { events, images, resources } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';

const avaStarters = [
  'I need help calming down',
  'How do I start a conversation in a circle?',
  'I feel lonely today',
  'Suggest a grounding exercise',
];

export function AvaScreen() {
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const messagesUsed = 3;
  const dailyLimit = 50;

  if (!consentAccepted) {
    return (
      <MemberShell>
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
          <TBtn className="flex-1" onClick={() => setConsentAccepted(true)}>Accept & start chatting</TBtn>
          <TBtn variant="outline" className="flex-1">Decline</TBtn>
        </div>
        <p className="text-xs text-[#a1a5b3] text-center mt-4">
          Manage consent anytime in <Link to="/design/app/settings" className="text-[#0f6fec] font-semibold hover:underline">Settings → Ava data & consent</Link>
        </p>
      </MemberShell>
    );
  }

  return (
    <MemberShell>
      <PageHeader
        title="Ava"
        subtitle="Private AI companion · not a therapist"
        action={
          <Link to="/design/app/settings">
            <TBtn variant="outline" size="sm">Ava settings</TBtn>
          </Link>
        }
      />

      <TCard className="bg-[#0f6fec]/5 border-[#0f6fec]/20 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#0f6fec] uppercase">AI companion — not a therapist</p>
          <p className="text-xs text-[#676a79] mt-1">For crisis support, use <button type="button" className="text-[#0f6fec] font-semibold underline">crisis resources</button> — not Ava.</p>
        </div>
        <p className="text-xs font-semibold text-[#676a79] shrink-0">{messagesUsed} of {dailyLimit} messages today</p>
      </TCard>

      <TCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0f6fec] to-[#6610f2] flex items-center justify-center text-white text-lg">✨</div>
          <div>
            <p className="text-sm font-bold text-[#14191e]">Ava</p>
            <p className="text-xs text-[#676a79]">Private · AI-generated responses</p>
          </div>
        </div>

        <div className="p-4 space-y-4 min-h-80 bg-[#f5f6f8]/30">
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white border border-[#e8eaed] rounded-2xl rounded-bl-md px-4 py-3 text-sm">
              <span className="text-[10px] font-bold text-[#a1a5b3] uppercase block mb-1">Ava · AI</span>
              Hi Alex. I&apos;m here for supportive conversation — not therapy or emergencies. What would feel helpful today?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[85%] bg-[#0f6fec]/10 rounded-2xl rounded-br-md px-4 py-3 text-sm">I&apos;m feeling overwhelmed about work.</div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white border border-[#e8eaed] rounded-2xl rounded-bl-md px-4 py-3 text-sm">
              Would it help to name one small thing that felt manageable today? You don&apos;t have to solve everything at once.
            </div>
          </div>

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
            className="flex-1 text-sm bg-[#f5f6f8] rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10"
            placeholder="Message Ava..."
          />
          <TBtn>Send</TBtn>
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

export function MoodScreen() {
  const [period, setPeriod] = useState('30');
  return (
    <MemberShell>
      <PageHeader title="Mood check-in" subtitle="Private to you — not shared on your profile" />
      <TCard className="mb-4">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">How are you feeling today?</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {['😔', '😕', '😐', '🙂', '😊'].map((e, i) => (
            <button key={i} type="button" className={`p-4 rounded-xl border text-2xl transition-all ${i === 3 ? 'border-[#0f6fec] bg-[#0f6fec]/5 shadow-sm' : 'border-[#e8eaed] hover:border-[#0f6fec]/30'}`}>{e}</button>
          ))}
        </div>
        <textarea className="w-full min-h-24 text-sm p-4 bg-[#f5f6f8] rounded-xl border-0 focus:ring-2 focus:ring-[#0f6fec]/10 focus:outline-none mb-4" placeholder="Optional private note..." />
        <TBtn className="w-full">Save check-in</TBtn>
      </TCard>
      <TCard>
        <h3 className="text-sm font-bold text-[#14191e] mb-3">Your trend</h3>
        <div className="flex gap-1 border-b border-[#e8eaed] mb-4">
          {[{ id: '7', label: '7 days' }, { id: '30', label: '30 days' }].map((t) => (
            <button key={t.id} type="button" onClick={() => setPeriod(t.id)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${period === t.id ? 'border-[#0f6fec] text-[#0f6fec]' : 'border-transparent text-[#676a79]'}`}>{t.label}</button>
          ))}
        </div>
        <div className="h-40 flex items-end gap-1.5 mt-4">
          {[3, 2, 4, 3, 5, 4, 3, 4, 5, 4, 3, 4, 5, 4].map((v, i) => (
            <div key={i} className="flex-1 bg-[#0f6fec]/70 hover:bg-[#0f6fec] rounded-t-md transition-colors" style={{ height: `${v * 18}%` }} />
          ))}
        </div>
      </TCard>
    </MemberShell>
  );
}

export function EventsScreen() {
  return (
    <MemberShell fullWidth>
      <PageHeader title="Events" subtitle="Community events and workshops" action={<TBtn variant="soft" size="sm">Staff: Create event</TBtn>} />
      <div className="space-y-4">
        {events.map((event) => (
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
                <TBtn size="sm">RSVP</TBtn>
              </div>
            </div>
          </TCard>
        ))}
      </div>
    </MemberShell>
  );
}

export function ResourcesScreen() {
  return (
    <MemberShell fullWidth>
      <PageHeader title="Resources" subtitle="Learning library and progress" />
      <input className="w-full text-sm px-5 py-3.5 bg-white border border-[#e8eaed] rounded-xl shadow-sm mb-5 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10" placeholder="Search resources..." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => (
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
              <TBtn size="sm" className="mt-4" variant={r.progress === 100 ? 'outline' : 'primary'}>{r.progress === 100 ? 'Completed' : r.progress > 0 ? 'Continue' : 'Open'}</TBtn>
            </div>
          </TCard>
        ))}
      </div>
    </MemberShell>
  );
}

export function ExploreScreen() {
  const items = [
    { title: 'Search', desc: 'Find posts, members, circles', image: images.exploreSearch, icon: Search, color: 'blue' as const, to: '/design/app/search' },
    { title: 'Circles', desc: 'Peer-support communities', image: images.exploreCircles, icon: Circle, color: 'teal' as const, to: '/design/app/circles' },
    { title: 'Events', desc: 'Upcoming community events', image: images.exploreEvents, icon: Calendar, color: 'red' as const, to: '/design/app/events' },
    { title: 'Resources', desc: 'Learning library', image: images.exploreResources, icon: Compass, color: 'yellow' as const, to: '/design/app/resources' },
    { title: 'Ava', desc: 'Private AI companion chat', image: images.exploreAva, icon: Sparkles, color: 'pink' as const, to: '/design/app/ava' },
    { title: 'Mood', desc: 'Private check-in', image: images.exploreMood, icon: Bell, color: 'purple' as const, to: '/design/app/mood' },
  ];
  return (
    <MemberShell fullWidth>
      <PageHeader title="Explore" subtitle="Discover everything NotOnlyHere offers" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link key={item.title} to={item.to} className="block group">
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
          </Link>
        ))}
      </div>
    </MemberShell>
  );
}

export function SettingsScreen() {
  const sections = [
    { title: 'Profile', desc: 'Display name, bio, avatar', icon: User, color: 'blue' as const },
    { title: 'Connections', desc: 'Requests and mutual connections for messaging', icon: User, color: 'green' as const },
    { title: 'Blocked accounts', desc: 'Manage blocked members', icon: Shield, color: 'red' as const },
    { title: 'Active sessions', desc: 'Signed-in devices', icon: Lock, color: 'purple' as const },
    { title: 'Ava data & consent', desc: 'AI preferences, consent, and chat history', icon: Sparkles, color: 'pink' as const },
    { title: 'Account data export', desc: 'GDPR data request', icon: Download, color: 'teal' as const },
    { title: 'Account & security', desc: 'Password and deletion', icon: Shield, color: 'orange' as const },
  ];
  return (
    <MemberShell>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      <TCard className="p-0 overflow-hidden divide-y divide-[#e8eaed]">
        {sections.map((s) => (
          <button key={s.title} type="button" className="w-full text-left p-4 hover:bg-[#f5f6f8] transition-colors flex items-center gap-3 group">
            <ColorIcon icon={s.icon} color={s.color} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#14191e] group-hover:text-[#0f6fec] transition-colors">{s.title}</p>
              <p className="text-xs text-[#676a79] mt-0.5">{s.desc}</p>
            </div>
            <span className="text-[#a1a5b3]">›</span>
          </button>
        ))}
      </TCard>
    </MemberShell>
  );
}
