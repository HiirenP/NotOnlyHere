import { requireAdmin } from '@/lib/require-account';
import { AdminDashboardScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminPage() {
  await requireAdmin('/admin');
  return <AdminDashboardScreen />;
}
