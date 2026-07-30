import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Avatar, Badge, Button, Card, EmptyState, SegmentedControl } from '@/design-system';
import { feedPosts } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';
import { useState } from 'react';

function FeedCard({ post }: { post: (typeof feedPosts)[0] }) {
  return (
    <Card className="mb-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar name={post.author} anonymous={post.anonymous} />
          <div>
            <p className="font-mono text-sm text-foreground-900">{post.author}</p>
            <p className="font-mono text-[11px] text-foreground-500">{post.circle} · {post.time}</p>
          </div>
        </div>
        <button type="button" className="w-10 h-10 flex items-center justify-center text-foreground-500 hover:bg-background-200" aria-label="More options">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <p className="font-mono text-sm text-foreground-800 leading-relaxed mb-4">{post.content}</p>
      <div className="flex items-center gap-2 mb-4">
        <Badge>{post.audience}</Badge>
        {post.anonymous && <Badge className="bg-accent-100 text-accent-700">Anonymous</Badge>}
      </div>
      <div className="flex items-center gap-6 pt-3 border-t border-background-200">
        <button type="button" className="flex items-center gap-2 font-mono text-xs text-foreground-600 hover:text-primary-700 transition-colors">
          <Heart size={16} /> {post.reactions}
        </button>
        <button type="button" className="flex items-center gap-2 font-mono text-xs text-foreground-600 hover:text-primary-700 transition-colors">
          <MessageCircle size={16} /> {post.comments}
        </button>
      </div>
    </Card>
  );
}

export function FeedScreen() {
  const [mode, setMode] = useState('relevant');
  return (
    <MemberShell title="Feed">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: 'relevant', label: 'Relevant' },
              { value: 'chronological', label: 'Chronological' },
            ]}
          />
          <Button size="sm">Create post</Button>
        </div>
        {feedPosts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </MemberShell>
  );
}

export function ComposerScreen() {
  return (
    <MemberShell title="Create post">
      <div className="max-w-2xl mx-auto">
        <Card>
          <label className="block font-mono text-xs uppercase tracking-widest text-foreground-500 mb-2">Share what feels comfortable</label>
          <textarea
            className="w-full min-h-40 font-mono text-sm p-4 bg-background-50 border border-background-200 focus:border-foreground-400 focus:outline-none resize-y"
            placeholder="Write your post..."
          />
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="surface-elevated p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-500 mb-2">Post as</p>
              <p className="font-mono text-sm text-foreground-900">Alex Morgan</p>
            </div>
            <div className="surface-elevated p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-foreground-500 mb-2">Audience</p>
              <p className="font-mono text-sm text-foreground-900">Members</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost">Cancel</Button>
            <Button>Publish post</Button>
          </div>
        </Card>
      </div>
    </MemberShell>
  );
}

export function SearchScreen() {
  return (
    <MemberShell title="Search">
      <div className="max-w-3xl mx-auto space-y-6">
        <input
          className="w-full font-mono text-sm px-4 py-4 bg-background-100 border border-background-200 focus:border-foreground-400 focus:outline-none"
          placeholder="Search posts, members, circles..."
        />
        <SegmentedControl
          value="posts"
          options={[
            { value: 'posts', label: 'Posts' },
            { value: 'members', label: 'Members' },
            { value: 'circles', label: 'Circles' },
          ]}
        />
        <EmptyState title="Start searching" description="Find posts, members, and circles you are eligible to see." />
      </div>
    </MemberShell>
  );
}

export function PostDetailScreen() {
  return (
    <MemberShell title="Post">
      <div className="max-w-2xl mx-auto">
        <FeedCard post={feedPosts[0]} />
        <Card className="mt-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-500 mb-4">Comments</h2>
          <textarea className="w-full min-h-24 font-mono text-sm p-4 bg-background-50 border border-background-200 mb-4" placeholder="Add a thoughtful comment..." />
          <Button size="sm">Post comment</Button>
        </Card>
      </div>
    </MemberShell>
  );
}
