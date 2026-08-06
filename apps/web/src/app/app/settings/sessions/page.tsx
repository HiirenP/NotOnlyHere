import { ingressRedirect } from '@/lib/navigation';
import { requireAccount } from '@/lib/require-account';

export default async function SessionsSettingsRedirect() {
  await requireAccount('/app/settings/sessions');
  await ingressRedirect('/app/settings');
}
