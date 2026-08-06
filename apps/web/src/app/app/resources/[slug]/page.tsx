import { requireAccount } from '@/lib/require-account';
import { ResourceDetailScreen } from '@/design/screens/member/ResourceDetailScreen';

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const account = await requireAccount(`/app/resources/${slug}`);
  return <ResourceDetailScreen account={account} slug={slug} />;
}
