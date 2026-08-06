import { requireAccount } from '@/lib/require-account';
import { SearchScreen } from '@/design/screens/member/CommunityScreens';

export default async function SearchPage() {
  const account = await requireAccount('/app/search');
  return <SearchScreen account={account} />;
}
