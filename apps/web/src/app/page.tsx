import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl uppercase tracking-tight mb-4">
        Not<span className="gradient-text">OnlyHere</span>
      </h1>
      <p className="font-mono text-sm text-foreground-600 max-w-md mb-8">
        Phase 0 walking skeleton. Enter the member app to verify the authenticated account path.
      </p>
      <div className="flex gap-4">
        <Link href="/app" className="gradient-btn font-mono text-xs uppercase tracking-wider text-background-50 px-6 py-3">
          Open member app
        </Link>
        <Link href="/admin" className="surface-card font-mono text-xs uppercase tracking-wider text-foreground-800 px-6 py-3">
          Admin panel
        </Link>
      </div>
    </main>
  );
}
