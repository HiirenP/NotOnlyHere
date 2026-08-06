import { ingressRedirect } from '@/lib/navigation';
import { requireAccount } from '@/lib/require-account';

export default async function WellnessRedirectPage() {
  await requireAccount('/app/wellness');
  await ingressRedirect('/app/mood');
}
