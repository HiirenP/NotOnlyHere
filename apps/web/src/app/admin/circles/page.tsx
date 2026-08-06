import { requireAdmin } from '@/lib/require-account';
import { AdminCirclesScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminCirclesPage() {
  await requireAdmin('/admin/circles');
  return <AdminCirclesScreen />;
}
