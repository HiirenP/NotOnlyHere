import { requireAccount } from '@/lib/require-account';
import { CircleDetailScreen } from '@/design/screens/member/PeopleScreens';

export default async function CircleDetailPage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = await params;
  const account = await requireAccount(`/app/circles/${circleId}`);
  return <CircleDetailScreen account={account} circleId={circleId} />;
}
