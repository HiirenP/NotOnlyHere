import { requireAdmin } from '@/lib/require-account';
import { AdminContentScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminContentPage() {
  await requireAdmin('/admin/content');
  return <AdminContentScreen />;
}
