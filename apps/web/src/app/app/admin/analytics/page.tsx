import { ingressRedirect } from '@/lib/navigation';
import { requireAdmin } from '@/lib/require-account';

export default async function AppAdminAnalyticsRedirect() {
  await requireAdmin('/app/admin/analytics');
  await ingressRedirect('/admin/analytics');
}
