import { Suspense } from 'react';
import { requireAccount } from '@/lib/require-account';
import { ComposerScreen } from '@/design/screens/member/CommunityScreens';

export default async function ComposerPage() {
  const account = await requireAccount('/app/composer');
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#676a79]">Loading composer…</div>}>
      <ComposerScreen account={account} />
    </Suspense>
  );
}
