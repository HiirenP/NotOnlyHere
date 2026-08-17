import { useSearchParams, Link } from 'react-router-dom';
import { TBtn, TCard, TDivider } from '@/components/template';
import { AuthShell } from '@/layouts/Shells';

function AuthField({ label, type = 'text', placeholder, defaultValue }: { label: string; type?: string; placeholder?: string; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#14191e] mb-2">{label}</label>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} className="w-full text-sm px-4 py-3 bg-[#f5f6f8] border border-[#e8eaed] rounded-xl focus:outline-none focus:border-[#0f6fec] focus:ring-2 focus:ring-[#0f6fec]/10" />
    </div>
  );
}

export function LoginScreen() {
  return (
    <AuthShell>
      <TCard className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-[#14191e] mb-2">Welcome back</h1>
        <p className="text-sm text-[#676a79] mb-6">Sign in to your community account</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <AuthField label="Email or username" placeholder="you@example.com" />
          <AuthField label="Password" type="password" placeholder="••••••••" />
          <div className="flex justify-end">
            <Link to="/design/auth/forgot-password" className="text-sm font-semibold text-[#0f6fec] hover:underline">Forgot password?</Link>
          </div>
          <TBtn className="w-full py-3">Sign in</TBtn>
        </form>
        <TDivider label="or" />
        <div className="space-y-3">
          <TBtn variant="outline" className="w-full">Continue with Google</TBtn>
          <TBtn variant="outline" className="w-full">Continue with Apple</TBtn>
        </div>
        <p className="text-sm text-center text-[#676a79] mt-6">
          New here? <Link to="/design/auth/register" className="font-semibold text-[#0f6fec] hover:underline">Create account</Link>
        </p>
      </TCard>
    </AuthShell>
  );
}

export function RegisterScreen() {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');

  return (
    <AuthShell>
      <TCard className="w-full max-w-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-[#14191e] mb-2">Join NotOnlyHere</h1>
        <p className="text-sm text-[#676a79] mb-6">A peer-support community for people 16 and older</p>
        {refCode && (
          <div className="mb-4 p-3 rounded-xl bg-[#0cbc87]/10 border border-[#0cbc87]/20">
            <p className="text-xs font-bold text-[#087f60] uppercase tracking-wide">You were invited</p>
            <p className="text-sm text-[#14191e] mt-1">
              <strong>@{refCode}</strong> invited you to find your Circle here.
            </p>
          </div>
        )}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-4">
            <AuthField label="Display name" placeholder="Your name" />
            <AuthField label="Username" placeholder="@username" />
          </div>
          <AuthField label="Email" type="email" placeholder="you@example.com" />
          <AuthField label="Password" type="password" placeholder="Min. 8 characters" />
          <AuthField label="Invite code (optional)" placeholder="Friend’s invite code" defaultValue={refCode ?? ''} />
          <label className="flex items-start gap-3 text-sm text-[#676a79]">
            <input type="checkbox" className="mt-1 rounded" />
            I confirm I am 16 or older
          </label>
          <label className="flex items-start gap-3 text-sm text-[#676a79]">
            <input type="checkbox" className="mt-1 rounded" />
            I accept the Terms and Community Guidelines
          </label>
          <Link
            to="/design/app/onboarding"
            className="block w-full py-3 rounded-lg bg-[#0f6fec] hover:bg-[#0d5ed4] text-white text-sm font-semibold text-center transition-colors"
          >
            Create account
          </Link>
        </form>
      </TCard>
    </AuthShell>
  );
}

export function VerifyEmailScreen() {
  return (
    <AuthShell>
      <TCard className="w-full max-w-md p-8 text-center shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0f6fec]/10 flex items-center justify-center text-3xl">✉️</div>
        <h1 className="text-2xl font-bold text-[#14191e] mb-2">Check your email</h1>
        <p className="text-sm text-[#676a79] mb-6 leading-relaxed">
          We sent a verification link to <strong className="text-[#14191e]">you@example.com</strong>. The link expires in 24 hours.
        </p>
        <TBtn variant="soft" className="w-full">Resend email</TBtn>
      </TCard>
    </AuthShell>
  );
}

export function ForgotPasswordScreen() {
  return (
    <AuthShell>
      <TCard className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-[#14191e] mb-2">Reset password</h1>
        <p className="text-sm text-[#676a79] mb-6">Enter your email and we'll send a reset link</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <AuthField label="Email" type="email" />
          <TBtn className="w-full py-3">Send reset link</TBtn>
        </form>
        <p className="text-sm text-center mt-4">
          <Link to="/design/auth/login" className="font-semibold text-[#0f6fec] hover:underline">Back to sign in</Link>
        </p>
      </TCard>
    </AuthShell>
  );
}
