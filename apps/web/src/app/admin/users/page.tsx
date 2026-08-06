import { requireAdmin } from '@/lib/require-account';
import { AdminUsersScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminUsersPage() {
  await requireAdmin('/admin/users');
  return <AdminUsersScreen />;
}
