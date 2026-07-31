import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, TAvatar, TBadge, TBtn, TCard, TListItem, TSearch, TTabs } from '@/components/template';
import { adminUsers, donations, images, safetyAlerts } from '@/data/mock';
import { AdminShell } from '@/layouts/Shells';

function KpiCard({ label, value, change, icon: Icon, color }: { label: string; value: string; change?: string; icon: typeof Users; color: string }) {
  return (
    <TCard className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#676a79] uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-[#14191e] mt-2">{value}</p>
          {change && (
            <p className="text-xs font-semibold text-[#0cbc87] mt-2 flex items-center gap-1">
              <TrendingUp size={12} />
              {change}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </TCard>
  );
}

export function AdminDashboardScreen() {
  const kpis = [
    { label: 'Active members (7d)', value: '1,284', change: '+12% vs last week', icon: Users, color: 'bg-[#0f6fec]/10 text-[#0f6fec]' },
    { label: 'New signups (7d)', value: '96', change: '+8% vs last week', icon: ArrowUpRight, color: 'bg-[#0cbc87]/10 text-[#0cbc87]' },
    { label: 'Open safety alerts', value: '3', icon: Shield, color: 'bg-[#f7c32e]/15 text-[#c9a000]' },
    { label: 'Pending circles', value: '5', icon: Clock, color: 'bg-[#6610f2]/10 text-[#6610f2]' },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <TCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#14191e]">Recent admin activity</h2>
              <p className="text-xs text-[#676a79] mt-0.5">Last 24 hours</p>
            </div>
            <Link to="/design/admin/audit">
              <TBtn variant="soft" size="sm">View all</TBtn>
            </Link>
          </div>
          <div className="space-y-1">
            {[
              { actor: 'staff@notonlyhere.com', action: 'suspended user @jordanl', reason: 'Policy violation', time: '2h ago' },
              { actor: 'admin@notonlyhere.com', action: 'approved circle "Grief & Loss"', time: '5h ago' },
              { actor: 'content@notonlyhere.com', action: 'published blog draft', time: '8h ago' },
            ].map((item) => (
              <TListItem
                key={item.action}
                avatar={<TAvatar name={item.actor} size="sm" />}
                title={item.action}
                subtitle={item.actor}
                meta={item.time}
              />
            ))}
          </div>
        </TCard>

        <TCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#14191e]">Safety alerts</h2>
              <p className="text-xs text-[#676a79] mt-0.5">Requires review</p>
            </div>
            <Link to="/design/admin/safety">
              <TBtn variant="soft" size="sm">Open</TBtn>
            </Link>
          </div>
          <div className="space-y-3">
            {safetyAlerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-[#f5f6f8] border border-[#e8eaed]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#14191e]">{alert.type}</p>
                  <TBadge color={alert.status === 'New' ? 'warning' : 'primary'}>{alert.status}</TBadge>
                </div>
                <p className="text-xs text-[#676a79] line-clamp-2">{alert.excerpt}</p>
              </div>
            ))}
          </div>
        </TCard>
      </div>

      <TCard className="mt-4">
        <h2 className="text-base font-bold text-[#14191e] mb-4">Weekly engagement</h2>
        <div className="h-40 flex items-end gap-3">
          {[65, 78, 72, 85, 90, 82, 95].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[#0f6fec]/15 rounded-t-lg relative" style={{ height: `${v}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-[#0f6fec] rounded-t-lg" style={{ height: `${v * 0.7}%` }} />
              </div>
              <span className="text-[10px] font-semibold text-[#a1a5b3]">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
            </div>
          ))}
        </div>
      </TCard>
    </AdminShell>
  );
}

