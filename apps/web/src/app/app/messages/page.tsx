import { requireAccount } from '@/lib/require-account';
import { MessagesScreen } from '@/design/screens/member/PeopleScreens';

export default async function MessagesPage() {
  const account = await requireAccount('/app/messages');
  return <MessagesScreen account={account} />;
}
