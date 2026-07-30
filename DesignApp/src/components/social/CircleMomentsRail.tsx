import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CircleHighlight } from '@/data/mock';
import { circleHighlights } from '@/data/mock';
import { currentUser, images } from '@/data/mock';

const storyImages = [
  images.postNature,
  images.avatar2,
  images.postGroup,
  images.avatar3,
  images.postCoffee,
];

function StoryCard({ item, index }: { item: CircleHighlight; index: number }) {
  if (item.isYours) {
    return (
      <button type="button" className="relative shrink-0 w-[108px] h-[168px] rounded-2xl overflow-hidden group">
        <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
          <div className="w-8 h-8 rounded-full bg-accent-500 border-2 border-white flex items-center justify-center mb-1">
            <Plus size={16} className="text-white" />
          </div>
          <span className="text-white text-[11px] font-medium leading-tight block">Create moment</span>
        </div>
      </button>
    );
  }

  const storyImg = storyImages[index % storyImages.length];
  return (
    <Link to="/design/app/circles/detail" className="relative shrink-0 w-[108px] h-[168px] rounded-2xl overflow-hidden group">
      <div className={`absolute inset-0 p-[2px] rounded-2xl ${item.hasNew ? 'bg-gradient-to-b from-accent-500 via-primary-400 to-primary-500' : 'bg-background-300'}`}>
        <div className="w-full h-full rounded-[14px] overflow-hidden">
          <img src={storyImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none">
        <img src={item.thumb} alt="" className="w-7 h-7 rounded-full border-2 border-white mb-1 object-cover" />
        <span className="text-white text-[11px] font-medium leading-tight block truncate">{item.name}</span>
      </div>
    </Link>
  );
}

export function CircleMomentsRail() {
  return (
    <div className="card-elevated p-4 mb-4">
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {circleHighlights.map((item, i) => (
          <StoryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
