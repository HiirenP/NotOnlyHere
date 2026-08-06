import { requireAccount } from '@/lib/require-account';
import { ResourcesScreen } from '@/design/screens/member/SupportScreens';

export default async function ResourcesPage() {
  const account = await requireAccount('/app/resources');
  return <ResourcesScreen account={account} />;
}
