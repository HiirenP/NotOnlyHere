import { Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TAvatar, TBtn, TCard } from '@/components/template';
import { circles, conversations, currentUser, friendRequests, suggestedConnections } from '@/data/mock';

export function FeedRightRail() {
  return (
    <aside className="hidden xl:block w-[320px] shrink-0 space-y-4 px-2 py-5 sticky top-0 self-start h-screen overflow-y-auto scrollbar-hide">
      {/* Profile completion */}
      <TCard>
        <h3 className="text-sm font-bold text-[#14191e] mb-3">Update your profile</h3>
        <div className="flex items-center gap-3 mb-3">
          <TAvatar src={currentUser.avatar} name={currentUser.displayName} size="lg" />
          <div className="flex-1">
            <div className="h-2 bg-[#f5f6f8] rounded-full overflow-hidden">
              <div className="h-full w-[72%] bg-[#0f6fec] rounded-full" />
            </div>
            <p className="text-xs text-[#676a79] mt-1">72% complete</p>
          </div>
        </div>
        <TBtn className="w-full" size="sm">Update now</TBtn>
      </TCard>

      {/* Who to follow */}
      <TCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#14191e]">Who to follow</h3>
          <Link to="/design/app/profile" className="text-xs font-semibold text-[#0f6fec]">See all</Link>
        </div>
        <div className="space-y-3">
          {suggestedConnections.map((p) => (
            <div key={p.username} className="flex items-center gap-3">
              <TAvatar src={p.avatar} name={p.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#14191e] truncate">{p.name}</p>
                <p className="text-xs text-[#676a79]">{p.mutual} mutual</p>
              </div>
              <TBtn size="sm" variant="soft">Follow</TBtn>
            </div>
          ))}
        </div>
      </TCard>

      {/* Connection requests */}
      <TCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#14191e]">Connection requests</h3>
          <span className="text-xs font-semibold text-[#0f6fec]">See all</span>
        </div>
        {friendRequests.map((req) => (
          <div key={req.name} className="flex items-center gap-3 py-2">
            <TAvatar src={req.avatar} name={req.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#14191e] truncate">{req.name}</p>
              <p className="text-xs text-[#676a79]">{req.mutual} mutual</p>
            </div>
            <div className="flex gap-1">
              <button type="button" className="w-8 h-8 rounded-lg bg-[#0f6fec] text-white text-sm font-bold">✓</button>
              <button type="button" className="w-8 h-8 rounded-lg bg-[#f5f6f8] text-[#676a79] text-sm">✕</button>
            </div>
          </div>
        ))}
      </TCard>

      {/* Messages */}
      <TCard padding={false}>
        <div className="p-4 border-b border-[#e8eaed] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#14191e]">Messages</h3>
          <Link to="/design/app/messages" className="text-xs font-semibold text-[#0f6fec]">See all</Link>
        </div>
        <div className="p-2">
          {conversations.map((c) => (
            <Link key={c.id} to="/design/app/messages" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f6f8] transition-colors">
              <TAvatar src={c.avatar} name={c.name} online={c.online} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold text-[#14191e] truncate">{c.name}</p>
                  <span className="text-[10px] text-[#a1a5b3]">{c.time}</span>
                </div>
                <p className={`text-xs truncate ${c.unread ? 'font-semibold text-[#14191e]' : 'text-[#676a79]'}`}>{c.preview}</p>
              </div>
              {c.unread && <span className="w-5 h-5 bg-[#d6293e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">1</span>}
            </Link>
          ))}
        </div>
      </TCard>

      {/* Groups */}
      <TCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#14191e]">Groups</h3>
          <Link to="/design/app/circles" className="text-xs font-semibold text-[#0f6fec]">See all</Link>
        </div>
        {circles.filter((c) => c.joined).map((circle) => (
          <Link key={circle.id} to="/design/app/circles/detail" className="flex items-center gap-3 py-2 hover:bg-[#f5f6f8] -mx-2 px-2 rounded-xl transition-colors">
            <img src={circle.thumb} alt="" className="w-9 h-9 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#14191e] truncate">{circle.name}</p>
              <p className="text-xs text-[#676a79] flex items-center gap-1"><Users size={10} /> {circle.members.toLocaleString()}</p>
            </div>
          </Link>
        ))}
        <Link to="/design/app/circles" className="flex items-center justify-center gap-2 w-full mt-3 py-2 border-2 border-dashed border-[#e8eaed] rounded-xl text-sm text-[#676a79] hover:border-[#0f6fec]/30 hover:text-[#0f6fec] transition-colors">
          <Plus size={16} /> Add group
        </Link>
      </TCard>
    </aside>
  );
}

export function GroupCard({ circle }: { circle: (typeof circles)[0] }) {
  return (
    <Link to="/design/app/circles/detail" className="block bg-white border border-[#e8eaed] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-36">
        <img src={circle.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <img src={circle.thumb} alt="" className="absolute bottom-3 left-4 w-14 h-14 rounded-xl border-2 border-white object-cover shadow-lg" />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#14191e] group-hover:text-[#0f6fec] transition-colors">{circle.name}</h3>
        <p className="text-xs text-[#676a79] mt-1">{circle.members.toLocaleString()} members · {circle.posts24h} posts/day</p>
        <p className="text-xs text-[#676a79] mt-2 line-clamp-2">{circle.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase px-2 py-1 bg-[#f5f6f8] text-[#676a79] rounded-md">{circle.access}</span>
          <span className={`text-xs font-bold px-4 py-1.5 rounded-lg ${circle.joined ? 'bg-[#f5f6f8] text-[#676a79]' : 'bg-[#0f6fec] text-white'}`}>
            {circle.joined ? 'Joined' : 'Join'}
          </span>
        </div>
      </div>
    </Link>
  );
}
