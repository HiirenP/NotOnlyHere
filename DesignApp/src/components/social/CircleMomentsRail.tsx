import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CircleHighlight } from '@/data/mock';
import { circleHighlights } from '@/data/mock';

function StoryCard({ item }: { item: CircleHighlight }) {
  if (item.isYours) {
    return (
      <button type="button" className="relative shrink-0 w-[100px] h-[160px] rounded-lg overflow-hidden group border-2 border-dashed border-[#d0d3d9] bg-[#f5f6f8]">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-9 h-9 rounded-full bg-[#0f6fec] flex items-center justify-center shadow-md">
            <Plus size={18} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-[#676a79] text-center leading-tight">Share moment</span>
        </div>
      </button>
    );
  }

  return (
    <Link to="/design/app/circles/detail" className="relative shrink-0 w-[100px] h-[160px] rounded-lg overflow-hidden group ring-2 ring-[#0f6fec]/40 ring-offset-1">
      <img src={item.storyImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute top-2 left-2">
        <img src={item.thumb} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm" loading="lazy" />
      </div>
      <div className="absolute bottom-0 inset-x-0 p-2 pointer-events-none">
        <span className="text-white text-[11px] font-semibold block truncate drop-shadow-sm">{item.name}</span>
      </div>
      {item.hasNew && (
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#0f6fec] rounded-full border-2 border-white" />
      )}
    </Link>
  );
}

export function CircleMomentsRail() {
  return (
    <div className="mb-4">
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {circleHighlights.map((item) => (
          <StoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