export function AdminUsersScreen() {
  const [tab, setTab] = useState('all');

  return (
    <AdminShell title="Users">
      <PageHeader title="Member directory" subtitle="Search, filter, and manage member accounts" action={<TBtn>Export CSV</TBtn>} />
      <TCard>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <TSearch placeholder="Search by name, email, username..." className="flex-1" />
          <TBtn variant="outline">Filter</TBtn>
        </div>
        <TTabs
          tabs={[
            { id: 'all', label: 'All users' },
            { id: 'active', label: 'Active' },
            { id: 'suspended', label: 'Suspended' },
            { id: 'staff', label: 'Staff' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#676a79] border-b border-[#e8eaed]">
                <th className="py-3 pr-4 font-semibold">Member</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Role</th>
                <th className="py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user, i) => (
                <tr key={user.id} className="border-b border-[#e8eaed] last:border-0 hover:bg-[#f5f6f8]/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <TAvatar src={[images.avatar1, images.avatar2, images.avatar3][i]} name={user.name} size="sm" />
                      <div>
                        <p className="font-semibold text-[#14191e]">{user.name}</p>
                        <p className="text-xs text-[#a1a5b3]">@{user.name.toLowerCase().replace(' ', '')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[#676a79]">{user.email}</td>
                  <td className="py-3 pr-4">
                    <TBadge color={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</TBadge>
                  </td>
                  <td className="py-3 pr-4 text-[#676a79]">{user.role}</td>
                  <td className="py-3 text-right">
                    <Link to="/design/admin/users/detail">
                      <TBtn variant="soft" size="sm">View</TBtn>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TCard>
    </AdminShell>
  );
}

export function AdminUserDetailScreen() {
  return (
    <AdminShell title="User detail">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <TCard>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <TAvatar src={images.avatar2} name="Jordan Lee" size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#14191e]">Jordan Lee</h2>
              <p className="text-sm text-[#676a79]">@jordanl · jordan@example.com</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <TBadge color="danger">Suspended</TBadge>
                <TBadge color="muted">Member</TBadge>
              </div>
            </div>
            <button type="button" className="p-2 rounded-lg hover:bg-[#f5f6f8] text-[#676a79]">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Global role', value: 'Member' },
              { label: 'Circle admin', value: 'Anxiety Support' },
              { label: 'Joined', value: 'January 2025' },
              { label: 'Last active', value: 'Jul 28, 2026' },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-[#f5f6f8]">
                <p className="text-xs font-semibold text-[#a1a5b3] uppercase">{item.label}</p>
                <p className="text-sm font-semibold text-[#14191e] mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <TBtn variant="soft">Restore access</TBtn>
            <TBtn variant="outline">Send warning</TBtn>
            <TBtn variant="danger">Ban member</TBtn>
          </div>
        </TCard>

        <div className="space-y-4">
          <TCard>
            <h3 className="text-sm font-bold text-[#14191e] mb-3">Enforcement history</h3>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d6293e]/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={14} className="text-[#d6293e]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#14191e]">Suspended</p>
                <p className="text-xs text-[#676a79] mt-1">Jul 28, 2026 — Policy violation</p>
                <p className="text-xs text-[#a1a5b3] mt-1">By staff@notonlyhere.com</p>
              </div>
            </div>
          </TCard>

          <TCard>
            <h3 className="text-sm font-bold text-[#14191e] mb-3">Recent activity</h3>
            <div className="space-y-2 text-xs text-[#676a79]">
              <p>Posted in Anxiety Support — Jul 27</p>
              <p>3 comments flagged — Jul 26</p>
              <p>Joined Grief & Loss — Jul 15</p>
            </div>
          </TCard>
        </div>
      </div>
    </AdminShell>
  );
}

export function AdminCirclesScreen() {
  const [tab, setTab] = useState('pending');

  return (
    <AdminShell title="Circles">
      <PageHeader title="Circle management" subtitle="Review submissions and manage communities" />
      <TCard>
        <TTabs
          tabs={[
            { id: 'pending', label: 'Pending (5)' },
            { id: 'active', label: 'Active' },
            { id: 'archived', label: 'Archived' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="space-y-3">
          {['Grief & Loss', 'Work Stress', 'Student Support'].map((name, i) => (
            <div key={name} className="flex items-center gap-4 p-4 rounded-xl border border-[#e8eaed] hover:bg-[#f5f6f8]/50 transition-colors">
              <img src={[images.circleThumb1, images.circleThumb2, images.circleThumb3][i]} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#14191e]">{name}</p>
                <p className="text-xs text-[#676a79] mt-0.5">Submitted 2 days ago · Open · 0 members</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <TBtn variant="outline" size="sm">Review</TBtn>
                <TBtn size="sm">Approve</TBtn>
              </div>
            </div>
          ))}
        </div>
      </TCard>
    </AdminShell>
  );
}

export function AdminSafetyScreen() {
  return (
    <AdminShell title="Safety alerts">
      <PageHeader
        title="Safety queue"
        subtitle="AI-assisted moderation — all actions require human review"
        action={<TBtn variant="outline" size="sm"><Download size={14} className="inline mr-1" />Export</TBtn>}
      />
      <div className="space-y-4">
        {safetyAlerts.map((alert) => (
          <TCard key={alert.id}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f7c32e]/15 flex items-center justify-center shrink-0">
                  <Shield size={18} className="text-[#c9a000]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#14191e]">{alert.type}</p>
                    <TBadge color="warning">{alert.status}</TBadge>
                  </div>
                  <p className="text-xs text-[#676a79] mt-1">{alert.excerpt}</p>
                </div>
              </div>
              <TBadge color="muted">Confidence: {alert.confidence}</TBadge>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f6f8] text-xs text-[#676a79] mb-4">
              <span className="font-semibold text-[#14191e]">AI rationale:</span> Content may violate community guidelines regarding harmful language. Recommend human review before action.
            </div>
            <div className="flex gap-2">
              <TBtn variant="outline" size="sm">Dismiss</TBtn>
              <TBtn variant="soft" size="sm">Escalate</TBtn>
              <TBtn size="sm">Open review</TBtn>
            </div>
          </TCard>
        ))}
      </div>
    </AdminShell>
  );
}

export function AdminContentScreen() {
  const sections = [
    { title: 'Blog', subtitle: '12 drafts · 48 published', icon: FileText, color: 'bg-[#0f6fec]/10 text-[#0f6fec]' },
    { title: 'Resources', subtitle: '6 courses · 24 articles', icon: FileText, color: 'bg-[#0cbc87]/10 text-[#0cbc87]' },
    { title: 'Events', subtitle: '3 upcoming · 12 past', icon: Clock, color: 'bg-[#6610f2]/10 text-[#6610f2]' },
  ];

  return (
    <AdminShell title="Content">
      <PageHeader title="Content management" subtitle="Create, edit, and publish platform content" action={<TBtn>Create new</TBtn>} />
      <div className="grid md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <TCard key={section.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${section.color}`}>
              <section.icon size={20} />
            </div>
            <h3 className="text-base font-bold text-[#14191e]">{section.title}</h3>
            <p className="text-xs text-[#676a79] mt-1 mb-4">{section.subtitle}</p>
            <TBtn size="sm" variant="soft">Manage {section.title.toLowerCase()}</TBtn>
          </TCard>
        ))}
      </div>
    </AdminShell>
  );
}

export function AdminDonationsScreen() {
  return (
    <AdminShell title="Donations">
      <PageHeader title="Donations" subtitle="Stripe payment records and recurring subscriptions" action={<TBtn variant="outline" size="sm"><Download size={14} className="inline mr-1" />Export</TBtn>} />
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Total this month', value: '$2,840' },
          { label: 'Recurring donors', value: '142' },
          { label: 'Pending', value: '3' },
        ].map((kpi) => (
          <TCard key={kpi.label}>
            <p className="text-xs font-semibold text-[#676a79] uppercase">{kpi.label}</p>
            <p className="text-2xl font-bold text-[#14191e] mt-1">{kpi.value}</p>
          </TCard>
        ))}
      </div>
      <TCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#676a79] border-b border-[#e8eaed]">
                <th className="py-3 font-semibold">Donor ref</th>
                <th className="py-3 font-semibold">Amount</th>
                <th className="py-3 font-semibold">Cadence</th>
                <th className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-[#e8eaed] last:border-0 hover:bg-[#f5f6f8]/50">
                  <td className="py-3 font-semibold text-[#14191e]">{d.donor}</td>
                  <td className="py-3 text-[#14191e]">{d.amount}</td>
                  <td className="py-3 text-[#676a79]">{d.cadence}</td>
                  <td className="py-3">
                    <TBadge color={d.status === 'Succeeded' ? 'success' : 'warning'}>{d.status}</TBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TCard>
    </AdminShell>
  );
}

export function AdminAnalyticsScreen() {
  const funnel = [
    { label: 'Visit', value: 100 },
    { label: 'Register', value: 62 },
    { label: 'First post', value: 38 },
    { label: 'Join circle', value: 24 },
  ];

  return (
    <AdminShell title="Analytics">
      <PageHeader title="Growth analytics" subtitle="Funnel, retention, and engagement metrics" action={<TBtn variant="outline" size="sm"><Download size={14} className="inline mr-1" />Export CSV</TBtn>} />
      <TCard className="mb-4">
        <h2 className="text-base font-bold text-[#14191e] mb-1">Growth funnel</h2>
        <p className="text-xs text-[#676a79] mb-6">Visit → Register → First post → Join circle</p>
        <div className="h-48 flex items-end gap-4 px-2">
          {funnel.map((step) => (
            <div key={step.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-[#0f6fec]">{step.value}%</span>
              <div className="w-full bg-[#0f6fec]/15 rounded-t-xl relative" style={{ height: `${step.value}%` }}>
                <div className="absolute inset-x-0 bottom-0 bg-[#0f6fec] rounded-t-xl" style={{ height: '100%' }} />
              </div>
              <span className="text-[10px] font-semibold text-[#676a79] text-center">{step.label}</span>
            </div>
          ))}
        </div>
      </TCard>

      <div className="grid md:grid-cols-2 gap-4">
        <TCard>
          <h2 className="text-base font-bold text-[#14191e] mb-4">Top circles by growth</h2>
          {['Anxiety Support', 'New Parents', 'Grief & Loss'].map((name, i) => (
            <div key={name} className="flex items-center justify-between py-2 border-b border-[#e8eaed] last:border-0">
              <span className="text-sm text-[#14191e]">{name}</span>
              <TBadge color="success">+{[18, 12, 8][i]}%</TBadge>
            </div>
          ))}
        </TCard>
        <TCard>
          <h2 className="text-base font-bold text-[#14191e] mb-4">Retention (30d)</h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full border-8 border-[#0f6fec] flex items-center justify-center">
              <span className="text-xl font-bold text-[#14191e]">68%</span>
            </div>
            <p className="text-sm text-[#676a79]">Members who returned within 30 days of signup</p>
          </div>
        </TCard>
      </div>
    </AdminShell>
  );
}

export function AdminAuditScreen() {
  const entries = [
    { actor: 'staff@notonlyhere.com', action: 'suspended user @jordanl', target: 'Policy violation', time: 'Jul 28, 2026 14:22 UTC', icon: AlertTriangle, color: 'text-[#d6293e]' },
    { actor: 'admin@notonlyhere.com', action: 'approved circle "Grief & Loss"', target: 'Circle moderation', time: 'Jul 27, 2026 09:10 UTC', icon: CheckCircle2, color: 'text-[#0cbc87]' },
    { actor: 'content@notonlyhere.com', action: 'published blog post', target: 'Content', time: 'Jul 26, 2026 16:45 UTC', icon: FileText, color: 'text-[#0f6fec]' },
  ];

  return (
    <AdminShell title="Audit log">
      <PageHeader title="Audit log" subtitle="Immutable record of all admin actions" />
      <TCard>
        <TSearch placeholder="Filter by actor, action, target..." className="mb-4" />
        <div className="space-y-1">
          {entries.map((entry) => (
            <div key={entry.time} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f5f6f8] transition-colors">
              <div className={`w-9 h-9 rounded-lg bg-[#f5f6f8] flex items-center justify-center shrink-0 ${entry.color}`}>
                <entry.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#14191e]">
                  <span className="font-semibold">{entry.actor}</span> {entry.action}
                </p>
                <p className="text-xs text-[#676a79] mt-0.5">{entry.target} · {entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </TCard>
    </AdminShell>
  );
}
