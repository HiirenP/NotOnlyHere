import { Globe, Heart, MessageCircle, MoreHorizontal, Share2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FeedPost } from '@/data/mock';

function AudienceIcon({ audience }: { audience: string }) {
  if (audience === 'Circle') return <Users size={12} />;
  return <Globe size={12} />;
}

function ImageGrid({ images }: { images: NonNullable<FeedPost['images']> }) {
  if (images.length === 1) {
    return (
      <div className="rounded-xl overflow-hidden border border-background-200">
        <img src={images[0].src} alt={images[0].alt} className="w-full max-h-[480px] object-cover" />
      </div>
    );
  }
  return (
    <div className={`grid gap-1 rounded-xl overflow-hidden ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className={`relative ${images.length === 3 && i === 0 ? 'row-span-2' : ''}`}>
          <img src={img.src} alt={img.alt} className="w-full h-full min-h-[160px] object-cover" />
        </div>
      ))}
    </div>
  );
}

export function PostCard({ post, showComments = true }: { post: FeedPost; showComments?: boolean }) {
  return (
    <article className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden mb-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {post.anonymous ? (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-200 to-accent-400 flex items-center justify-center shrink-0">
              <span className="font-mono text-sm text-accent-800">?</span>
            </div>
          ) : (
            <img src={post.avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-background-200 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to="/design/app/profile" className="font-mono text-sm font-medium text-foreground-900 hover:underline truncate">
                {post.author}
              </Link>
              {post.anonymous && (
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-accent-100 text-accent-700 rounded-full">Anonymous</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground-500">
              <Link to="/design/app/circles/detail" className="hover:underline">{post.circle}</Link>
              <span>·</span>
              <span>{post.time}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><AudienceIcon audience={post.audience} /> {post.audience}</span>
            </div>
          </div>
        </div>
        <button type="button" className="w-9 h-9 rounded-full flex items-center justify-center text-foreground-500 hover:bg-background-200 transition-colors shrink-0" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="font-mono text-sm text-foreground-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="px-4 pb-3">
          <ImageGrid images={post.images} />
        </div>
      )}

      {/* Reaction summary */}
      <div className="px-4 py-2 flex items-center justify-between text-foreground-500">
        <div className="flex items-center gap-1.5">
          <span className="flex -space-x-1">
            <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-[10px]">💙</span>
            <span className="w-5 h-5 rounded-full bg-accent-400 flex items-center justify-center text-[10px]">🤗</span>
          </span>
          <span className="font-mono text-xs hover:underline cursor-pointer">{post.reactions}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <Link to="/design/app/post" className="hover:underline">{post.comments} comments</Link>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action bar */}
      <div className="mx-4 border-t border-background-200 flex items-center">
        <button type="button" className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-background-200 rounded-lg ${post.liked ? 'text-primary-600' : 'text-foreground-600'}`}>
          <Heart size={18} className={post.liked ? 'fill-primary-500' : ''} />
          Support
        </button>
        <Link to="/design/app/post" className="flex-1 flex items-center justify-center gap-2 py-3 font-mono text-xs uppercase tracking-wider text-foreground-600 hover:bg-background-200 rounded-lg transition-colors">
          <MessageCircle size={18} />
          Comment
        </Link>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 font-mono text-xs uppercase tracking-wider text-foreground-600 hover:bg-background-200 rounded-lg transition-colors">
          <Share2 size={18} />
          Share
        </button>
      </div>

      {/* Comment preview */}
      {showComments && post.topComments && post.topComments.length > 0 && (
        <div className="px-4 py-3 bg-background-50/50 border-t border-background-200 space-y-2">
          {post.topComments.map((c, i) => (
            <p key={i} className="font-mono text-xs text-foreground-700">
              <strong className="text-foreground-900">{c.author}</strong> {c.text}
            </p>
          ))}
          <Link to="/design/app/post" className="font-mono text-xs text-foreground-500 hover:underline">View all {post.comments} comments</Link>
        </div>
      )}
    </article>
  );
}
