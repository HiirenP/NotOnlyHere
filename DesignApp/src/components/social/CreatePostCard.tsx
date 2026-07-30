import { Image, Smile, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currentUser } from '@/data/mock';

export function CreatePostCard() {
  return (
    <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3">
        <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
        <Link
          to="/design/app/composer"
          className="flex-1 font-mono text-sm text-foreground-500 bg-background-200/60 hover:bg-background-200 rounded-full px-5 py-3 transition-colors"
        >
          Share what feels comfortable, Alex...
        </Link>
      </div>
      <div className="flex items-center justify-around mt-3 pt-3 border-t border-background-200">
        <button type="button" className="flex items-center gap-2 font-mono text-xs text-foreground-600 hover:bg-background-200 rounded-lg px-4 py-2 transition-colors">
          <Image size={18} className="text-primary-600" />
          Photo
        </button>
        <button type="button" className="flex items-center gap-2 font-mono text-xs text-foreground-600 hover:bg-background-200 rounded-lg px-4 py-2 transition-colors">
          <Users size={18} className="text-accent-600" />
          Circle
        </button>
        <button type="button" className="flex items-center gap-2 font-mono text-xs text-foreground-600 hover:bg-background-200 rounded-lg px-4 py-2 transition-colors">
          <Smile size={18} className="text-warning-500" />
          Mood
        </button>
      </div>
    </div>
  );
}
