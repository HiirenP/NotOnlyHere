import { requireAccount } from '@/lib/require-account';
import { MoodScreen } from '@/design/screens/member/SupportScreens';

export default async function MoodPage() {
  const account = await requireAccount('/app/mood');
  return <MoodScreen account={account} />;
}
