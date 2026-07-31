import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FeedPost } from '@/data/mock';
import { currentUser } from '@/data/mock';

function ImageGrid({ images }: { images: NonNullable<FeedPost['images']> }) {
  if (images.length === 1) {
    return <img src={images[0].src} alt={images[0].alt} className="w-full max-h-[420px] object-cover rounded-lg" loading="lazy" />;
  }
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className={`relative ${images.length === 3 && i === 0 ? 'row-span-2' : 'aspect-square'}`}>
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export function PostCard({ post, showCommentInput = true }: { post: FeedPost; showCommentInput?: boolean }) {
  return (
    <article className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          {post.anonymous ? (
            <div className="w-10 h-10 rounded-full bg-[#6610f2]/15 text-[#6610f2] flex items-center justify-center font-bold text-sm">?</div>
          ) : (
            <img src={post.avatar} alt="" className="w-10 h-10 rounded-full object-cover" loading="lazy" />
          )}
          <div>
            <Link to="/design/app/profile" className="text-sm font-bold text-[#14191e] hover:text-[#0f6fec] transition-colors">
              {post.author}
            </Link>
            <p className="text-xs text-[#a1a5b3]">
              {post.time} ago
              {!post.anonymous && post.jobTitle && (
                <>
                  <span className="mx-1">·</span>
                  <span className="text-[#676a79]">{post.jobTitle}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <button type="button" className="w-8 h-8 rounded-md flex items-center justify-center text-[#a1a5b3] hover:bg-[#f5f6f8]">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#14191e] leading-relaxed">{post.content}</p>
        {post.anonymous && (
          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-[#6610f2]/10 text-[#6610f2] rounded uppercase">
            Anonymous
          </span>
        )}
      </div>

      {/* Media */}
      {post.images && post.images.length > 0 && (
        <div className="px-4 pb-3">
          <ImageGrid images={post.images} />
        </div>
      )}

      {/* Interaction links — Stackbros style */}
      <div className="px-4 py-2 flex items-center gap-4 border-t border-[#e8eaed]">
        <button
          type="button"
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            post.liked ? 'text-[#0f6fec]' : 'text-[#676a79] hover:text-[#0f6fec]'
          }`}
        >
          <Heart size={14} className={post.liked ? 'fill-[#0f6fec]' : ''} />
          Liked ({post.reactions})
        </button>
        <Link
          to="/design/app/post"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#676a79] hover:text-[#0f6fec] transition-colors"
        >
          <MessageCircle size={14} />
          Comments ({post.comments})
        </Link>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#676a79] hover:text-[#0f6fec] transition-colors"
        >
          <Send size={14} />
          Share ({post.shares})
        </button>
        <button type="button" className="ml-auto w-8 h-8 rounded-md flex items-center justify-center text-[#a1a5b3] hover:bg-[#f5f6f8]">
          <Bookmark size={16} />
        </button>
      </div>

      {/* Existing comments preview */}
      {post.topComments && post.topComments.length > 0 && (
        <div className="px-4 py-3 border-t border-[#e8eaed] space-y-3 bg-[#fafbfc]">
          {post.topComments.map((c) => (
            <div key={c.author} className="text-sm">
              <span className="font-bold text-[#14191e]">{c.author}</span>{' '}
              <span className="text-[#676a79]">{c.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Comment input */}
      {showCommentInput && (
        <div className="px-4 py-3 border-t border-[#e8eaed] flex items-center gap-3">
          <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
          <input
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-[#f5f6f8] border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:bg-white focus:border-[#0f6fec]/30"
          />
        </div>
      )}
    </article>
  );
}
