import { ingressRedirect } from '@/lib/navigation';
import { requireAccount } from '@/lib/require-account';

export default async function ConnectionsSettingsRedirect() {
  await requireAccount('/app/settings/connections');
  await ingressRedirect('/app/settings');
}
