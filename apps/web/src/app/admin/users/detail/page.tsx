import { requireAdmin } from '@/lib/require-account';
import { AdminUserDetailScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminUserDetailPage() {
  await requireAdmin('/admin/users/detail');
  return <AdminUserDetailScreen />;
}
