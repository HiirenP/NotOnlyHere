import { ingressRedirect } from '@/lib/navigation';
import { requireAccount } from '@/lib/require-account';

export default async function CircleMembersRedirect({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = await params;
  await requireAccount(`/app/circles/${circleId}/members`);
  await ingressRedirect(`/app/circles/${circleId}`);
}
