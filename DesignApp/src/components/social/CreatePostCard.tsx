import { FileText, Image, MapPin, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currentUser } from '@/data/mock';

export function CreatePostCard() {
  return (
    <div className="bg-white border border-[#e8eaed] rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <img src={currentUser.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
        <Link to="/design/app/composer" className="flex-1 text-sm text-[#a1a5b3] bg-[#f5f6f8] hover:bg-[#eef0f4] rounded-xl px-4 py-3 transition-colors border border-transparent hover:border-[#e8eaed]">
          Share your thoughts, photos, or feelings...
        </Link>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#e8eaed]">
        <div className="flex items-center gap-1">
          {[
            { icon: Image, label: 'Photo', color: 'text-[#0cbc87]' },
            { icon: Smile, label: 'Feeling', color: 'text-[#f7c32e]' },
            { icon: MapPin, label: 'Event', color: 'text-[#d6293e]' },
            { icon: FileText, label: 'Article', color: 'text-[#0f6fec]' },
          ].map((item) => (
            <button key={item.label} type="button" className="flex items-center gap-1.5 text-xs font-semibold text-[#676a79] hover:bg-[#f5f6f8] rounded-lg px-3 py-2 transition-colors">
              <item.icon size={18} className={item.color} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
        <Link to="/design/app/composer" className="bg-[#0f6fec] hover:bg-[#0d5ed4] text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors">
          Post
        </Link>
      </div>
    </div>
  );
}
