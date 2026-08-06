import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { useState } from 'react';
import { DesignLink } from '@/design/navigation';
import type { FeedPost } from '@/design/data/mock';

function PostImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`bg-gradient-to-br from-[#0f6fec]/10 to-[#6610f2]/10 flex items-center justify-center text-xs text-[#676a79] font-medium ${className ?? ''}`}>
        Image unavailable
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ImageGrid({ images: imgs }: { images: NonNullable<FeedPost['images']> }) {
  if (imgs.length === 1) {
    return <PostImage src={imgs[0].src} alt="" className="w-full max-h-[420px] object-cover rounded-lg" />;
  }
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
      {imgs.slice(0, 4).map((img, i) => (
        <div key={i} className={`relative ${imgs.length === 3 && i === 0 ? 'row-span-2' : 'aspect-square'}`}>
          <PostImage src={img.src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

type PostCardProps = {
  post: FeedPost;
  showCommentInput?: boolean;
  viewerAvatar?: string;
  viewerName?: string;
  onReact?: (postId: string, liked: boolean) => void | Promise<void>;
  onComment?: (postId: string, body: string) => void | Promise<void>;
};

export function PostCard({
  post,
  showCommentInput = true,
  viewerAvatar,
  viewerName,
  onReact,
  onComment,
}: PostCardProps) {
  const [comment, setComment] = useState('');
  const [reacting, setReacting] = useState(false);
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [reactionCount, setReactionCount] = useState(post.reactions);

  async function toggleLike() {
    if (!onReact || reacting) return;
    setReacting(true);
    const next = !liked;
    try {
      await onReact(post.id, next);
      setLiked(next);
      setReactionCount((c) => Math.max(0, c + (next ? 1 : -1)));
    } finally {
      setReacting(false);
    }
  }

  async function submitComment() {
    if (!onComment || !comment.trim()) return;
    await onComment(post.id, comment.trim());
    setComment('');
  }

  const profileHref = post.anonymous ? undefined : `/app/profile/${post.username}`;

  return (
    <article className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden mb-4">
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          {post.anonymous ? (
            <div className="w-10 h-10 rounded-full bg-[#6610f2]/15 text-[#6610f2] flex items-center justify-center font-bold text-sm">?</div>
          ) : (
            <img src={post.avatar} alt="" className="w-10 h-10 rounded-full object-cover" loading="lazy" />
          )}
          <div>
            {profileHref ? (
              <DesignLink href={profileHref} className="text-sm font-bold text-[#14191e] hover:text-[#0f6fec] transition-colors">
                {post.author}
              </DesignLink>
            ) : (
              <span className="text-sm font-bold text-[#14191e]">{post.author}</span>
            )}
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

      <div className="px-4 pb-3">
        <p className="text-sm text-[#14191e] leading-relaxed">{post.content}</p>
        {post.anonymous && (
          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-[#6610f2]/10 text-[#6610f2] rounded uppercase">
            Anonymous
          </span>
        )}
      </div>

      {post.images && post.images.length > 0 && (
        <div className="px-4 pb-3">
          <ImageGrid images={post.images} />
        </div>
      )}

      <div className="px-4 py-2 flex items-center gap-4 border-t border-[#e8eaed]">
        <button
          type="button"
          disabled={!onReact || reacting}
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            liked ? 'text-[#0f6fec]' : 'text-[#676a79] hover:text-[#0f6fec]'
          }`}
        >
          <Heart size={14} className={liked ? 'fill-[#0f6fec]' : ''} />
          Liked ({reactionCount})
        </button>
        <DesignLink
          href={`/app/post/${post.id}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#676a79] hover:text-[#0f6fec] transition-colors"
        >
          <MessageCircle size={14} />
          Comments ({post.comments})
        </DesignLink>
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

      {post.topComments && post.topComments.length > 0 && (
        <div className="px-4 py-3 border-t border-[#e8eaed] space-y-3 bg-[#fafbfc]">
          {post.topComments.map((c) => (
            <div key={`${c.author}-${c.text}`} className="text-sm">
              <span className="font-bold text-[#14191e]">{c.author}</span>{' '}
              <span className="text-[#676a79]">{c.text}</span>
            </div>
          ))}
        </div>
      )}

      {showCommentInput && onComment && (
        <div className="px-4 py-3 border-t border-[#e8eaed] flex items-center gap-3">
          {viewerAvatar ? (
            <img src={viewerAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#0f6fec]/10 shrink-0" />
          )}
          <input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitComment()}
            className="flex-1 text-sm bg-[#f5f6f8] border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:bg-white focus:border-[#0f6fec]/30"
          />
        </div>
      )}
    </article>
  );
}
