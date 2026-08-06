'use client';

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Plus,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { DesignLink } from '@/design/navigation';
import {
  AdminStatCard,
  AdminTabs,
  DataTable,
  DonutChart,
  HorizontalBar,
  LineChart,
  ProgressRing,
  type Column,
} from '@/design/components/admin';
import { TAvatar, TBadge, TBtn, TCard } from '@/design/components/template';
import {
  adminCircles,
  adminContentItems,
  adminUsers,
  auditLog,
  donations,
  safetyAlerts,
} from '@/design/data/mock';
import { AdminShell } from '@/design/layouts/Shells';

const chartData = [
  { label: 'Jan', values: [120, 80, 40] },
  { label: 'Feb', values: [180, 100, 55] },
  { label: 'Mar', values: [220, 130, 70] },
  { label: 'Apr', values: [280, 160, 90] },
  { label: 'May', values: [340, 200, 110] },
  { label: 'Jun', values: [400, 240, 130] },
  { label: 'Jul', values: [480, 290, 150] },
];

export function AdminDashboardScreen() {
  const [tab, setTab] = useState('overview');

  return (
    <AdminShell
      title="Community Dashboard"
      subtitle="Monitor growth, engagement, and platform health"
      action={
        <div className="flex gap-2">
          <select className="text-sm bg-white border border-[#e8eaed] rounded-xl px-3 py-2 text-[#676a79]">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <TBtn variant="outline" size="sm"><Filter size={14} className="inline mr-1" />Filter</TBtn>
        </div>
      }
    >
      <AdminTabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'engagement', label: 'Engagement' },
          { id: 'audiences', label: 'Audiences' },
          { id: 'safety', label: 'Safety' },
          { id: 'network', label: 'Network' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <AdminStatCard label="Engagement" value="384,425" change="12.5%" changeType="up" compareText="vs last month" icon={Activity} iconBg="bg-[#0f6fec]/10 text-[#0f6fec]" />
        <AdminStatCard label="Profile views" value="82,640" change="8.2%" changeType="up" compareText="vs last month" icon={Users} iconBg="bg-[#0cbc87]/10 text-[#0cbc87]" />
        <AdminStatCard label="Impressions" value="1.2M" change="3.1%" changeType="down" compareText="vs last month" icon={Eye} iconBg="bg-[#6610f2]/10 text-[#6610f2]" />
        <AdminStatCard label="Account reach" value="542,180" change="15.8%" changeType="up" compareText="vs last month" icon={TrendingUp} iconBg="bg-[#e91e8c]/10 text-[#e91e8c]" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <TCard className="!rounded-2xl">
              <h3 className="text-sm font-bold text-[#14191e] mb-1">Visit by device</h3>
              <p className="text-xs text-[#676a79] mb-4">Total page visits</p>
              <div className="space-y-3">
                <HorizontalBar label="Mobile" value={48} max={100} color="#0f6fec" />
                <HorizontalBar label="Web" value={32} max={100} color="#6610f2" />
                <HorizontalBar label="Tablet" value={20} max={100} color="#0cbc87" />
              </div>
            </TCard>
            <TCard className="!rounded-2xl">
              <h3 className="text-sm font-bold text-[#14191e] mb-4">Audience age</h3>
              <div className="flex justify-between">
                <ProgressRing value={12} label="13–17" color="#0f6fec" />
                <ProgressRing value={38} label="18–24" color="#6610f2" />
                <ProgressRing value={28} label="25–34" color="#e91e8c" />
                <ProgressRing value={15} label="35–44" color="#0cbc87" />
                <ProgressRing value={7} label="45+" color="#f7c32e" />
              </div>
            </TCard>
          </div>

          <TCard className="!rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#14191e]">Audience growth</h3>
                <p className="text-xs text-[#676a79] mt-0.5">Organic vs paid signups</p>
              </div>
              <TBtn variant="soft" size="sm">Export</TBtn>
            </div>
            <LineChart
              data={chartData}
              lines={[
                { key: 0, color: '#6610f2', label: 'Organic signups' },
                { key: 1, color: '#e91e8c', label: 'Paid campaigns' },
                { key: 2, color: '#0f6fec', label: 'Circle joins' },
              ]}
            />
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#e8eaed]">
              {[
                { label: 'Organic signups', value: '+8,523', up: true },
                { label: 'Paid signups', value: '+1,240', up: true },
                { label: 'Churned', value: '-342', up: false },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xs text-[#676a79]">{s.label}</p>
                  <p className={`text-sm font-bold mt-1 flex items-center gap-1 ${s.up ? 'text-[#0cbc87]' : 'text-[#d6293e]'}`}>
                    {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </TCard>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <TCard className="!rounded-2xl">
            <h3 className="text-sm font-bold text-[#14191e] mb-4">Top locations</h3>
            <div className="space-y-3 mb-4">
              {[
                { country: 'United States', pct: 42 },
                { country: 'United Kingdom', pct: 18 },
                { country: 'Canada', pct: 12 },
                { country: 'Australia', pct: 8 },
              ].map((loc) => (
                <HorizontalBar key={loc.country} label={loc.country} value={loc.pct} max={50} color="#0f6fec" />
              ))}
            </div>
          </TCard>

          <TCard className="!rounded-2xl">
            <h3 className="text-sm font-bold text-[#14191e] mb-1">Followers</h3>
            <p className="text-2xl font-bold text-[#14191e] mt-2">+8,523</p>
            <p className="text-xs text-[#0cbc87] font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight size={12} /> 12.5% this month
            </p>
            <div className="flex items-end gap-1 h-16 mt-4">
              {[40, 55, 45, 70, 60, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-[#0f6fec]/20 rounded-t" style={{ height: `${h}%` }}>
                  <div className="w-full bg-[#0f6fec] rounded-t" style={{ height: '60%' }} />
                </div>
              ))}
            </div>
          </TCard>

          <TCard className="!rounded-2xl">
            <h3 className="text-sm font-bold text-[#14191e] mb-4">Visitor profile</h3>
            <DonutChart
              segments={[
                { label: 'Female', value: 52, color: '#e91e8c' },
                { label: 'Male', value: 44, color: '#0f6fec' },
                { label: 'Other', value: 4, color: '#a1a5b3' },
              ]}
              centerValue="48%"
              centerLabel="Female"
            />
          </TCard>

          <TCard className="!rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#14191e]">Safety queue</h3>
              <DesignLink href="/admin/safety" className="text-xs font-semibold text-[#0f6fec]">View all</DesignLink>
            </div>
            {safetyAlerts.filter((a) => a.status === 'New').slice(0, 2).map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-[#f5f6f8] mb-2 last:mb-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[#14191e]">{alert.type}</p>
                  <TBadge color={alert.priority === 'Critical' ? 'danger' : 'warning'}>{alert.priority}</TBadge>
                </div>
                <p className="text-[10px] text-[#676a79] mt-1 line-clamp-1">{alert.excerpt}</p>
              </div>
            ))}
          </TCard>
        </div>
      </div>
    </AdminShell>
  );
}

export function AdminUsersScreen() {
  const columns: Column<(typeof adminUsers)[0]>[] = [
    {
      key: 'name',
      label: 'Member',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-3">
          <TAvatar src={r.avatar} name={r.name} size="sm" />
          <div>
            <p className="font-semibold text-[#14191e]">{r.name}</p>
            <p className="text-xs text-[#a1a5b3]">@{r.username}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', sortable: true, sortValue: (r) => r.email, render: (r) => <span className="text-[#676a79]">{r.email}</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <TBadge color={r.status === 'Active' ? 'success' : r.status === 'Suspended' ? 'danger' : 'warning'}>{r.status}</TBadge>
      ),
    },
    { key: 'role', label: 'Role', sortable: true, sortValue: (r) => r.role, render: (r) => <span className="text-[#676a79]">{r.role}</span> },
    { key: 'posts', label: 'Posts', sortable: true, sortValue: (r) => r.posts, render: (r) => <span className="font-semibold text-[#14191e]">{r.posts}</span> },
    { key: 'lastActive', label: 'Last active', sortable: true, sortValue: (r) => r.lastActive, render: (r) => <span className="text-xs text-[#a1a5b3]">{r.lastActive}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-1">
          <DesignLink href="/admin/users/detail"><TBtn variant="soft" size="sm"><Eye size={12} /></TBtn></DesignLink>
          <TBtn variant="outline" size="sm"><Edit size={12} /></TBtn>
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title="Users"
      subtitle="Search, filter, sort, and manage member accounts"
      action={
        <div className="flex gap-2">
          <TBtn variant="outline" size="sm"><Download size={14} className="inline mr-1" />Export</TBtn>
          <TBtn size="sm"><UserPlus size={14} className="inline mr-1" />Add user</TBtn>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={adminUsers}
        rowKey={(r) => r.id}
        searchKeys={['name', 'email', 'username', 'role']}
        searchPlaceholder="Search by name, email, username, role..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'Active', label: 'Active' },
              { value: 'Suspended', label: 'Suspended' },
              { value: 'Pending', label: 'Pending' },
            ],
            filterFn: (r, v) => r.status === v,
          },
          {
            id: 'role',
            label: 'Role',
            options: [
              { value: 'Member', label: 'Member' },
              { value: 'Staff', label: 'Staff' },
              { value: 'Circle Admin', label: 'Circle Admin' },
              { value: 'Super Admin', label: 'Super Admin' },
            ],
            filterFn: (r, v) => r.role === v,
          },
        ]}
        pageSize={6}
        bulkActions={[
          { id: 'suspend', label: 'Suspend selected', variant: 'danger' },
          { id: 'export', label: 'Export selected' },
        ]}
        onRowAction={() => {}}
      />
    </AdminShell>
  );
}

