import { Bell, MessageCircle, Plus, Search, UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { circles, conversations, currentUser, friendRequests } from '@/data/mock';

export function FeedRightRail() {
  return (
    <aside className="hidden xl:block w-[320px] shrink-0 space-y-4 sticky top-6 self-start">
      {/* Top quick actions — Pickbook style */}
      <div className="flex items-center justify-end gap-2">
        <Link to="/design/app/profile" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-background-200 shadow-sm text-foreground-600 hover:bg-background-100 transition-colors" title="Add connection">
          <UserPlus size={18} />
        </Link>
        <Link to="/design/app/messages" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-background-200 shadow-sm text-foreground-600 hover:bg-background-100 transition-colors relative" title="Messages">
          <MessageCircle size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
        </Link>
        <Link to="/design/app/notifications" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-background-200 shadow-sm text-foreground-600 hover:bg-background-100 transition-colors relative" title="Notifications">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
        </Link>
        <Link to="/design/app/profile" className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-background-200 shadow-sm">
          <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
        </Link>
      </div>

      {/* Profile completion widget */}
      <div className="card-elevated p-5">
        <h3 className="text-sm font-semibold text-foreground-900 mb-4">Update your profile</h3>
        <div className="flex items-center gap-4">
          <img src={currentUser.avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-accent-200" />
          <div className="flex-1">
            <div className="h-2 bg-background-200 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[72%] bg-gradient-to-r from-accent-500 to-primary-500 rounded-full" />
            </div>
            <p className="text-xs text-foreground-500">72% complete</p>
          </div>
        </div>
        <Link to="/design/app/settings" className="block w-full mt-4 text-center gradient-btn text-white text-sm font-semibold py-2.5 rounded-xl">
          Update now
        </Link>
      </div>

      {/* Connection requests */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground-900">Connection requests</h3>
          <Link to="/design/app/settings" className="text-xs font-semibold text-accent-600 hover:underline">See all</Link>
        </div>
        <div className="space-y-4">
          {friendRequests.map((req) => (
            <div key={req.name} className="flex items-center gap-3">
              <img src={req.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground-900 truncate">{req.name}</p>
                <p className="text-xs text-foreground-500">{req.mutual} mutual connections</p>
              </div>
              <div className="flex gap-1.5">
                <button type="button" className="w-8 h-8 rounded-lg bg-accent-500 text-white flex items-center justify-center hover:bg-accent-600 transition-colors text-lg leading-none">✓</button>
                <button type="button" className="w-8 h-8 rounded-lg bg-background-200 text-foreground-600 flex items-center justify-center hover:bg-background-300 transition-colors text-lg leading-none">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages preview */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground-900">Messages</h3>
          <Link to="/design/app/messages" className="text-xs font-semibold text-accent-600 hover:underline">See all</Link>
        </div>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400" />
          <input className="w-full text-xs bg-background-100 border border-background-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-200" placeholder="Search messages" />
        </div>
        <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-hide">
          {conversations.map((c) => (
            <Link key={c.id} to="/design/app/messages" className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-background-100 transition-colors">
              <div className="relative shrink-0">
                <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium text-foreground-900 truncate">{c.name}</p>
                  <span className="text-[10px] text-foreground-400 shrink-0 ml-1">{c.time}</span>
                </div>
                <p className={`text-xs truncate ${c.unread ? 'text-foreground-900 font-medium' : 'text-foreground-500'}`}>{c.preview}</p>
              </div>
              {c.unread && <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">1</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Groups / Circles */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground-900">Your circles</h3>
          <Link to="/design/app/circles" className="text-xs font-semibold text-accent-600 hover:underline">See all</Link>
        </div>
        <div className="space-y-2">
          {circles.filter((c) => c.joined).map((circle) => (
            <Link key={circle.id} to="/design/app/circles/detail" className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-background-100 transition-colors">
              <img src={circle.thumb} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground-900 truncate">{circle.name}</p>
                <p className="text-xs text-foreground-500 flex items-center gap-1"><Users size={10} /> {circle.members.toLocaleString()} members</p>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/design/app/circles" className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 border-2 border-dashed border-background-300 rounded-xl text-sm text-foreground-500 hover:border-accent-300 hover:text-accent-600 transition-colors">
          <Plus size={16} />
          Add circle
        </Link>
      </div>
    </aside>
  );
}

export function GroupCard({ circle }: { circle: (typeof circles)[0] }) {
  return (
    <Link to="/design/app/circles/detail" className="block card-elevated overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-32 overflow-hidden">
        <img src={circle.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <img src={circle.thumb} alt="" className="absolute bottom-3 left-4 w-14 h-14 rounded-2xl border-2 border-white object-cover shadow-lg" />
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground-900 group-hover:text-accent-600 transition-colors">{circle.name}</h3>
        <p className="text-xs text-foreground-500 mt-1 flex items-center gap-2">
          <Users size={12} /> {circle.members.toLocaleString()} members · {circle.posts24h} posts/day
        </p>
        <p className="text-xs text-foreground-600 mt-2 line-clamp-2 leading-relaxed">{circle.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-background-100 text-foreground-600 rounded-full">{circle.access}</span>
          <span className={`text-xs font-semibold px-4 py-2 rounded-xl ${circle.joined ? 'bg-background-100 text-foreground-700' : 'gradient-btn text-white'}`}>
            {circle.joined ? 'Joined' : 'Join'}
          </span>
        </div>
      </div>
    </Link>
  );
}
