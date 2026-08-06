import { requireAccount } from '@/lib/require-account';
import { ProfileScreen } from '@/design/screens/member/PeopleScreens';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const account = await requireAccount(`/app/profile/${username}`);
  return <ProfileScreen account={account} username={username} />;
}
