import { ingressRedirect } from '@/lib/navigation';
import { requireAccount } from '@/lib/require-account';

export default async function ProfileEditRedirect() {
  await requireAccount('/app/profile/edit');
  await ingressRedirect('/app/settings');
}