export function AdminUserDetailScreen() {
  const user = adminUsers[1];
  return (
    <AdminShell
      title="User detail"
      subtitle={`@${user.username} · ${user.email}`}
      action={
        <div className="flex gap-2">
          <TBtn variant="outline" size="sm"><Edit size={14} className="inline mr-1" />Edit</TBtn>
          <TBtn variant="danger" size="sm"><Trash2 size={14} className="inline mr-1" />Delete</TBtn>
        </div>
      }
    >
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <TCard className="!rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
            <TAvatar src={user.avatar} name={user.name} size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#14191e]">{user.name}</h2>
              <p className="text-sm text-[#676a79]">@{user.username} · {user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <TBadge color="danger">{user.status}</TBadge>
                <TBadge color="muted">{user.role}</TBadge>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Posts', value: user.posts },
              { label: 'Joined', value: user.joined },
              { label: 'Last active', value: user.lastActive },
              { label: 'Circles', value: '2' },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-[#f5f6f8] text-center">
                <p className="text-lg font-bold text-[#14191e]">{item.value}</p>
                <p className="text-[10px] text-[#676a79] font-semibold uppercase mt-1">{item.label}</p>
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
          <TCard className="!rounded-2xl">
            <h3 className="text-sm font-bold text-[#14191e] mb-3">Enforcement history</h3>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d6293e]/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={14} className="text-[#d6293e]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#14191e]">Suspended</p>
                <p className="text-xs text-[#676a79] mt-1">Jul 28, 2026 — Policy violation</p>
              </div>
            </div>
          </TCard>
          <TCard className="!rounded-2xl">
            <h3 className="text-sm font-bold text-[#14191e] mb-3">Quick actions</h3>
            <div className="space-y-2">
              {['Reset password', 'Change role', 'View posts', 'View messages'].map((a) => (
                <button key={a} type="button" className="w-full text-left text-sm font-semibold text-[#676a79] hover:text-[#0f6fec] px-3 py-2 rounded-lg hover:bg-[#f5f6f8] transition-colors">{a}</button>
              ))}
            </div>
          </TCard>
        </div>
      </div>
    </AdminShell>
  );
}

export function AdminCirclesScreen() {
  const columns: Column<(typeof adminCircles)[0]>[] = [
    {
      key: 'name',
      label: 'Circle',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-3">
          <img src={r.thumb} alt="" className="w-10 h-10 rounded-lg object-cover" />
          <p className="font-semibold text-[#14191e]">{r.name}</p>
        </div>
      ),
    },
    { key: 'members', label: 'Members', sortable: true, sortValue: (r) => r.members, render: (r) => <span>{r.members.toLocaleString()}</span> },
    { key: 'access', label: 'Access', sortable: true, sortValue: (r) => r.access, render: (r) => <TBadge color="muted">{r.access}</TBadge> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => (
        <TBadge color={r.status === 'Active' ? 'success' : r.status === 'Pending' ? 'warning' : 'muted'}>{r.status}</TBadge>
      ),
    },
    { key: 'submitted', label: 'Submitted', sortable: true, sortValue: (r) => r.submitted, render: (r) => <span className="text-xs text-[#a1a5b3]">{r.submitted}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-1">
          {r.status === 'Pending' ? (
            <>
              <TBtn size="sm">Approve</TBtn>
              <TBtn variant="outline" size="sm">Reject</TBtn>
            </>
          ) : (
            <>
              <TBtn variant="soft" size="sm"><Eye size={12} /></TBtn>
              <TBtn variant="outline" size="sm"><Edit size={12} /></TBtn>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title="Circles"
      subtitle="Review, approve, and manage peer-support communities"
      action={<TBtn size="sm"><Plus size={14} className="inline mr-1" />Create circle</TBtn>}
    >
      <DataTable
        columns={columns}
        data={adminCircles}
        rowKey={(r) => r.id}
        searchKeys={['name', 'status', 'access']}
        searchPlaceholder="Search circles..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { value: 'Active', label: 'Active' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Archived', label: 'Archived' },
            ],
            filterFn: (r, v) => r.status === v,
          },
        ]}
        pageSize={5}
        bulkActions={[{ id: 'approve', label: 'Approve selected' }, { id: 'archive', label: 'Archive selected', variant: 'danger' }]}
        onRowAction={() => {}}
      />
    </AdminShell>
  );
}

