import { requireAccount } from '@/lib/require-account';
import { EventsScreen } from '@/design/screens/member/SupportScreens';

export default async function EventsPage() {
  const account = await requireAccount('/app/events');
  return <EventsScreen account={account} />;
}
