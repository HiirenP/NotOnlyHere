import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthPageShell } from '@/components/auth/AuthPageShell';

export default function LoginPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={<div className="font-ui text-sm text-[#676a79]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
