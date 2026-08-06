'use client';

import { useState } from 'react';
import type { AccountResponse } from '@notonlyhere/contracts';
import { MemberShell } from '@/components/MemberShell';

export function AnalyticsPanel({ account }: { account: AccountResponse }) {
  const [funnel, setFunnel] = useState<{ steps: Array<{ label: string; count: number }> } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadFunnel() {
    const response = await fetch('/api/admin/analytics/funnel');
    if (!response.ok) {
      setMessage('Analytics access denied or unavailable.');
      return;
    }
    setFunnel(await response.json());
    setMessage(null);
  }

  async function requestExport() {
    const response = await fetch('/api/admin/analytics/exports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        reportType: 'overview',
        filters: {},
        idempotencyKey: `web-${Date.now()}`,
      }),
    });
    if (!response.ok) {
      setMessage('Export failed.');
      return;
    }
    const data = await response.json();
    setMessage(`Export ${data.id} is ${data.status}.`);
  }

  return (
    <MemberShell account={account} title="Analytics">
      <div className="max-w-3xl space-y-6">
        <div className="flex gap-3">
          <button type="button" onClick={loadFunnel} className="btn-primary font-mono text-xs uppercase px-4 py-2">
            Load funnel
          </button>
          <button type="button" onClick={requestExport} className="btn-secondary font-mono text-xs uppercase px-4 py-2">
            Export overview
          </button>
        </div>
        {message ? <p className="font-mono text-xs text-foreground-500">{message}</p> : null}
        {funnel ? (
          <ul className="space-y-2">
            {funnel.steps.map((step) => (
              <li key={step.label} className="surface-card p-4 flex justify-between font-mono text-sm">
                <span>{step.label}</span>
                <span>{step.count}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </MemberShell>
  );
}
