import { ingressRedirect } from '@/lib/navigation';

export default async function LegacyPostPage() {
  await ingressRedirect('/app/feed');
}
