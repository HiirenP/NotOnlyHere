import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CircleHighlight } from '@/data/mock';
import { circleHighlights, images } from '@/data/mock';

const storyImages = [images.postNature, images.avatar2, images.postGroup, images.avatar3, images.postCoffee];

function StoryCard({ item, index }: { item: CircleHighlight; index: number }) {
  if (item.isYours) {
    return (
      <button type="button" className="relative shrink-0 w-[100px] h-[160px] rounded-lg overflow-hidden group border-2 border-dashed border-[#d0d3d9] bg-[#f5f6f8]">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
          <div className="w-8 h-8 rounded-full bg-[#0f6fec] flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-[#676a79] text-center leading-tight">Post a Story</span>
        </div>
      </button>
    );
  }

  const storyImg = storyImages[index % storyImages.length];
  return (
    <Link to="/design/app/circles/detail" className="relative shrink-0 w-[100px] h-[160px] rounded-lg overflow-hidden group">
      <img src={storyImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-2 pointer-events-none">
        <span className="text-white text-[11px] font-semibold block truncate drop-shadow-sm">{item.name}</span>
      </div>
      {item.hasNew && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-[#0f6fec] rounded-full border border-white" />
      )}
    </Link>
  );
}

export function CircleMomentsRail() {
  return (
    <div className="mb-4">
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {circleHighlights.map((item, i) => (
          <StoryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
