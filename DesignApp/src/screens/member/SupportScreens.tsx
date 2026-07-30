import { Button, Card, CardHeader, SegmentedControl } from '@/design-system';
import { events, resources } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';

export function AvaScreen() {
  return (
    <MemberShell title="Ava">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-4 border-primary-200 bg-primary-50/30">
          <p className="font-mono text-xs uppercase tracking-widest text-primary-800 mb-2">AI companion — not a therapist</p>
          <p className="font-mono text-sm text-foreground-700">
            Ava offers supportive conversation. For crisis support, visit our{' '}
            <button type="button" className="underline">crisis resources</button>.
          </p>
        </Card>
        <Card>
          <CardHeader title="Chat with Ava" subtitle="3 of 20 messages remaining today" />
          <div className="space-y-3 min-h-64 mb-4">
            <div className="max-w-[85%] p-3 bg-background-200 font-mono text-sm">Hi Alex. What would feel helpful to talk about today?</div>
            <div className="max-w-[85%] ml-auto p-3 bg-primary-100 font-mono text-sm">I'm feeling overwhelmed about work this week.</div>
            <div className="max-w-[85%] p-3 bg-background-200 font-mono text-sm">
              <span className="text-[10px] uppercase tracking-widest text-foreground-500 block mb-1">Ava · AI</span>
              That sounds heavy. Would it help to name one small thing that felt manageable today?
            </div>
          </div>
          <div className="flex gap-2">
            <input className="flex-1 font-mono text-sm px-4 py-3 border border-background-200 bg-background-50" placeholder="Message Ava..." />
            <Button>Send</Button>
          </div>
        </Card>
      </div>
    </MemberShell>
  );
}

export function MoodScreen() {
  return (
    <MemberShell title="Mood check-in">
      <div className="max-w-xl mx-auto space-y-6">
        <Card>
          <CardHeader title="How are you feeling today?" subtitle="Private to you. Not shared on your profile." />
          <div className="grid grid-cols-5 gap-2 mb-4">
            {['Very low', 'Low', 'Okay', 'Good', 'Great'].map((label, i) => (
              <button key={label} type="button" className={`p-3 border font-mono text-[10px] uppercase ${i === 2 ? 'border-primary-500 bg-primary-50' : 'border-background-200'}`}>
                {label}
              </button>
            ))}
          </div>
          <textarea className="w-full min-h-24 font-mono text-sm p-4 border border-background-200 bg-background-50 mb-4" placeholder="Optional note (private)" />
          <Button fullWidth>Save check-in</Button>
        </Card>
        <Card>
          <CardHeader title="Trend" subtitle="Last 30 days" />
          <SegmentedControl value="30" options={[{ value: '7', label: '7 days' }, { value: '30', label: '30 days' }]} />
          <div className="h-40 mt-4 bg-background-200/60 flex items-end gap-2 p-4">
            {[3, 2, 4, 3, 5, 4, 3].map((v, i) => (
              <div key={i} className="flex-1 bg-primary-400" style={{ height: `${v * 18}%` }} />
            ))}
          </div>
        </Card>
      </div>
    </MemberShell>
  );
}

export function EventsScreen() {
  return (
    <MemberShell title="Events">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <SegmentedControl value="list" options={[{ value: 'month', label: 'Month' }, { value: 'list', label: 'List' }]} />
          <Button size="sm" variant="secondary">Staff only: Create event</Button>
        </div>
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader title={event.title} subtitle={`${event.date} · ${event.time}`} />
            <p className="font-mono text-sm text-foreground-600 mb-4">{event.location}</p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-foreground-500">{event.rsvp} attending</p>
              <Button size="sm">RSVP</Button>
            </div>
          </Card>
        ))}
      </div>
    </MemberShell>
  );
}

export function ResourcesScreen() {
  return (
    <MemberShell title="Resources">
      <div className="max-w-3xl mx-auto space-y-4">
        <input className="w-full font-mono text-sm px-4 py-3 bg-background-100 border border-background-200" placeholder="Search resources..." />
        {resources.map((r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-mono text-sm text-foreground-900">{r.title}</h3>
                <p className="font-mono text-xs text-foreground-500">{r.type} · {r.access}</p>
              </div>
              <Button size="sm" variant={r.progress === 100 ? 'secondary' : 'primary'}>
                {r.progress === 100 ? 'Completed' : r.progress > 0 ? 'Continue' : 'Open'}
              </Button>
            </div>
            {r.progress > 0 && r.progress < 100 && (
              <div className="mt-3 h-1.5 bg-background-200">
                <div className="h-full bg-primary-500" style={{ width: `${r.progress}%` }} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </MemberShell>
  );
}

export function ExploreScreen() {
  return (
    <MemberShell title="Explore">
      <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Search', desc: 'Find posts, members, and circles' },
          { title: 'Events', desc: 'Browse upcoming community events' },
          { title: 'Resources', desc: 'Learning library and progress' },
          { title: 'Blog', desc: 'Published stories and articles' },
          { title: 'Ava', desc: 'AI companion support chat' },
          { title: 'Mood', desc: 'Private daily check-in' },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader title={item.title} subtitle={item.desc} />
            <Button size="sm" variant="secondary">Open</Button>
          </Card>
        ))}
      </div>
    </MemberShell>
  );
}

export function SettingsScreen() {
  return (
    <MemberShell title="Settings">
      <div className="max-w-2xl mx-auto grid gap-4">
        {[
          'Profile',
          'Connections',
          'Blocked accounts',
          'Active sessions',
          'Ava data & consent',
          'Account data export',
          'Account & security',
        ].map((section) => (
          <Card key={section} padding="sm">
            <button type="button" className="w-full text-left p-4 font-mono text-sm text-foreground-800 hover:bg-background-200 transition-colors">
              {section}
            </button>
          </Card>
        ))}
      </div>
    </MemberShell>
  );
}
