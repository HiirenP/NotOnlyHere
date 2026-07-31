import { AtSign, Bookmark, Heart, Image, MessageCircle, MoreHorizontal, Send, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FeedPost } from '@/data/mock';
import { currentUser } from '@/data/mock';

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function ImageGrid({ images }: { images: NonNullable<FeedPost['images']> }) {
  if (images.length === 1) {
    return <img src={images[0].src} alt={images[0].alt} className="w-full max-h-[400px] object-cover rounded-xl" />;
  }
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
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
    <article className="bg-white border border-[#e8eaed] rounded-2xl shadow-sm overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {post.anonymous ? (
            <div className="w-11 h-11 rounded-full bg-[#6610f2]/15 text-[#6610f2] flex items-center justify-center font-bold">?</div>
          ) : (
            <img src={post.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
          )}
          <div>
            <Link to="/design/app/profile" className="text-sm font-bold text-[#14191e] hover:underline">{post.author}</Link>
            <p className="text-xs text-[#676a79]">{post.time} ago · {post.circle}</p>
          </div>
        </div>
        <button type="button" className="w-9 h-9 rounded-lg flex items-center justify-center text-[#a1a5b3] hover:bg-[#f5f6f8]"><MoreHorizontal size={18} /></button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm text-[#14191e] leading-relaxed">{post.content}</p>
        {post.anonymous && <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-[#6610f2]/10 text-[#6610f2] rounded-md uppercase">Anonymous</span>}
      </div>

      {/* Media */}
      {post.images && post.images.length > 0 && <div className="px-4 pb-3"><ImageGrid images={post.images} /></div>}

      {/* Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between border-t border-[#f5f6f8]">
        <div className="flex items-center gap-2">
          <span className="flex -space-x-1">
            {['❤️', '👍', '🤗'].map((e, i) => <span key={i} className="w-5 h-5 rounded-full bg-[#f5f6f8] flex items-center justify-center text-[9px]">{e}</span>)}
          </span>
          <span className="text-xs text-[#676a79]">
            <strong className="text-[#14191e]">{formatCount(post.reactions)}</strong> Likes
            <span className="mx-1.5">·</span>
            <strong className="text-[#14191e]">{post.comments}</strong> Comments
          </span>
        </div>
        <span className="text-xs text-[#676a79]">{post.shares} Shares</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-1 flex items-center border-t border-[#f5f6f8]">
        <div className="flex flex-1">
          <button type="button" className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#f5f6f8] transition-colors ${post.liked ? 'text-[#d6293e]' : 'text-[#676a79]'}`}>
            <Heart size={18} className={post.liked ? 'fill-[#d6293e]' : ''} /> Like
          </button>
          <Link to="/design/app/post" className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#676a79] rounded-lg hover:bg-[#f5f6f8] transition-colors">
            <MessageCircle size={18} /> Comment
          </Link>
          <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#676a79] rounded-lg hover:bg-[#f5f6f8] transition-colors">
            <Send size={18} /> Share
          </button>
        </div>
        <button type="button" className="w-10 h-10 flex items-center justify-center text-[#676a79] hover:bg-[#f5f6f8] rounded-lg"><Bookmark size={18} /></button>
      </div>

      {/* Comment input */}
      {showCommentInput && (
        <div className="px-4 py-3 border-t border-[#f5f6f8] flex items-center gap-3">
          <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div className="flex-1 relative">
            <input placeholder="Write your comment..." className="w-full text-sm bg-[#f5f6f8] border border-[#e8eaed] rounded-full pl-4 pr-20 py-2.5 focus:outline-none focus:border-[#0f6fec]/30 focus:ring-2 focus:ring-[#0f6fec]/10" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex">
              <button type="button" className="w-7 h-7 flex items-center justify-center text-[#a1a5b3] hover:text-[#676a79]"><Smile size={15} /></button>
              <button type="button" className="w-7 h-7 flex items-center justify-center text-[#a1a5b3] hover:text-[#676a79]"><AtSign size={15} /></button>
              <button type="button" className="w-7 h-7 flex items-center justify-center text-[#a1a5b3] hover:text-[#676a79]"><Image size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
