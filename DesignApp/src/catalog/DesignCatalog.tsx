import { Link } from 'react-router-dom';
import { designBatches, designScreens } from './registry';

export function DesignCatalog() {
  return (
    <div className="min-h-screen bg-background-50">
      <header className="border-b border-background-200 bg-background-100/80 backdrop-blur px-6 py-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 mb-2">NotOnlyHere product design</p>
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-foreground-950">
          Web App & <span className="gradient-text">Admin Panel</span>
        </h1>
        <p className="font-mono text-sm text-foreground-600 max-w-2xl mt-4 leading-relaxed">
          Interactive design preview for the authenticated member application and admin panel.
          Built from <code className="text-foreground-800">docs/02-ux-spec.md</code> with tokens from the marketing site.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/design/auth/login" className="gradient-btn font-mono text-xs uppercase tracking-wider text-background-50 px-5 py-3">
            Start with auth
          </Link>
          <Link to="/design/app/feed" className="surface-card font-mono text-xs uppercase tracking-wider text-foreground-800 px-5 py-3 hover:bg-background-200 transition-colors">
            Member app
          </Link>
          <Link to="/design/admin" className="surface-card font-mono text-xs uppercase tracking-wider text-foreground-800 px-5 py-3 hover:bg-background-200 transition-colors">
            Admin panel
          </Link>
        </div>
      </header>

      <main className="px-6 py-10 max-w-6xl mx-auto space-y-10">
        {designBatches.map((batch) => {
          const screens = designScreens.filter((s) => s.batch === batch);
          if (screens.length === 0) return null;
          return (
            <section key={batch}>
              <h2 className="font-display text-2xl uppercase tracking-tight text-foreground-950 mb-4">{batch}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {screens.map((screen) => (
                  <Link
                    key={screen.id}
                    to={screen.path}
                    className="surface-card p-5 hover:border-primary-300 hover:shadow-sm transition-all duration-200 group"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest text-foreground-500 mb-2">{screen.surface}</p>
                    <h3 className="font-mono text-sm text-foreground-900 group-hover:gradient-text transition-colors">{screen.title}</h3>
                    {screen.prdRefs && (
                      <p className="font-mono text-[10px] text-foreground-500 mt-2">{screen.prdRefs.join(' · ')}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
