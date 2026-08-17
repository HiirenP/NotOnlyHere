import { EyeOff, Image, MapPin, Smile, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ColorIcon, PageHeader, TAvatar, TBtn, TCard, TSearch, TTabs } from '@/components/template';
import {
  AvaPromptCard,
  CircleMomentsRail,
  CreatePostCard,
  DailyCheckIn,
  EncouragementPromptCard,
  FoundingMemberBadge,
  GroupCard,
  PostCard,
} from '@/components/social';
import { circles, currentUser, feedPosts, images } from '@/data/mock';
import { MemberShell } from '@/layouts/Shells';
import { useState } from 'react';

export function FeedScreen() {
  const yourCircles = circles.filter((c) => c.joined);

  return (
    <MemberShell showRightRail>
      <DailyCheckIn />

      <div className="xl:hidden grid sm:grid-cols-2 gap-4 mb-4">
        <AvaPromptCard />
        <EncouragementPromptCard />
      </div>

      <CircleMomentsRail />

      <div className="bg-white border border-[#e8eaed] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#14191e]">Your Circles</h3>
            <p className="text-xs text-[#676a79] mt-0.5">Where belonging starts</p>
          </div>
          <Link to="/design/app/circles" className="text-xs font-semibold text-[#0f6fec] hover:underline shrink-0">
            Browse all
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {yourCircles.map((circle) => (
            <Link
              key={circle.id}
              to="/design/app/circles/detail"
              className="flex items-center gap-2 shrink-0 px-3 py-2 rounded-lg bg-[#f5f6f8] hover:bg-[#eef0f4] transition-colors"
            >
              <img src={circle.thumb} alt="" className="w-8 h-8 rounded-md object-cover" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#14191e] truncate max-w-[120px]">{circle.name}</p>
                <p className="text-[10px] text-[#a1a5b3]">{circle.activeToday} active today</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

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
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const isAnonymous = mode === 'anonymous';

  return (
    <MemberShell>
      <PageHeader
        title={isAnonymous ? 'Post anonymously' : 'Create post'}
        subtitle={isAnonymous ? 'Your name stays hidden — only your words are shared' : 'Share with your community'}
      />
      <TCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[#e8eaed] flex items-center gap-3">
          {isAnonymous ? (
            <div className="w-10 h-10 rounded-full bg-[#6610f2]/15 text-[#6610f2] flex items-center justify-center font-bold text-sm">?</div>
          ) : (
            <TAvatar src={currentUser.avatar} name={currentUser.displayName} />
          )}
          <div>
            <p className="text-sm font-bold text-[#14191e]">{isAnonymous ? 'Anonymous' : currentUser.displayName}</p>
            <button type="button" className="text-xs font-semibold text-[#0f6fec] bg-[#0f6fec]/10 px-2 py-0.5 rounded-md mt-0.5">
              {isAnonymous ? 'Anonymous · Circle' : 'Members ▾'}
            </button>
          </div>
        </div>
        <textarea className="w-full min-h-48 text-base p-4 focus:outline-none resize-none placeholder:text-[#a1a5b3]" placeholder="What’s one true sentence for today?" autoFocus />
        <div className="mx-4 mb-4 rounded-xl overflow-hidden">
          <img src={images.postNature} alt="" className="w-full max-h-64 object-cover" />
        </div>
        <div className="px-4 py-3 border-t border-[#e8eaed] flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#676a79] font-semibold mr-1">Add:</span>
          {[
            { icon: Image, label: 'Photo', color: 'green' as const },
            { icon: Smile, label: 'Mood', color: 'yellow' as const },
            { icon: Users, label: 'Circle', color: 'teal' as const },
            { icon: MapPin, label: 'Event', color: 'red' as const },
            { icon: EyeOff, label: 'Anonymous', color: 'purple' as const },
          ].map((item) => (
            <button key={item.label} type="button" className="flex items-center gap-1.5 text-xs font-semibold text-[#676a79] hover:bg-[#f5f6f8] px-2 py-1.5 rounded-lg transition-colors">
              <ColorIcon icon={item.icon} color={item.color} size="sm" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="px-4 py-4 bg-[#f5f6f8] border-t border-[#e8eaed] flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className={`text-xs font-semibold px-3 py-1.5 border rounded-lg ${
                isAnonymous
                  ? 'border-[#e8eaed] bg-white text-[#676a79]'
                  : 'border-[#0f6fec]/30 bg-[#0f6fec]/10 text-[#0f6fec]'
              }`}
            >
              Post as: Alex
            </button>
            <Link
              to={isAnonymous ? '/design/app/composer' : '/design/app/composer?mode=anonymous'}
              className={`text-xs font-semibold px-3 py-1.5 border rounded-lg ${
                isAnonymous
                  ? 'border-[#6610f2]/30 bg-[#6610f2]/5 text-[#6610f2]'
                  : 'border-[#e8eaed] bg-white text-[#676a79]'
              }`}
            >
              Anonymous
            </Link>
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
      <PageHeader title="Search" subtitle="Find posts, people, and circles" />
      <TSearch placeholder="Search posts, members, circles..." className="mb-4" />
      <TTabs tabs={[{ id: 'posts', label: 'Posts' }, { id: 'members', label: 'People' }, { id: 'circles', label: 'Circles' }]} active={tab} onChange={setTab} className="mb-4" />
      {tab === 'posts' && (
        <div className="space-y-4">
          {feedPosts.slice(0, 2).map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
      {tab === 'members' && (
        <TCard>
          <div className="space-y-3">
            {[
              { name: 'Jordan Lee', username: 'jordanl', avatar: images.avatar2, sharedCircle: 'Anxiety Support', foundingMember: true },
              { name: 'Sam Rivera', username: 'samr', avatar: images.avatar3, sharedCircle: 'New Parents', foundingMember: true },
              { name: 'Morgan Kim', username: 'morgank', avatar: images.avatar1, sharedCircle: 'Work Stress', foundingMember: false },
            ].map((m) => (
              <div key={m.username} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f6f8]">
                <TAvatar src={m.avatar} name={m.name} />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-[#14191e]">{m.name}</p>
                    {m.foundingMember && <FoundingMemberBadge compact />}
                  </div>
                  <p className="text-xs text-[#676a79]">@{m.username} · Also in {m.sharedCircle}</p>
                </div>
                <TBtn size="sm" variant="soft">Welcome</TBtn>
              </div>
            ))}
          </div>
        </TCard>
      )}
      {tab === 'circles' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {circles.map((circle) => <GroupCard key={circle.id} circle={circle} />)}
        </div>
      )}
    </MemberShell>
  );
}

export function PostDetailScreen() {
  return (
    <MemberShell>
      <PostCard post={feedPosts[0]} showCommentInput={false} />
      <TCard>
        <h2 className="text-sm font-bold text-[#14191e] mb-4">Comments (9)</h2>
        <div className="space-y-4 mb-4">
          {[
            { author: 'Sam R.', avatar: images.avatar3, text: 'That counts. Really glad you shared it here.', time: '1h', foundingMember: true },
            { author: 'Morgan K.', avatar: images.avatar1, text: 'Sitting with you in that — one step is enough.', time: '45m', foundingMember: true },
          ].map((c) => (
            <div key={c.author} className="flex gap-3">
              <TAvatar src={c.avatar} name={c.author} size="sm" />
              <div className="flex-1 bg-[#f5f6f8] rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-[#14191e] flex items-center gap-1 flex-wrap">
                  {c.author}
                  {c.foundingMember && <FoundingMemberBadge compact />}
                  <span className="font-normal text-[#a1a5b3]">· {c.time}</span>
                </p>
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
