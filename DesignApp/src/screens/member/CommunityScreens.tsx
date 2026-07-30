import { SegmentedControl } from '@/design-system';
import { CircleMomentsRail, CreatePostCard, FeedSearchBar, PostCard } from '@/components/social';
import { feedPosts } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';

export function FeedScreen() {
  return (
    <MemberShell showRightRail>
      <FeedSearchBar />
      <CircleMomentsRail />
      <CreatePostCard />
      {feedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <button type="button" className="w-full py-3 text-sm font-medium text-foreground-500 hover:bg-white rounded-2xl transition-colors">
        Load more posts
      </button>
    </MemberShell>
  );
}

export function ComposerScreen() {
  return (
    <MemberShell title="Create post" showRightRail={false}>
      <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-background-200 flex items-center gap-3">
          <img src="https://readdy.ai/api/search-image?query=Friendly%20young%20woman%20portrait%20warm%20smile%20natural%20light%20headshot&width=200&height=200&seq=avatar-1&orientation=squarish" alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-mono text-sm text-foreground-900">Alex Morgan</p>
            <button type="button" className="font-mono text-[11px] text-foreground-500 flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-background-200 rounded-md">
              Members ▾
            </button>
          </div>
        </div>
        <textarea
          className="w-full min-h-48 font-mono text-base p-4 bg-transparent focus:outline-none resize-none placeholder:text-foreground-400"
          placeholder="Share what feels comfortable..."
          autoFocus
        />
        <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-background-200">
          <img src="https://readdy.ai/api/search-image?query=Morning%20walk%20in%20nature%20peaceful%20path%20trees%20soft%20light&width=800&height=500&seq=compose-preview&orientation=landscape" alt="Attached preview" className="w-full max-h-64 object-cover" />
        </div>
        <div className="px-4 py-3 border-t border-background-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-500">Add to post:</span>
            {['📷', '😊', '👥', '📍'].map((emoji) => (
              <button key={emoji} type="button" className="w-9 h-9 rounded-full hover:bg-background-200 flex items-center justify-center text-lg transition-colors">{emoji}</button>
            ))}
          </div>
        </div>
        <div className="px-4 py-4 bg-background-50 border-t border-background-200 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button type="button" className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-background-300 rounded-lg text-foreground-600">Post as: Alex</button>
            <button type="button" className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-accent-300 bg-accent-50 rounded-lg text-accent-700">Anonymous</button>
          </div>
          <button type="button" className="gradient-btn font-mono text-xs uppercase tracking-wider text-background-50 px-6 py-2.5 rounded-lg">Publish</button>
        </div>
      </div>
    </MemberShell>
  );
}

export function SearchScreen() {
  return (
    <MemberShell title="Search" showRightRail={false} fullWidth>
      <div className="max-w-2xl mx-auto">
        <input
          className="w-full font-mono text-sm px-5 py-4 bg-background-100 border border-background-200 rounded-2xl shadow-sm focus:border-primary-400 focus:outline-none mb-6"
          placeholder="Search posts, members, circles..."
          autoFocus
        />
        <SegmentedControl
          value="posts"
          options={[
            { value: 'posts', label: 'Posts' },
            { value: 'members', label: 'Members' },
            { value: 'circles', label: 'Circles' },
          ]}
        />
        <div className="mt-8 text-center py-16">
          <p className="font-display text-2xl uppercase text-foreground-800 mb-2">Start searching</p>
          <p className="font-mono text-sm text-foreground-500">Find posts, members, and circles you are eligible to see.</p>
        </div>
      </div>
    </MemberShell>
  );
}

export function PostDetailScreen() {
  return (
    <MemberShell showRightRail={false}>
      <PostCard post={feedPosts[0]} showCommentInput={false} />
      <div className="bg-background-100 rounded-2xl border border-background-200 shadow-sm p-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-500 mb-4">Comments (12)</h2>
        <div className="space-y-4 mb-4">
          {[
            { author: 'Sam R.', avatar: 'https://readdy.ai/api/search-image?query=Friendly%20person%20portrait%20headshot&width=100&height=100&seq=c1&orientation=squarish', text: 'Proud of you for showing up today. That takes real courage.', time: '1h' },
            { author: 'Morgan K.', avatar: 'https://readdy.ai/api/search-image?query=Person%20portrait%20headshot%20warm&width=100&height=100&seq=c2&orientation=squarish', text: 'One hour at a time — that really resonates with me too.', time: '45m' },
            { author: 'Anonymous', avatar: '', text: 'Sending you warmth. You are not alone in this.', time: '30m', anonymous: true },
          ].map((c, i) => (
            <div key={i} className="flex gap-3">
              {c.anonymous ? (
                <div className="w-9 h-9 rounded-full bg-accent-200 flex items-center justify-center shrink-0 text-sm">?</div>
              ) : (
                <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
              )}
              <div className="flex-1 bg-background-200/60 rounded-2xl px-4 py-3">
                <p className="font-mono text-xs font-medium text-foreground-900">{c.author} <span className="font-normal text-foreground-500">· {c.time}</span></p>
                <p className="font-mono text-sm text-foreground-700 mt-1">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-3 border-t border-background-200">
          <img src="https://readdy.ai/api/search-image?query=Friendly%20young%20woman%20portrait%20headshot&width=100&height=100&seq=me&orientation=squarish" alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div className="flex-1 flex gap-2">
            <input className="flex-1 font-mono text-sm px-4 py-2.5 bg-background-200/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300" placeholder="Write a comment..." />
            <button type="button" className="gradient-btn font-mono text-xs uppercase text-background-50 px-4 py-2 rounded-full">Post</button>
          </div>
        </div>
      </div>
    </MemberShell>
  );
}
