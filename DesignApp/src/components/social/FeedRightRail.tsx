import { Link } from 'react-router-dom';
import { HeartHandshake, Sparkles, Users } from 'lucide-react';
import { TAvatar, TCard } from '@/components/template';
import { suggestedPeople, todaysCommunity } from '@/data/mock';
import { AvaPromptCard, EncouragementPromptCard } from './FeedPrompts';
import { FoundingMemberBadge } from './FoundingMemberBadge';

const communityIcons = [Users, HeartHandshake, Sparkles, Users];

export function FeedRightRail() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 space-y-4">
      <AvaPromptCard />
      <EncouragementPromptCard />

      <TCard className="!rounded-lg">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">People to welcome</h3>
        <div className="space-y-4">
          {suggestedPeople.map((p) => (
            <div key={p.username} className="flex items-center gap-3">
              <TAvatar src={p.avatar} name={p.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#14191e] truncate flex items-center gap-1">
                  <span className="truncate">{p.name}</span>
                  {p.foundingMember && <FoundingMemberBadge compact />}
                </p>
                <p className="text-xs text-[#676a79] truncate">Also in {p.sharedCircle}</p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#0f6fec]/10 hover:bg-[#0f6fec] text-[#0f6fec] hover:text-white transition-colors shrink-0"
              >
                Welcome
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="w-full mt-4 py-2 text-sm font-semibold text-[#676a79] hover:text-[#0f6fec] border border-[#e8eaed] rounded-md hover:border-[#0f6fec]/30 transition-colors">
          View more
        </button>
      </TCard>

      <TCard className="!rounded-lg">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">Today&apos;s Community</h3>
        <div className="space-y-4">
          {todaysCommunity.map((item, index) => {
            const Icon = communityIcons[index % communityIcons.length];
            return (
              <Link key={item.id} to={item.to} className="flex gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-[#0f6fec]/10 text-[#0f6fec] flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#14191e] group-hover:text-[#0f6fec] transition-colors leading-snug">
                    {item.text}
                  </p>
                  <p className="text-xs text-[#a1a5b3] mt-1">{item.meta}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <Link to="/design/app/circles" className="block mt-4 text-sm font-semibold text-[#0f6fec] hover:underline">
          Explore Circles
        </Link>
      </TCard>
    </aside>
  );
}

export { GroupCard } from './GroupCard';
