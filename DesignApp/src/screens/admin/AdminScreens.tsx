import { Button, Card, CardHeader, StatusBadge } from '@/design-system';
import { adminUsers, donations, safetyAlerts } from '@/data/mock';
import { AdminShell } from '@/layouts/Shells';

export function AdminDashboardScreen() {
  const kpis = [
    { label: 'Active members (7d)', value: '1,284' },
    { label: 'New signups (7d)', value: '96' },
    { label: 'Open safety alerts', value: '3' },
    { label: 'Pending circles', value: '5' },
  ];
  return (
    <AdminShell title="Dashboard">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500">{kpi.label}</p>
            <p className="font-display text-3xl text-foreground-950 mt-2">{kpi.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Recent admin activity" subtitle="Last 24 hours" />
          <ul className="space-y-3 font-mono text-sm text-foreground-700">
            <li>Staff suspended user @jordanl — policy violation</li>
            <li>Super Admin approved circle "Grief & Loss"</li>
            <li>Content Admin published blog draft</li>
          </ul>
        </Card>
        <Card>
          <CardHeader title="Safety alerts" subtitle="Requires human review" />
          {safetyAlerts.map((alert) => (
            <div key={alert.id} className="py-3 border-b border-background-200 last:border-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-mono text-sm text-foreground-900">{alert.type}</p>
                <StatusBadge status={alert.status === 'New' ? 'warning' : 'pending'} />
              </div>
              <p className="font-mono text-xs text-foreground-600">{alert.excerpt}</p>
            </div>
          ))}
        </Card>
      </div>
    </AdminShell>
  );
}

export function AdminUsersScreen() {
  return (
    <AdminShell title="Users">
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input className="flex-1 font-mono text-sm px-4 py-3 border border-background-200 bg-background-50" placeholder="Search by name, email, username..." />
          <Button variant="secondary">Filter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="text-left text-foreground-500 border-b border-background-200">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id} className="border-b border-background-200 hover:bg-background-100">
                  <td className="py-3 pr-4 text-foreground-900">{user.name}</td>
                  <td className="py-3 pr-4 text-foreground-600">{user.email}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={user.status === 'Active' ? 'active' : 'danger'} />
                  </td>
                  <td className="py-3 text-foreground-700">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminShell>
  );
}

export function AdminUserDetailScreen() {
  return (
    <AdminShell title="User detail">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <Card>
          <CardHeader title="Jordan Lee" subtitle="@jordanl · jordan@example.com" />
          <div className="flex gap-3 mb-6">
            <StatusBadge status="danger" />
            <StatusBadge status="muted" />
          </div>
          <div className="space-y-2 font-mono text-sm text-foreground-700">
            <p>Global role: Member</p>
            <p>Circle Admin: Anxiety Support</p>
            <p>Joined: January 2025</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="secondary">Restore access</Button>
            <Button variant="danger">Ban member</Button>
          </div>
        </Card>
        <Card>
          <CardHeader title="Enforcement history" />
          <p className="font-mono text-sm text-foreground-600">Suspended on Jul 28, 2026 — policy violation</p>
        </Card>
      </div>
    </AdminShell>
  );
}

export function AdminCirclesScreen() {
  return (
    <AdminShell title="Circles">
      <Card>
        <CardHeader title="Pending approvals" subtitle="5 awaiting review" />
        <div className="space-y-3">
          {['Grief & Loss', 'Work Stress', 'Student Support'].map((name) => (
            <div key={name} className="flex items-center justify-between p-4 border border-background-200">
              <div>
                <p className="font-mono text-sm text-foreground-900">{name}</p>
                <p className="font-mono text-xs text-foreground-500">Submitted 2 days ago</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">Review</Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}

export function AdminSafetyScreen() {
  return (
    <AdminShell title="Safety alerts">
      <Card>
        {safetyAlerts.map((alert) => (
          <div key={alert.id} className="p-4 border-b border-background-200 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-sm text-foreground-900">{alert.type}</p>
              <StatusBadge status="warning" />
            </div>
            <p className="font-mono text-xs text-foreground-600 mb-3">{alert.excerpt}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 mb-3">AI rationale · Confidence: {alert.confidence}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">Dismiss</Button>
              <Button size="sm">Open review</Button>
            </div>
          </div>
        ))}
      </Card>
    </AdminShell>
  );
}

export function AdminContentScreen() {
  return (
    <AdminShell title="Content">
      <div className="grid md:grid-cols-3 gap-4">
        {['Blog', 'Resources', 'Events'].map((section) => (
          <Card key={section}>
            <CardHeader title={section} subtitle="Create, edit, publish" />
            <Button size="sm">Manage {section.toLowerCase()}</Button>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}

export function AdminDonationsScreen() {
  return (
    <AdminShell title="Donations">
      <Card>
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="text-left text-foreground-500 border-b border-background-200">
              <th className="py-3">Donor ref</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Cadence</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-b border-background-200">
                <td className="py-3">{d.donor}</td>
                <td className="py-3">{d.amount}</td>
                <td className="py-3">{d.cadence}</td>
                <td className="py-3">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}

export function AdminAnalyticsScreen() {
  return (
    <AdminShell title="Analytics">
      <Card className="mb-4">
        <CardHeader title="Growth funnel" subtitle="Visit → Register → First post → Join circle" action={<Button size="sm" variant="secondary">Export CSV</Button>} />
        <div className="h-48 bg-background-200/50 flex items-end gap-3 p-6">
          {[100, 62, 38, 24].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-primary-500" style={{ height: `${v}%` }} />
              <span className="font-mono text-[10px] text-foreground-500">{v}%</span>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}

export function AdminAuditScreen() {
  return (
    <AdminShell title="Audit log">
      <Card>
        <input className="w-full font-mono text-sm px-4 py-3 border border-background-200 bg-background-50 mb-4" placeholder="Filter by actor, action, target..." />
        <div className="space-y-3 font-mono text-sm">
          <p><strong>staff@notonlyhere.com</strong> suspended user @jordanl — Jul 28, 2026 14:22 UTC</p>
          <p><strong>admin@notonlyhere.com</strong> approved circle "Grief & Loss" — Jul 27, 2026 09:10 UTC</p>
          <p><strong>content@notonlyhere.com</strong> published blog post — Jul 26, 2026 16:45 UTC</p>
        </div>
      </Card>
    </AdminShell>
  );
}
