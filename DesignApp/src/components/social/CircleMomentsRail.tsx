import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CircleHighlight } from '@/data/mock';
import { circleHighlights, currentUser, images } from '@/data/mock';

const storyImages = [images.postNature, images.avatar2, images.postGroup, images.avatar3, images.postCoffee];

function StoryCard({ item, index }: { item: CircleHighlight; index: number }) {
  if (item.isYours) {
    return (
      <button type="button" className="relative shrink-0 w-[110px] h-[170px] rounded-2xl overflow-hidden group">
        <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent text-left">
          <div className="w-7 h-7 rounded-full bg-[#0f6fec] border-2 border-white flex items-center justify-center mb-1">
            <Plus size={14} className="text-white" />
          </div>
          <span className="text-white text-[11px] font-semibold">Create story</span>
        </div>
      </button>
    );
  }
  const storyImg = storyImages[index % storyImages.length];
  return (
    <Link to="/design/app/circles/detail" className="relative shrink-0 w-[110px] h-[170px] rounded-2xl overflow-hidden group">
      <div className={`absolute inset-0 p-[2.5px] rounded-2xl ${item.hasNew ? 'bg-gradient-to-b from-[#0f6fec] to-[#6610f2]' : 'bg-[#d0d3d9]'}`}>
        <div className="w-full h-full rounded-[14px] overflow-hidden">
          <img src={storyImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <img src={item.thumb} alt="" className="w-7 h-7 rounded-full border-2 border-white mb-1 object-cover" />
        <span className="text-white text-[11px] font-semibold block truncate">{item.name}</span>
      </div>
    </Link>
  );
}

export function CircleMomentsRail() {
  return (
    <div className="bg-white border border-[#e8eaed] rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {circleHighlights.map((item, i) => (
          <StoryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
