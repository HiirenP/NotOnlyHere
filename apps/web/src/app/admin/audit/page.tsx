import { requireAdmin } from '@/lib/require-account';
import { AdminAuditScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminAuditPage() {
  await requireAdmin('/admin/audit');
  return <AdminAuditScreen />;
}
