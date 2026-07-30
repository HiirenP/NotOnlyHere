import { FileText, Image, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import { currentUser } from '@/data/mock';

export function CreatePostCard() {
  return (
    <div className="card-elevated p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <img src={currentUser.avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-background-200" />
        <Link
          to="/design/app/composer"
          className="flex-1 text-sm text-foreground-400 bg-background-100 hover:bg-background-200 rounded-full px-5 py-3 transition-colors border border-background-200"
        >
          What do you want to share today?
        </Link>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-background-200">
        <div className="flex items-center gap-1">
          <button type="button" className="flex items-center gap-2 text-sm text-foreground-600 hover:bg-background-100 rounded-xl px-3 py-2 transition-colors">
            <Image size={20} className="text-primary-500" />
            Photo
          </button>
          <button type="button" className="flex items-center gap-2 text-sm text-foreground-600 hover:bg-background-100 rounded-xl px-3 py-2 transition-colors">
            <Smile size={20} className="text-warning-500" />
            Mood
          </button>
          <button type="button" className="flex items-center gap-2 text-sm text-foreground-600 hover:bg-background-100 rounded-xl px-3 py-2 transition-colors">
            <FileText size={20} className="text-accent-500" />
            Resource
          </button>
        </div>
        <Link
          to="/design/app/composer"
          className="gradient-btn text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          Post
        </Link>
      </div>
    </div>
  );
}

export function FeedSearchBar() {
  return (
    <div className="relative mb-4">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <Link
        to="/design/app/search"
        className="block w-full text-sm text-foreground-400 bg-white border border-background-200 rounded-2xl pl-12 pr-4 py-3.5 shadow-sm hover:border-background-300 transition-colors"
      >
        Search anything
      </Link>
    </div>
  );
}
