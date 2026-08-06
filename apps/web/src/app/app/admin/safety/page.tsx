import { ingressRedirect } from '@/lib/navigation';
import { requireAdmin } from '@/lib/require-account';

export default async function AppAdminSafetyRedirect() {
  await requireAdmin('/app/admin/safety');
  await ingressRedirect('/admin/safety');
}
