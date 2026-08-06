import { ingressRedirect } from '@/lib/navigation';
import { requireAccount } from '@/lib/require-account';

export default async function DataSettingsRedirect() {
  await requireAccount('/app/settings/data');
  await ingressRedirect('/app/settings');
}
