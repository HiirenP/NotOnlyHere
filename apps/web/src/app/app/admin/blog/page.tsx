import { ingressRedirect } from '@/lib/navigation';
import { requireAdmin } from '@/lib/require-account';

export default async function AppAdminBlogRedirect() {
  await requireAdmin('/app/admin/blog');
  await ingressRedirect('/admin/content');
}
