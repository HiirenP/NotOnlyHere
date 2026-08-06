import { requireAdmin } from '@/lib/require-account';
import { AdminAnalyticsScreen } from '@/design/screens/admin/AdminScreens';

export default async function AdminAnalyticsPage() {
  await requireAdmin('/admin/analytics');
  return <AdminAnalyticsScreen />;
}
