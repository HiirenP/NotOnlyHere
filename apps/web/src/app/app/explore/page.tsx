import { requireAccount } from '@/lib/require-account';
import { ExploreScreen } from '@/design/screens/member/SupportScreens';

export default async function ExplorePage() {
  const account = await requireAccount('/app/explore');
  return <ExploreScreen account={account} />;
}
