'use client';

import { useEffect, useState } from 'react';
import type { ConnectionItem } from '@notonlyhere/contracts';
import { connectionToSuggestion } from '@/design/api/mappers';
import { TCard } from '@/design/components/template';
import { suggestedConnections } from '@/design/data/mock';
import { DesignLink } from '@/design/navigation';

type Suggestion = ReturnType<typeof connectionToSuggestion>;

export function FeedRightRail() {
  const [connections, setConnections] = useState<Suggestion[]>(suggestedConnections);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile/me').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/connections').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([profile, data]: [{ id: string } | null, ConnectionItem[]]) => {
        if (!Array.isArray(data) || !profile?.id) return;
        const accepted = data
          .filter((c) => c.status === 'ACCEPTED')
          .slice(0, 3)
          .map((c) => connectionToSuggestion(c, profile.id));
        if (accepted.length) setConnections(accepted);
      })
      .catch(() => undefined);
  }, []);

  return (
    <aside className="hidden xl:block w-[300px] shrink-0 space-y-4 sticky top-[86px] self-start max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
      <TCard className="!rounded-lg">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">Your connections</h3>
        <div className="space-y-4">
          {connections.map((p) => (
            <div key={p.username} className="flex items-center gap-3">
              <DesignLink href={`/app/profile/${p.username}`}>
                <img src={p.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              </DesignLink>
              <div className="flex-1 min-w-0">
                <DesignLink href={`/app/profile/${p.username}`} className="text-sm font-semibold text-[#14191e] truncate block hover:text-[#0f6fec]">
                  {p.name}
                </DesignLink>
                <p className="text-xs text-[#676a79] truncate">@{p.username}</p>
              </div>
              <DesignLink
                href={`/app/profile/${p.username}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#0f6fec]/10 hover:bg-[#0f6fec] text-[#0f6fec] hover:text-white transition-colors shrink-0"
              >
                View
              </DesignLink>
            </div>
          ))}
        </div>
        <DesignLink href="/app/search" className="block w-full mt-4 py-2 text-sm font-semibold text-center text-[#676a79] hover:text-[#0f6fec] border border-[#e8eaed] rounded-md hover:border-[#0f6fec]/30 transition-colors">
          Find more people
        </DesignLink>
      </TCard>

      <TCard className="!rounded-lg">
        <h3 className="text-sm font-bold text-[#14191e] mb-4">Quick links</h3>
        <div className="space-y-2 text-sm">
          <DesignLink href="/app/events" className="block text-[#676a79] hover:text-[#0f6fec]">Upcoming events</DesignLink>
          <DesignLink href="/app/resources" className="block text-[#676a79] hover:text-[#0f6fec]">Learning resources</DesignLink>
          <DesignLink href="/app/mood" className="block text-[#676a79] hover:text-[#0f6fec]">Mood check-in</DesignLink>
        </div>
      </TCard>
    </aside>
  );
}

export { GroupCard } from './GroupCard';
