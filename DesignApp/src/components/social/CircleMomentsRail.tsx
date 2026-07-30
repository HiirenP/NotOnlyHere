import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CircleHighlight } from '@/data/mock';
import { circleHighlights } from '@/data/mock';
import { currentUser } from '@/data/mock';

function HighlightItem({ item }: { item: CircleHighlight }) {
  if (item.isYours) {
    return (
      <button type="button" className="flex flex-col items-center gap-2 shrink-0 w-[76px] group">
        <div className="relative w-[68px] h-[68px] rounded-full p-[3px] bg-gradient-to-br from-primary-400 via-accent-400 to-primary-500">
          <div className="w-full h-full rounded-full bg-background-100 flex items-center justify-center overflow-hidden border-2 border-background-50">
            <img src={currentUser.avatar} alt="" className="w-full h-full object-cover opacity-80" />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary-500 border-2 border-background-50 flex items-center justify-center">
              <Plus size={14} className="text-background-50" />
            </div>
          </div>
        </div>
        <span className="font-mono text-[10px] text-foreground-700 text-center leading-tight truncate w-full">Your moment</span>
      </button>
    );
  }

  return (
    <Link to={`/design/app/circles/detail`} className="flex flex-col items-center gap-2 shrink-0 w-[76px] group">
      <div className={`relative w-[68px] h-[68px] rounded-full p-[3px] ${item.hasNew ? 'bg-gradient-to-br from-primary-400 via-accent-400 to-primary-500' : 'bg-background-300'}`}>
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-background-50">
          <img src={item.thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      </div>
      <span className="font-mono text-[10px] text-foreground-700 text-center leading-tight truncate w-full">{item.name}</span>
    </Link>
  );
}

export function CircleMomentsRail() {
  return (
    <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-4 mb-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-600">Circle moments</h2>
        <span className="font-mono text-[10px] text-foreground-400">Updates from your circles</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {circleHighlights.map((item) => (
          <HighlightItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
