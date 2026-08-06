import { ingressRedirect } from '@/lib/navigation';
import { requireAdmin } from '@/lib/require-account';

export default async function AppAdminMigrationRedirect() {
  await requireAdmin('/app/admin/migration');
  await ingressRedirect('/admin');
}
