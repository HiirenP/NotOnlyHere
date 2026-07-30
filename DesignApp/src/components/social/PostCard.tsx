import { AtSign, Bookmark, Heart, Image, MessageCircle, MoreHorizontal, Send, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FeedPost } from '@/data/mock';
import { currentUser } from '@/data/mock';

function formatReactions(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function ImageGrid({ images }: { images: NonNullable<FeedPost['images']> }) {
  if (images.length === 1) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-background-100">
        <img src={images[0].src} alt={images[0].alt} className="w-full max-h-[420px] object-cover" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden">
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className={`relative ${images.length === 3 && i === 0 ? 'row-span-2' : 'aspect-square'}`}>
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
          {images.length > 4 && i === 3 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold">
              +{images.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function PostCard({ post, showCommentInput = true }: { post: FeedPost; showCommentInput?: boolean }) {
  return (
    <article className="card-elevated overflow-hidden mb-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {post.anonymous ? (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shrink-0 text-white font-semibold">?</div>
          ) : (
            <img src={post.avatar} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
          )}
          <div className="min-w-0">
            <Link to="/design/app/profile" className="text-sm font-semibold text-foreground-950 hover:underline block truncate">
              {post.author}
            </Link>
            <p className="text-xs text-foreground-500">{post.time} ago · {post.circle}</p>
          </div>
        </div>
        <button type="button" className="w-9 h-9 rounded-full flex items-center justify-center text-foreground-400 hover:bg-background-100 transition-colors" aria-label="More">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Caption */}
      <div className="px-5 pb-4">
        <p className="text-sm text-foreground-800 leading-relaxed">{post.content}</p>
        {post.anonymous && (
          <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-accent-100 text-accent-700 rounded-full">Anonymous</span>
        )}
      </div>

      {/* Media */}
      {post.images && post.images.length > 0 && (
        <div className="px-5 pb-4">
          <ImageGrid images={post.images} />
        </div>
      )}

      {/* Stats row — reference style */}
      <div className="px-5 py-3 flex items-center justify-between border-t border-background-100">
        <div className="flex items-center gap-2">
          <span className="flex -space-x-1">
            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">❤️</span>
            <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">👍</span>
            <span className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-[10px]">🤗</span>
          </span>
          <span className="text-xs text-foreground-600">
            <strong className="font-semibold text-foreground-800">{formatReactions(post.reactions)}</strong> Likes
            <span className="mx-1.5 text-foreground-300">•</span>
            <Link to="/design/app/post" className="hover:underline"><strong className="font-semibold text-foreground-800">{post.comments}</strong> Comments</Link>
          </span>
        </div>
        <span className="text-xs text-foreground-500">{post.shares} Shares</span>
      </div>

      {/* Action bar */}
      <div className="px-5 py-2 flex items-center justify-between border-t border-background-100">
        <div className="flex items-center flex-1">
          <button type="button" className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-colors hover:bg-background-100 ${post.liked ? 'text-red-500' : 'text-foreground-600'}`}>
            <Heart size={20} className={post.liked ? 'fill-red-500' : ''} />
            Like
          </button>
          <Link to="/design/app/post" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-foreground-600 hover:bg-background-100 transition-colors">
            <MessageCircle size={20} />
            Comment
          </Link>
          <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-foreground-600 hover:bg-background-100 transition-colors">
            <Send size={20} />
            Share
          </button>
        </div>
        <button type="button" className="w-10 h-10 flex items-center justify-center text-foreground-500 hover:bg-background-100 rounded-xl transition-colors ml-1" aria-label="Save">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Inline comment input — reference style */}
      {showCommentInput && (
        <div className="px-5 py-4 border-t border-background-100 flex items-center gap-3">
          <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Write your comment..."
              className="w-full text-sm text-foreground-800 bg-background-100 border border-background-200 rounded-full pl-4 pr-24 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:border-transparent"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button type="button" className="w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-foreground-600 rounded-full"><Smile size={16} /></button>
              <button type="button" className="w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-foreground-600 rounded-full"><AtSign size={16} /></button>
              <button type="button" className="w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-foreground-600 rounded-full"><Image size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
