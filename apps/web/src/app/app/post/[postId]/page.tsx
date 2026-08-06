import { requireAccount } from '@/lib/require-account';
import { PostDetailScreen } from '@/design/screens/member/CommunityScreens';

export default async function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const account = await requireAccount(`/app/post/${postId}`);
  return <PostDetailScreen account={account} postId={postId} />;
}
