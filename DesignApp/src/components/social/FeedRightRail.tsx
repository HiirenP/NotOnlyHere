import { Link } from 'react-router-dom';
import { TAvatar, TCard } from '@/components/template';
import { circles, suggestedConnections, todaysNews } from '@/data/mock';

export function FeedRightRail() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 space-y-4 sticky top-[86px] self-start max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
      {/* Who to follow */}
      <TCard className="!rounded-lg">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">Suggested connections</h3>
        <div className="space-y-4">
          {suggestedConnections.map((p) => (
            <div key={p.username} className="flex items-center gap-3">
              <TAvatar src={p.avatar} name={p.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#14191e] truncate">{p.name}</p>
                <p className="text-xs text-[#676a79] truncate">{p.mutual} mutual connections</p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#0f6fec]/10 hover:bg-[#0f6fec] text-[#0f6fec] hover:text-white transition-colors shrink-0"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="w-full mt-4 py-2 text-sm font-semibold text-[#676a79] hover:text-[#0f6fec] border border-[#e8eaed] rounded-md hover:border-[#0f6fec]/30 transition-colors">
          View more
        </button>
      </TCard>

      {/* Today's news */}
      <TCard className="!rounded-lg">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">Today&apos;s news</h3>
        <div className="space-y-4">
          {todaysNews.map((item) => (
            <Link key={item.id} to="/design/app/explore" className="block group">
              <p className="text-sm font-semibold text-[#14191e] group-hover:text-[#0f6fec] transition-colors leading-snug">
                {item.title}
              </p>
              <p className="text-xs text-[#a1a5b3] mt-1">{item.time}</p>
            </Link>
          ))}
        </div>
        <Link
          to="/design/app/explore"
          className="block mt-4 text-sm font-semibold text-[#0f6fec] hover:underline"
        >
          View all latest news
        </Link>
      </TCard>
    </aside>
  );
}

export function GroupCard({ circle }: { circle: (typeof circles)[0] }) {
  return (
    <Link
      to="/design/app/circles/detail"
      className="block bg-white border border-[#e8eaed] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-md transition-all group"
    >
      <div className="relative h-36">
        <img src={circle.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <img
          src={circle.thumb}
          alt=""
          className="absolute bottom-3 left-4 w-14 h-14 rounded-lg border-2 border-white object-cover shadow-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#14191e] group-hover:text-[#0f6fec] transition-colors">{circle.name}</h3>
        <p className="text-xs text-[#676a79] mt-1">
          {circle.members.toLocaleString()} members · {circle.posts24h} posts/day
        </p>
        <p className="text-xs text-[#676a79] mt-2 line-clamp-2">{circle.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase px-2 py-1 bg-[#f5f6f8] text-[#676a79] rounded-md">{circle.access}</span>
          <span
            className={`text-xs font-bold px-4 py-1.5 rounded-md ${
              circle.joined ? 'bg-[#f5f6f8] text-[#676a79]' : 'bg-[#0f6fec] text-white'
            }`}
          >
            {circle.joined ? 'Joined' : 'Join'}
          </span>
        </div>
      </div>
    </Link>
  );
}
