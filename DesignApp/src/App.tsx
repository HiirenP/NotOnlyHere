import { Navigate, Route, Routes } from 'react-router-dom';
import { DesignCatalog } from '@/catalog/DesignCatalog';
import { ForgotPasswordScreen, LoginScreen, RegisterScreen, VerifyEmailScreen } from '@/screens/auth/AuthScreens';
import {
  AdminAnalyticsScreen,
  AdminAuditScreen,
  AdminCirclesScreen,
  AdminContentScreen,
  AdminDashboardScreen,
  AdminDonationsScreen,
  AdminSafetyScreen,
  AdminUserDetailScreen,
  AdminUsersScreen,
} from '@/screens/admin/AdminScreens';
import { ComposerScreen, FeedScreen, PostDetailScreen, SearchScreen } from '@/screens/member/CommunityScreens';
import {
  CircleDetailScreen,
  CirclesScreen,
  MessagesScreen,
  NotificationsScreen,
  ProfileScreen,
} from '@/screens/member/PeopleScreens';
import {
  AvaScreen,
  EventsScreen,
  ExploreScreen,
  MoodScreen,
  ResourcesScreen,
  SettingsScreen,
} from '@/screens/member/SupportScreens';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/design" replace />} />
      <Route path="/design" element={<DesignCatalog />} />

      <Route path="/design/auth/login" element={<LoginScreen />} />
      <Route path="/design/auth/register" element={<RegisterScreen />} />
      <Route path="/design/auth/verify-email" element={<VerifyEmailScreen />} />
      <Route path="/design/auth/forgot-password" element={<ForgotPasswordScreen />} />

      <Route path="/design/app/feed" element={<FeedScreen />} />
      <Route path="/design/app/composer" element={<ComposerScreen />} />
      <Route path="/design/app/post" element={<PostDetailScreen />} />
      <Route path="/design/app/search" element={<SearchScreen />} />
      <Route path="/design/app/circles" element={<CirclesScreen />} />
      <Route path="/design/app/circles/detail" element={<CircleDetailScreen />} />
      <Route path="/design/app/profile" element={<ProfileScreen />} />
      <Route path="/design/app/messages" element={<MessagesScreen />} />
      <Route path="/design/app/notifications" element={<NotificationsScreen />} />
      <Route path="/design/app/ava" element={<AvaScreen />} />
      <Route path="/design/app/mood" element={<MoodScreen />} />
      <Route path="/design/app/events" element={<EventsScreen />} />
      <Route path="/design/app/resources" element={<ResourcesScreen />} />
      <Route path="/design/app/explore" element={<ExploreScreen />} />
      <Route path="/design/app/settings" element={<SettingsScreen />} />

      <Route path="/design/admin" element={<AdminDashboardScreen />} />
      <Route path="/design/admin/users" element={<AdminUsersScreen />} />
      <Route path="/design/admin/users/detail" element={<AdminUserDetailScreen />} />
      <Route path="/design/admin/circles" element={<AdminCirclesScreen />} />
      <Route path="/design/admin/safety" element={<AdminSafetyScreen />} />
      <Route path="/design/admin/content" element={<AdminContentScreen />} />
      <Route path="/design/admin/donations" element={<AdminDonationsScreen />} />
      <Route path="/design/admin/analytics" element={<AdminAnalyticsScreen />} />
      <Route path="/design/admin/audit" element={<AdminAuditScreen />} />

      <Route path="*" element={<Navigate to="/design" replace />} />
    </Routes>
  );
}