export function AdminSafetyScreen() {
  const columns: Column<(typeof safetyAlerts)[0]>[] = [
    { key: 'type', label: 'Type', sortable: true, sortValue: (r) => r.type, render: (r) => <span className="font-semibold text-[#14191e]">{r.type}</span> },
    { key: 'excerpt', label: 'Summary', render: (r) => <span className="text-xs text-[#676a79] line-clamp-1 max-w-xs">{r.excerpt}</span> },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      sortValue: (r) => r.priority,
      render: (r) => <TBadge color={r.priority === 'Critical' ? 'danger' : r.priority === 'High' ? 'warning' : 'muted'}>{r.priority}</TBadge>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <TBadge color={r.status === 'New' ? 'warning' : r.status === 'In review' ? 'primary' : 'muted'}>{r.status}</TBadge>,
    },
    { key: 'confidence', label: 'Confidence', sortable: true, sortValue: (r) => r.confidence, render: (r) => <span className="text-[#676a79]">{r.confidence}</span> },
    { key: 'reported', label: 'Reported', sortable: true, sortValue: (r) => r.reported, render: (r) => <span className="text-xs text-[#a1a5b3]">{r.reported}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-1">
          <TBtn size="sm">Review</TBtn>
          <TBtn variant="outline" size="sm">Dismiss</TBtn>
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title="Safety alerts"
      subtitle="AI-assisted moderation queue — all actions require human review"
      action={<TBtn variant="outline" size="sm"><Download size={14} className="inline mr-1" />Export</TBtn>}
    >
      <div className="grid sm:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'New', value: safetyAlerts.filter((a) => a.status === 'New').length, color: 'text-[#f7c32e]' },
          { label: 'In review', value: safetyAlerts.filter((a) => a.status === 'In review').length, color: 'text-[#0f6fec]' },
          { label: 'Critical', value: safetyAlerts.filter((a) => a.priority === 'Critical').length, color: 'text-[#d6293e]' },
          { label: 'Dismissed', value: safetyAlerts.filter((a) => a.status === 'Dismissed').length, color: 'text-[#676a79]' },
        ].map((kpi) => (
          <TCard key={kpi.label} className="!rounded-2xl text-center">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-[#676a79] mt-1">{kpi.label}</p>
          </TCard>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={safetyAlerts}
        rowKey={(r) => r.id}
        searchKeys={['type', 'excerpt', 'reporter']}
        searchPlaceholder="Search alerts..."
        filters={[
          { id: 'status', label: 'Status', options: [{ value: 'New', label: 'New' }, { value: 'In review', label: 'In review' }, { value: 'Dismissed', label: 'Dismissed' }], filterFn: (r, v) => r.status === v },
          { id: 'priority', label: 'Priority', options: [{ value: 'Critical', label: 'Critical' }, { value: 'High', label: 'High' }, { value: 'Medium', label: 'Medium' }, { value: 'Low', label: 'Low' }], filterFn: (r, v) => r.priority === v },
        ]}
        pageSize={5}
        bulkActions={[{ id: 'dismiss', label: 'Dismiss selected' }, { id: 'escalate', label: 'Escalate selected' }]}
        onRowAction={() => {}}
      />
    </AdminShell>
  );
}

export function AdminContentScreen() {
  const columns: Column<(typeof adminContentItems)[0]>[] = [
    { key: 'title', label: 'Title', sortable: true, sortValue: (r) => r.title, render: (r) => <span className="font-semibold text-[#14191e]">{r.title}</span> },
    { key: 'type', label: 'Type', sortable: true, sortValue: (r) => r.type, render: (r) => <TBadge color="muted">{r.type}</TBadge> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <TBadge color={r.status === 'Published' ? 'success' : r.status === 'Draft' ? 'warning' : 'primary'}>{r.status}</TBadge>,
    },
    { key: 'author', label: 'Author', render: (r) => <span className="text-xs text-[#676a79]">{r.author}</span> },
    { key: 'views', label: 'Views', sortable: true, sortValue: (r) => r.views, render: (r) => <span className="font-semibold">{r.views.toLocaleString()}</span> },
    { key: 'updated', label: 'Updated', sortable: true, sortValue: (r) => r.updated, render: (r) => <span className="text-xs text-[#a1a5b3]">{r.updated}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-1">
          <TBtn variant="soft" size="sm"><Eye size={12} /></TBtn>
          <TBtn variant="outline" size="sm"><Edit size={12} /></TBtn>
          <TBtn variant="danger" size="sm"><Trash2 size={12} /></TBtn>
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title="Content management"
      subtitle="Create, edit, publish, and delete platform content"
      action={<TBtn size="sm"><Plus size={14} className="inline mr-1" />Create new</TBtn>}
    >
      <DataTable
        columns={columns}
        data={adminContentItems}
        rowKey={(r) => r.id}
        searchKeys={['title', 'type', 'author', 'status']}
        searchPlaceholder="Search content..."
        filters={[
          { id: 'type', label: 'Type', options: [{ value: 'Blog', label: 'Blog' }, { value: 'Article', label: 'Article' }, { value: 'Event', label: 'Event' }, { value: 'Resource', label: 'Resource' }], filterFn: (r, v) => r.type === v },
          { id: 'status', label: 'Status', options: [{ value: 'Published', label: 'Published' }, { value: 'Draft', label: 'Draft' }, { value: 'Scheduled', label: 'Scheduled' }], filterFn: (r, v) => r.status === v },
        ]}
        pageSize={5}
        bulkActions={[{ id: 'publish', label: 'Publish selected' }, { id: 'delete', label: 'Delete selected', variant: 'danger' }]}
        onRowAction={() => {}}
      />
    </AdminShell>
  );
}

export function AdminDonationsScreen() {
  const columns: Column<(typeof donations)[0]>[] = [
    { key: 'donor', label: 'Donor', sortable: true, sortValue: (r) => r.donor, render: (r) => <span className="font-semibold text-[#14191e]">{r.donor}</span> },
    { key: 'email', label: 'Email', render: (r) => <span className="text-xs text-[#676a79]">{r.email}</span> },
    { key: 'amount', label: 'Amount', sortable: true, sortValue: (r) => r.amount, render: (r) => <span className="font-bold text-[#14191e]">${r.amount.toFixed(2)}</span> },
    { key: 'cadence', label: 'Cadence', sortable: true, sortValue: (r) => r.cadence, render: (r) => <span className="text-[#676a79]">{r.cadence}</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <TBadge color={r.status === 'Succeeded' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'}>{r.status}</TBadge>,
    },
    { key: 'date', label: 'Date', sortable: true, sortValue: (r) => r.date, render: (r) => <span className="text-xs text-[#a1a5b3]">{r.date}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-1">
          <TBtn variant="soft" size="sm"><Eye size={12} /></TBtn>
          <TBtn variant="outline" size="sm">Refund</TBtn>
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title="Donations"
      subtitle="Stripe payment records and recurring subscriptions"
      action={<TBtn variant="outline" size="sm"><Download size={14} className="inline mr-1" />Export CSV</TBtn>}
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <AdminStatCard label="Total this month" value="$2,840" change="18%" changeType="up" icon={TrendingUp} iconBg="bg-[#0cbc87]/10 text-[#0cbc87]" />
        <AdminStatCard label="Recurring donors" value="142" change="5%" changeType="up" icon={Users} iconBg="bg-[#0f6fec]/10 text-[#0f6fec]" />
        <AdminStatCard label="Failed payments" value="3" change="2" changeType="down" icon={Clock} iconBg="bg-[#d6293e]/10 text-[#d6293e]" />
      </div>
      <DataTable
        columns={columns}
        data={donations}
        rowKey={(r) => r.id}
        searchKeys={['donor', 'email', 'status']}
        searchPlaceholder="Search donations..."
        filters={[
          { id: 'status', label: 'Status', options: [{ value: 'Succeeded', label: 'Succeeded' }, { value: 'Pending', label: 'Pending' }, { value: 'Failed', label: 'Failed' }], filterFn: (r, v) => r.status === v },
          { id: 'cadence', label: 'Cadence', options: [{ value: 'Monthly', label: 'Monthly' }, { value: 'One-time', label: 'One-time' }, { value: 'Annual', label: 'Annual' }], filterFn: (r, v) => r.cadence === v },
        ]}
        pageSize={5}
        onRowAction={() => {}}
      />
    </AdminShell>
  );
}

export function AdminAnalyticsScreen() {
  const [tab, setTab] = useState('growth');
  return (
    <AdminShell title="Analytics" subtitle="Growth funnel, retention, and engagement metrics">
      <AdminTabs
        tabs={[
          { id: 'growth', label: 'Growth' },
          { id: 'retention', label: 'Retention' },
          { id: 'engagement', label: 'Engagement' },
          { id: 'circles', label: 'Circles' },
        ]}
        active={tab}
        onChange={setTab}
        rightAction={<TBtn variant="outline" size="sm"><Download size={14} className="inline mr-1" />Export CSV</TBtn>}
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <AdminStatCard label="Total signups" value="12,840" change="22%" changeType="up" compareText="vs last quarter" icon={UserPlus} iconBg="bg-[#0f6fec]/10 text-[#0f6fec]" />
        <AdminStatCard label="Active members" value="8,420" change="15%" changeType="up" compareText="30-day active" icon={Users} iconBg="bg-[#0cbc87]/10 text-[#0cbc87]" />
        <AdminStatCard label="Posts created" value="48,290" change="9%" changeType="up" compareText="vs last quarter" icon={FileText} iconBg="bg-[#6610f2]/10 text-[#6610f2]" />
        <AdminStatCard label="Retention (30d)" value="68%" change="4%" changeType="up" compareText="vs last quarter" icon={Activity} iconBg="bg-[#e91e8c]/10 text-[#e91e8c]" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <TCard className="!rounded-2xl">
          <h3 className="text-sm font-bold text-[#14191e] mb-4">Growth funnel</h3>
          <div className="h-48 flex items-end gap-4">
            {[
              { label: 'Visit', value: 100 },
              { label: 'Register', value: 62 },
              { label: 'First post', value: 38 },
              { label: 'Join circle', value: 24 },
            ].map((step) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-[#0f6fec]">{step.value}%</span>
                <div className="w-full bg-[#0f6fec]/15 rounded-t-xl" style={{ height: `${step.value}%` }}>
                  <div className="w-full h-full bg-[#0f6fec] rounded-t-xl opacity-80" />
                </div>
                <span className="text-[10px] font-semibold text-[#676a79]">{step.label}</span>
              </div>
            ))}
          </div>
        </TCard>
        <TCard className="!rounded-2xl">
          <h3 className="text-sm font-bold text-[#14191e] mb-4">Top circles by growth</h3>
          {['Anxiety Support', 'New Parents', 'Grief & Loss', 'Work Stress'].map((name, i) => (
            <HorizontalBar key={name} label={name} value={[42, 28, 18, 12][i]} max={50} color={['#0f6fec', '#6610f2', '#e91e8c', '#0cbc87'][i]} />
          ))}
        </TCard>
      </div>
    </AdminShell>
  );
}

export function AdminAuditScreen() {
  const columns: Column<(typeof auditLog)[0]>[] = [
    { key: 'actor', label: 'Actor', sortable: true, sortValue: (r) => r.actor, render: (r) => <span className="font-semibold text-[#14191e]">{r.actor}</span> },
    { key: 'action', label: 'Action', sortable: true, sortValue: (r) => r.action, render: (r) => <span className="text-[#676a79]">{r.action}</span> },
    { key: 'target', label: 'Target', render: (r) => <span className="text-sm text-[#14191e]">{r.target}</span> },
    { key: 'category', label: 'Category', sortable: true, sortValue: (r) => r.category, render: (r) => <TBadge color="muted">{r.category}</TBadge> },
    { key: 'time', label: 'Timestamp', sortable: true, sortValue: (r) => r.time, render: (r) => <span className="text-xs text-[#a1a5b3]">{r.time}</span> },
  ];

  return (
    <AdminShell title="Audit log" subtitle="Immutable record of all admin actions">
      <DataTable
        columns={columns}
        data={auditLog}
        rowKey={(r) => r.id}
        searchKeys={['actor', 'action', 'target', 'category']}
        searchPlaceholder="Filter by actor, action, target..."
        filters={[
          {
            id: 'category',
            label: 'Category',
            options: [
              { value: 'Enforcement', label: 'Enforcement' },
              { value: 'Moderation', label: 'Moderation' },
              { value: 'Content', label: 'Content' },
              { value: 'Safety', label: 'Safety' },
              { value: 'Users', label: 'Users' },
              { value: 'Analytics', label: 'Analytics' },
            ],
            filterFn: (r, v) => r.category === v,
          },
        ]}
        pageSize={6}
        selectable={false}
      />
    </AdminShell>
  );
}
