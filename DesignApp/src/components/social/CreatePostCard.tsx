import { Calendar, Image, MoreHorizontal, Smile, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currentUser } from '@/data/mock';

export function CreatePostCard() {
  return (
    <div className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        <Link
          to="/design/app/composer"
          className="flex-1 text-sm text-[#a1a5b3] bg-[#f5f6f8] hover:bg-[#eef0f4] rounded-lg px-4 py-2.5 transition-colors"
        >
          Share your thoughts...
        </Link>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#e8eaed]">
        <div className="flex items-center gap-0.5">
          {[
            { icon: Image, label: 'Photo', color: 'text-[#0cbc87]' },
            { icon: Video, label: 'Video', color: 'text-[#6610f2]' },
            { icon: Calendar, label: 'Event', color: 'text-[#d6293e]' },
            { icon: Smile, label: 'Feeling /Activity', color: 'text-[#f7c32e]' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#676a79] hover:bg-[#f5f6f8] rounded-md px-2.5 py-2 transition-colors"
            >
              <item.icon size={18} className={item.color} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
        <button type="button" className="w-8 h-8 rounded-md flex items-center justify-center text-[#a1a5b3] hover:bg-[#f5f6f8]">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
