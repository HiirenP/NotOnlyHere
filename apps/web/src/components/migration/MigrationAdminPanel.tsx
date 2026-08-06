'use client';

import { useState } from 'react';
import type { AccountResponse } from '@notonlyhere/contracts';
import { MemberShell } from '@/components/MemberShell';

type ReconciliationSummary = {
  latestRun: { id: string; status: string; sourceSystem: string } | null;
  pendingClaims: number;
  reconciled: boolean;
};

type Readiness = {
  ready: boolean;
  checks: Array<{ key: string; ok: boolean; detail: string }>;
};

export function MigrationAdminPanel({ account }: { account: AccountResponse }) {
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadSummary() {
    const response = await fetch('/api/admin/migration/reconciliation');
    if (!response.ok) {
      setMessage('Could not load reconciliation summary.');
      return;
    }
    setSummary(await response.json());
    setMessage(null);
  }

  async function loadReadiness() {
    const response = await fetch('/api/admin/migration/release-readiness');
    if (!response.ok) {
      setMessage('Could not load release readiness.');
      return;
    }
    setReadiness(await response.json());
    setMessage(null);
  }

  return (
    <MemberShell account={account} title="Migration">
      <div className="max-w-3xl space-y-6">
        <div className="flex gap-3">
          <button type="button" onClick={loadSummary} className="btn-primary font-mono text-xs uppercase px-4 py-2">
            Reconciliation
          </button>
          <button type="button" onClick={loadReadiness} className="btn-secondary font-mono text-xs uppercase px-4 py-2">
            Release readiness
          </button>
        </div>
        {message ? <p className="font-mono text-xs text-foreground-500">{message}</p> : null}
        {summary ? (
          <div className="surface-card p-5 space-y-2 font-mono text-sm">
            <p>Latest run: {summary.latestRun?.status ?? 'none'}</p>
            <p>Pending claims: {summary.pendingClaims}</p>
            <p>Reconciled: {summary.reconciled ? 'yes' : 'no'}</p>
          </div>
        ) : null}
        {readiness ? (
          <ul className="space-y-2">
            {readiness.checks.map((check) => (
              <li key={check.key} className="surface-card p-4 font-mono text-sm flex justify-between gap-4">
                <span>{check.key}</span>
                <span>{check.ok ? 'ok' : 'fail'}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </MemberShell>
  );
}
