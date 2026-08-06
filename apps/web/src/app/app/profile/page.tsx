import { ingressRedirect } from '@/lib/navigation';
import { requireAccount } from '@/lib/require-account';

export default async function ProfileRedirectPage() {
  const account = await requireAccount('/app/profile');
  await ingressRedirect(`/app/profile/${account.username}`);
}
