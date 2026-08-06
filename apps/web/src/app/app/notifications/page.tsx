import { requireAccount } from '@/lib/require-account';
import { NotificationsScreen } from '@/design/screens/member/PeopleScreens';

export default async function NotificationsPage() {
  const account = await requireAccount('/app/notifications');
  return <NotificationsScreen account={account} />;
}
