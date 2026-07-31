import { Link } from 'react-router-dom';
import { TAvatar, TCard } from '@/components/template';
import { suggestedConnections, todaysNews } from '@/data/mock';

export function FeedRightRail() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 space-y-4 sticky top-[86px] self-start max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
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

      <TCard className="!rounded-lg">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">Today&apos;s news</h3>
        <div className="space-y-4">
          {todaysNews.map((item) => (
            <Link key={item.id} to="/design/app/explore" className="flex gap-3 group">
              <img src={item.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" loading="lazy" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#14191e] group-hover:text-[#0f6fec] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-xs text-[#a1a5b3] mt-1">{item.time}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/design/app/explore" className="block mt-4 text-sm font-semibold text-[#0f6fec] hover:underline">
          View all latest news
        </Link>
      </TCard>
    </aside>
  );
}

export { GroupCard } from './GroupCard';
