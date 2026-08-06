import { requireAdmin } from '@/lib/require-account';
import { AdminDonationsScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminDonationsPage() {
  await requireAdmin('/admin/donations');
  return <AdminDonationsScreen />;
}
