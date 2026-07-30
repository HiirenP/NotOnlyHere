import { Button, CardHeader, SegmentedControl } from '@/design-system';
import { events, resources } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';

export function AvaScreen() {
  return (
    <MemberShell showRightRail={false}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-200 p-4 mb-4">
          <p className="font-mono text-xs uppercase tracking-widest text-primary-800 mb-1">AI companion — not a therapist</p>
          <p className="font-mono text-sm text-foreground-700">
            Ava offers supportive conversation. For crisis support, visit our{' '}
            <button type="button" className="underline text-primary-700">crisis resources</button>.
          </p>
        </div>
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-background-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-background-50 text-lg">✨</div>
            <div>
              <p className="font-mono text-sm text-foreground-900">Ava</p>
              <p className="font-mono text-[10px] text-foreground-500">3 of 20 messages remaining today</p>
            </div>
          </div>
          <div className="p-4 space-y-4 min-h-80 bg-background-50/30">
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-background-200 rounded-2xl rounded-bl-md px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 block mb-1">Ava · AI</span>
                <p className="font-mono text-sm text-foreground-800">Hi Alex. What would feel helpful to talk about today?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-primary-100 rounded-2xl rounded-br-md px-4 py-3">
                <p className="font-mono text-sm text-foreground-800">I'm feeling overwhelmed about work this week.</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-background-200 rounded-2xl rounded-bl-md px-4 py-3">
                <p className="font-mono text-sm text-foreground-800">That sounds heavy. Would it help to name one small thing that felt manageable today?</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-background-200 flex gap-2">
            <input className="flex-1 font-mono text-sm px-4 py-3 bg-background-200/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="Message Ava..." />
            <Button className="rounded-full px-5">Send</Button>
          </div>
        </div>
      </div>
    </MemberShell>
  );
}

export function MoodScreen() {
  return (
    <MemberShell showRightRail={false}>
      <div className="max-w-xl mx-auto space-y-4">
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-6">
          <h2 className="font-display text-xl uppercase text-foreground-950 mb-1">How are you feeling today?</h2>
          <p className="font-mono text-xs text-foreground-500 mb-6">Private to you. Not shared on your profile.</p>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {['😔', '😕', '😐', '🙂', '😊'].map((emoji, i) => (
              <button key={i} type="button" className={`p-4 rounded-xl border text-2xl transition-all hover:scale-105 ${i === 3 ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-background-200 hover:border-background-300'}`}>
                {emoji}
              </button>
            ))}
          </div>
          <textarea className="w-full min-h-24 font-mono text-sm p-4 bg-background-200/40 rounded-xl border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none mb-4" placeholder="Optional private note..." />
          <Button fullWidth>Save check-in</Button>
        </div>
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-6">
          <CardHeader title="Your trend" subtitle="Last 30 days" />
          <SegmentedControl value="30" options={[{ value: '7', label: '7 days' }, { value: '30', label: '30 days' }]} className="mb-4" />
          <div className="h-40 flex items-end gap-2 p-2">
            {[3, 2, 4, 3, 5, 4, 3, 4, 5, 4, 3, 4, 5, 4].map((v, i) => (
              <div key={i} className="flex-1 bg-primary-400/80 rounded-t-sm hover:bg-primary-500 transition-colors" style={{ height: `${v * 18}%` }} title={`Day ${i + 1}: ${v}/5`} />
            ))}
          </div>
        </div>
      </div>
    </MemberShell>
  );
}

