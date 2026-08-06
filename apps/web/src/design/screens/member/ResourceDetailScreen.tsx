'use client';

import { useEffect, useState } from 'react';
import type { AccountResponse, ResourceDetail } from '@notonlyhere/contracts';
import { resourceToCard } from '@/design/api/mappers';
import { PageHeader, TBtn, TCard } from '@/design/components/template';
import { MemberShell } from '@/design/layouts/Shells';

export function ResourceDetailScreen({ account, slug }: { account: AccountResponse; slug: string }) {
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch(`/api/resources/by-slug/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ResourceDetail | null) => {
        if (data) {
          setResource(data);
          setProgress(data.viewer.progressPercent);
        }
      });
  }, [slug]);

  async function markProgress(percent: number) {
    if (!resource) return;
    await fetch(`/api/resources/${encodeURIComponent(resource.id)}/progress`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ progressPercent: percent }),
    });
    setProgress(percent);
  }

  if (!resource) {
    return (
      <MemberShell account={account}>
        <TCard className="text-sm text-[#676a79]">Loading resource…</TCard>
      </MemberShell>
    );
  }

  const card = resourceToCard(resource, 0);

  return (
    <MemberShell account={account}>
      <PageHeader title={resource.title} subtitle={resource.kind} />
      <TCard className="p-0 overflow-hidden mb-4">
        <img src={card.image} alt="" className="w-full h-48 object-cover" />
        <div className="p-6">
          <p className="text-sm text-[#676a79] leading-relaxed">{resource.summary}</p>
          {resource.bodyPlain && (
            <p className="text-sm text-[#14191e] mt-4 leading-relaxed whitespace-pre-wrap">{resource.bodyPlain}</p>
          )}
          <div className="mt-4 h-2 bg-[#f5f6f8] rounded-full">
            <div className="h-full bg-[#0f6fec] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-[#676a79] mt-2">{progress}% complete</p>
          <div className="flex gap-2 mt-4">
            <TBtn onClick={() => markProgress(Math.min(100, progress + 25))}>
              {progress >= 100 ? 'Completed' : 'Mark progress +25%'}
            </TBtn>
            {progress < 100 && <TBtn variant="outline" onClick={() => markProgress(100)}>Mark complete</TBtn>}
          </div>
        </div>
      </TCard>
    </MemberShell>
  );
}
