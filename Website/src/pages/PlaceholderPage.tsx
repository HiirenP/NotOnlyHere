import Nav from '@/pages/home/components/Nav';
import Footer from '@/pages/home/components/Footer';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="bg-background-50 min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-16 text-center">
        <span className="font-mono text-xs uppercase tracking-widest gradient-text block mb-4">Coming Soon</span>
        <h1 className="font-display text-5xl md:text-7xl tracking-tighter text-foreground-950 uppercase mb-6">
          {title}
        </h1>
        <p className="font-mono text-base text-foreground-600 leading-relaxed max-w-md mx-auto mb-10">
          This page is under construction. We&apos;re building something warm and thoughtful — check back soon.
        </p>
        <a
          href="/"
          className="font-mono text-sm uppercase tracking-wider gradient-btn text-background-50 px-8 py-4 rounded-full whitespace-nowrap cursor-pointer inline-block"
        >
          Back to Home
        </a>
      </section>
      <Footer />
    </main>
  );
}