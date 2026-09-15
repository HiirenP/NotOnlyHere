import { Link } from 'react-router-dom';
import { getStatusCounts, pageDesignStatus } from './pageStatus';
import { designBatches, designScreens } from './registry';

const statusStyles = {
  complete: 'bg-[#0cbc87]/10 text-[#0cbc87] border-[#0cbc87]/20',
  'in-progress': 'bg-[#f7c32e]/15 text-[#c9a000] border-[#f7c32e]/30',
  pending: 'bg-[#f5f6f8] text-[#676a79] border-[#e8eaed]',
};

const statusLabels = {
  complete: 'Complete',
  'in-progress': 'In progress',
  pending: 'Pending',
};

export function DesignCatalog() {
  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-[#eff2f6] font-ui">
      <header className="border-b border-[#e8eaed] bg-white px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#676a79] mb-2">NotOnlyHere product design</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#14191e]">
          Web App & <span className="text-[#0f6fec]">Admin Panel</span>
        </h1>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0cbc87]/10 text-[#0cbc87] text-xs font-semibold border border-[#0cbc87]/20">
            {counts.complete} complete
          </span>
          {counts.inProgress > 0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f7c32e]/15 text-[#c9a000] text-xs font-semibold border border-[#f7c32e]/30">
              {counts.inProgress} in progress
            </span>
          )}
          {counts.pending > 0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f5f6f8] text-[#676a79] text-xs font-semibold border border-[#e8eaed]">
              {counts.pending} pending
            </span>
          )}
          <span className="text-xs text-[#a1a5b3]">{counts.total} screens total</span>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/design/auth/login" className="bg-[#0f6fec] hover:bg-[#0d5ed4] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            Start with auth
          </Link>
          <Link to="/design/app/feed" className="bg-white border border-[#e8eaed] hover:bg-[#f5f6f8] text-[#14191e] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            Member app
          </Link>
          <Link to="/design/admin" className="bg-white border border-[#e8eaed] hover:bg-[#f5f6f8] text-[#14191e] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
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
              <h2 className="text-xl font-bold text-[#14191e] mb-4">{batch}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {screens.map((screen) => {
                  const status = pageDesignStatus.find((p) => p.id === screen.id);
                  return (
                    <Link
                      key={screen.id}
                      to={screen.path}
                      className="bg-white border border-[#e8eaed] rounded-2xl p-5 hover:border-[#0f6fec]/30 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#a1a5b3]">{screen.surface}</p>
                        {status && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusStyles[status.status]}`}>
                            {statusLabels[status.status]}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#14191e] group-hover:text-[#0f6fec] transition-colors">{screen.title}</h3>
                      {screen.prdRefs && (
                        <p className="text-[10px] text-[#a1a5b3] mt-2">{screen.prdRefs.join(' · ')}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
