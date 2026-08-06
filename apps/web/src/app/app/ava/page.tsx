import { requireAccount } from '@/lib/require-account';
import { AvaScreen } from '@/design/screens/member/SupportScreens';

export default async function AvaPage() {
  const account = await requireAccount('/app/ava');
  return <AvaScreen account={account} />;
}
