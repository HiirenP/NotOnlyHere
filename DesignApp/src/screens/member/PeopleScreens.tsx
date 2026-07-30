import { Button, Card, CardHeader, SegmentedControl } from '@/design-system';
import { circles, conversations, currentUser, notifications } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';

export function CirclesScreen() {
  return (
    <MemberShell title="Circles">
      <div className="max-w-4xl mx-auto space-y-4">
        <input className="w-full font-mono text-sm px-4 py-3 bg-background-100 border border-background-200" placeholder="Search circles..." />
        <div className="grid md:grid-cols-2 gap-4">
          {circles.map((circle) => (
            <Card key={circle.id}>
              <CardHeader title={circle.name} subtitle={`${circle.members} members · ${circle.access}`} />
              <Button size="sm" variant={circle.joined ? 'secondary' : 'primary'}>
                {circle.joined ? 'View circle' : 'Request to join'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </MemberShell>
  );
}

export function CircleDetailScreen() {
  return (
    <MemberShell title="Anxiety Support">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader title="Anxiety Support" subtitle="A calm space to share experiences and coping strategies." />
          <p className="font-mono text-sm text-foreground-600 mb-4">842 members · Open · 3 Circle Admins</p>
          <Button>Join conversation</Button>
        </Card>
        <Card>
          <CardHeader title="Circle feed" subtitle="Posts from members in this circle" />
          <p className="font-mono text-sm text-foreground-600">Join to participate in the feed and post as a member.</p>
        </Card>
      </div>
    </MemberShell>
  );
}

export function ProfileScreen() {
  return (
    <MemberShell title="Profile">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-mono text-xl">AM</div>
            <div className="flex-1">
              <h2 className="font-display text-3xl uppercase text-foreground-950">{currentUser.displayName}</h2>
              <p className="font-mono text-sm text-foreground-500">@{currentUser.username} · Joined {currentUser.joinedAt}</p>
              <p className="font-mono text-sm text-foreground-700 mt-3">{currentUser.bio}</p>
              <div className="flex gap-3 mt-4">
                <Button size="sm">Message</Button>
                <Button size="sm" variant="secondary">Connected</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MemberShell>
  );
}

export function MessagesScreen() {
  return (
    <MemberShell title="Messages">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-[320px_1fr] gap-4 min-h-[60vh]">
        <Card padding="sm" className="space-y-2">
          {conversations.map((c) => (
            <button key={c.id} type="button" className="w-full text-left p-3 hover:bg-background-200 transition-colors">
              <div className="flex justify-between gap-2">
                <p className="font-mono text-sm text-foreground-900">{c.name}</p>
                <span className="font-mono text-[10px] text-foreground-500">{c.time}</span>
              </div>
              <p className="font-mono text-xs text-foreground-600 truncate">{c.preview}</p>
            </button>
          ))}
        </Card>
        <Card>
          <CardHeader title="Jordan Lee" subtitle="Connection-only messaging" />
          <div className="space-y-3 mb-4 min-h-48">
            <div className="max-w-[80%] p-3 bg-background-200 font-mono text-sm">Thanks for checking in yesterday.</div>
            <div className="max-w-[80%] ml-auto p-3 bg-primary-100 font-mono text-sm">Glad you're doing a bit better today.</div>
          </div>
          <div className="flex gap-2">
            <input className="flex-1 font-mono text-sm px-4 py-3 border border-background-200 bg-background-50" placeholder="Write a message..." />
            <Button>Send</Button>
          </div>
        </Card>
      </div>
    </MemberShell>
  );
}

export function NotificationsScreen() {
  return (
    <MemberShell title="Notifications">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <SegmentedControl value="all" options={[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }]} />
          <Button variant="ghost" size="sm">Mark all read</Button>
        </div>
        <Card padding="sm">
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 border-b border-background-200 last:border-0 ${n.unread ? 'bg-primary-50/40' : ''}`}>
              <p className="font-mono text-sm text-foreground-800">{n.text}</p>
              <p className="font-mono text-[11px] text-foreground-500 mt-1">{n.time}</p>
            </div>
          ))}
        </Card>
      </div>
    </MemberShell>
  );
}