export function EventsScreen() {
  return (
    <MemberShell showRightRail={false} fullWidth>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="font-display text-2xl uppercase text-foreground-950">Events</h1>
          <SegmentedControl value="list" options={[{ value: 'month', label: 'Month' }, { value: 'list', label: 'List' }]} />
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-32 bg-primary-500 text-background-50 flex sm:flex-col items-center justify-center p-4 gap-1">
                <span className="font-display text-2xl uppercase">{event.date.split(' ')[0]}</span>
                <span className="font-mono text-xs">{event.date.split(' ')[1]}</span>
              </div>
              <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-mono text-base text-foreground-900">{event.title}</h3>
                  <p className="font-mono text-xs text-foreground-500 mt-1">{event.time} · {event.location}</p>
                  <p className="font-mono text-xs text-foreground-600 mt-2">{event.rsvp} attending</p>
                </div>
                <Button size="sm">RSVP</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

export function ResourcesScreen() {
  return (
    <MemberShell showRightRail={false} fullWidth>
      <div className="max-w-3xl mx-auto">
        <input className="w-full font-mono text-sm px-5 py-4 bg-background-100 border border-background-200 rounded-2xl shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="Search resources..." />
        <div className="grid sm:grid-cols-2 gap-4">
          {resources.map((r) => (
            <div key={r.id} className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-xl mb-3">
                {r.type === 'Video' ? '🎬' : '📄'}
              </div>
              <h3 className="font-mono text-sm text-foreground-900">{r.title}</h3>
              <p className="font-mono text-xs text-foreground-500 mt-1">{r.type} · {r.access}</p>
              {r.progress > 0 && r.progress < 100 && (
                <div className="mt-3 h-1.5 bg-background-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${r.progress}%` }} />
                </div>
              )}
              <Button size="sm" className="mt-4" variant={r.progress === 100 ? 'secondary' : 'primary'}>
                {r.progress === 100 ? 'Completed' : r.progress > 0 ? 'Continue' : 'Open'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

export function ExploreScreen() {
  const items = [
    { title: 'Search', desc: 'Find posts, members, and circles', emoji: '🔍', to: '/design/app/search' },
    { title: 'Events', desc: 'Browse upcoming community events', emoji: '📅', to: '/design/app/events' },
    { title: 'Resources', desc: 'Learning library and progress', emoji: '📚', to: '/design/app/resources' },
    { title: 'Ava', desc: 'AI companion support chat', emoji: '✨', to: '/design/app/ava' },
    { title: 'Mood', desc: 'Private daily check-in', emoji: '💭', to: '/design/app/mood' },
    { title: 'Blog', desc: 'Published stories and articles', emoji: '✍️', to: '/design' },
  ];
  return (
    <MemberShell showRightRail={false} fullWidth>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl uppercase text-foreground-950 mb-6">Explore</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <a key={item.title} href={item.to} className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-6 hover:shadow-md hover:border-primary-200 transition-all group">
              <span className="text-3xl">{item.emoji}</span>
              <h3 className="font-mono text-sm text-foreground-900 mt-3 group-hover:text-primary-700 transition-colors">{item.title}</h3>
              <p className="font-mono text-xs text-foreground-500 mt-1">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

export function SettingsScreen() {
  const sections = [
    { title: 'Profile', desc: 'Edit display name, bio, avatar' },
    { title: 'Connections', desc: 'Manage requests and connections' },
    { title: 'Blocked accounts', desc: 'View and unblock members' },
    { title: 'Active sessions', desc: 'Devices signed into your account' },
    { title: 'Ava data & consent', desc: 'AI preferences and history' },
    { title: 'Account data export', desc: 'Request your data (GDPR)' },
    { title: 'Account & security', desc: 'Password, deletion' },
  ];
  return (
    <MemberShell showRightRail={false}>
      <div className="max-w-xl mx-auto">
        <h1 className="font-display text-2xl uppercase text-foreground-950 mb-6">Settings</h1>
        <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden divide-y divide-background-200">
          {sections.map((s) => (
            <button key={s.title} type="button" className="w-full text-left p-4 hover:bg-background-200/50 transition-colors flex justify-between items-center group">
              <div>
                <p className="font-mono text-sm text-foreground-900 group-hover:text-primary-700 transition-colors">{s.title}</p>
                <p className="font-mono text-xs text-foreground-500 mt-0.5">{s.desc}</p>
              </div>
              <span className="text-foreground-400">›</span>
            </button>
          ))}
        </div>
      </div>
    </MemberShell>
  );
}
