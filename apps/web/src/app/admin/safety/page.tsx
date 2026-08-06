import { requireAdmin } from '@/lib/require-account';
import { AdminSafetyScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminSafetyPage() {
  await requireAdmin('/admin/safety');
  return <AdminSafetyScreen />;
}
