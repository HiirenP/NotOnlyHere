import { requireAccount } from '@/lib/require-account';
import { SettingsScreen } from '@/design/screens/member/SupportScreens';

export default async function SettingsPage() {
  const account = await requireAccount('/app/settings');
  return <SettingsScreen account={account} />;
}
