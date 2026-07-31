import { PageHeader, TAvatar, TBtn, TCard, TEmpty, TSearch, TTabs } from '@/components/template';
import { CircleMomentsRail, CreatePostCard, PostCard } from '@/components/social';
import { currentUser, feedPosts, images } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';
import { useState } from 'react';

export function FeedScreen() {
  return (
    <MemberShell showRightRail>
      <CircleMomentsRail />
      <CreatePostCard />
      {feedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <button type="button" className="w-full py-3 text-sm font-semibold text-[#676a79] hover:bg-white rounded-2xl border border-[#e8eaed] transition-colors">
        Load more posts
      </button>
    </MemberShell>
  );
}

export function ComposerScreen() {
  return (
    <MemberShell>
      <PageHeader title="Create post" subtitle="Share with your community" />
      <TCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
          <TAvatar src={currentUser.avatar} name={currentUser.displayName} />
          <div>
            <p className="text-sm font-bold text-[#14191e]">{currentUser.displayName}</p>
            <button type="button" className="text-xs font-semibold text-[#0f6fec] bg-[#0f6fec]/10 px-2 py-0.5 rounded-md mt-0.5">Members ▾</button>
          </div>
        </div>
        <textarea className="w-full min-h-48 text-base p-4 focus:outline-none resize-none placeholder:text-[#a1a5b3]" placeholder="Share what feels comfortable..." autoFocus />
        <div className="mx-4 mb-4 rounded-xl overflow-hidden">
          <img src={images.postNature} alt="" className="w-full max-h-64 object-cover" />
        </div>
        <div className="px-4 py-3 border-t border-[#e8eaed] flex items-center gap-2">
          <span className="text-xs text-[#676a79] font-semibold mr-2">Add:</span>
          {['📷 Photo', '😊 Mood', '👥 Circle', '📍 Event'].map((l) => (
            <button key={l} type="button" className="text-xs font-semibold text-[#676a79] hover:bg-[#f5f6f8] px-3 py-1.5 rounded-lg transition-colors">{l}</button>
          ))}
        </div>
        <div className="px-4 py-4 bg-[#f5f6f8] border-t border-[#e8eaed] flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button type="button" className="text-xs font-semibold px-3 py-1.5 border border-[#e8eaed] rounded-lg bg-white">Post as: Alex</button>
            <button type="button" className="text-xs font-semibold px-3 py-1.5 border border-[#6610f2]/30 bg-[#6610f2]/5 text-[#6610f2] rounded-lg">Anonymous</button>
          </div>
          <TBtn>Publish post</TBtn>
        </div>
      </TCard>
    </MemberShell>
  );
}

export function SearchScreen() {
  const [tab, setTab] = useState('posts');
  return (
    <MemberShell fullWidth>
      <PageHeader title="Search" subtitle="Find posts, people, and groups" />
      <TSearch placeholder="Search posts, members, groups..." className="mb-4" />
      <TTabs tabs={[{ id: 'posts', label: 'Posts' }, { id: 'members', label: 'People' }, { id: 'circles', label: 'Groups' }]} active={tab} onChange={setTab} />
      <TCard>
        <TEmpty title="Start searching" description="Find posts, members, and groups you are eligible to see." />
      </TCard>
    </MemberShell>
  );
}

export function PostDetailScreen() {
  return (
    <MemberShell>
      <PostCard post={feedPosts[0]} showCommentInput={false} />
      <TCard>
        <h2 className="text-sm font-bold text-[#14191e] mb-4">Comments (12)</h2>
        <div className="space-y-4 mb-4">
          {[
            { author: 'Sam R.', avatar: images.avatar3, text: 'Proud of you for showing up today.', time: '1h' },
            { author: 'Morgan K.', avatar: images.avatar1, text: 'One hour at a time — that resonates.', time: '45m' },
          ].map((c) => (
            <div key={c.author} className="flex gap-3">
              <TAvatar src={c.avatar} name={c.author} size="sm" />
              <div className="flex-1 bg-[#f5f6f8] rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-[#14191e]">{c.author} <span className="font-normal text-[#a1a5b3]">· {c.time}</span></p>
                <p className="text-sm text-[#676a79] mt-1">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-3 border-t border-[#e8eaed]">
          <TAvatar src={currentUser.avatar} name={currentUser.displayName} size="sm" />
          <div className="flex-1 flex gap-2">
            <input className="flex-1 text-sm bg-[#f5f6f8] rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0f6fec]/10" placeholder="Write a comment..." />
            <TBtn size="sm">Post</TBtn>
          </div>
        </div>
      </TCard>
    </MemberShell>
  );
}
