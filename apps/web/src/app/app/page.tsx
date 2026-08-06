import { requireAccount } from '@/lib/require-account';
import { FeedScreen } from '@/design/screens/member/CommunityScreens';

export default async function AppHomePage() {
  const account = await requireAccount('/app');
  return <FeedScreen account={account} />;
}
