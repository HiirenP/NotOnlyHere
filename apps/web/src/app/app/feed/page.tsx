import { requireAccount } from '@/lib/require-account';
import { FeedScreen } from '@/design/screens/member/CommunityScreens';

export default async function FeedPage() {
  const account = await requireAccount('/app/feed');
  return <FeedScreen account={account} />;
}
