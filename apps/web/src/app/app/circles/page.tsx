import { requireAccount } from '@/lib/require-account';
import { CirclesScreen } from '@/design/screens/member/PeopleScreens';

export default async function CirclesPage() {
  const account = await requireAccount('/app/circles');
  return <CirclesScreen account={account} />;
}
