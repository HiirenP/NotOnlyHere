'use client';

import { useState } from 'react';
import type { AccountExportResponse } from '@notonlyhere/contracts';

export function DataSettingsPanel({ initialExport }: { initialExport: AccountExportResponse | null }) {
  const [password, setPassword] = useState('');
  const [exportState, setExportState] = useState(initialExport);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestExport() {
    setError(null);
    setMessage(null);
    const response = await fetch('/api/account/export', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password, idempotencyKey: `web-${Date.now()}` }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.detail ?? 'Export request failed.');
      return;
    }
    setExportState(body);
    setMessage('Export requested. Refresh this page after the worker processes it.');
    setPassword('');
  }

  async function requestDeletion() {
    if (!confirm('This will schedule account deletion after the grace period. Continue?')) return;
    setError(null);
    setMessage(null);
    const response = await fetch('/api/account/delete', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.detail ?? 'Deletion request failed.');
      return;
    }
    setMessage(body.message ?? 'Deletion scheduled.');
    setPassword('');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <section className="surface-card p-6 space-y-4">
        <h2 className="font-display text-lg uppercase">Your data export</h2>
        <p className="font-mono text-sm text-foreground-600">
          Request an account-wide export. Re-enter your password to confirm.
        </p>
        <input
          type="password"
          className="w-full border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={requestExport} className="btn-primary font-mono text-xs uppercase tracking-wider">
          Request export
        </button>
        {exportState ? (
          <div className="font-mono text-xs text-foreground-600 space-y-1">
            <p>Status: {exportState.status}</p>
            {exportState.downloadUrl ? (
              <a href={exportState.downloadUrl} className="text-primary-700 underline">
                Download export
              </a>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="surface-card p-6 space-y-4 border-red-200">
        <h2 className="font-display text-lg uppercase text-red-800">Delete account</h2>
        <p className="font-mono text-sm text-foreground-600">
          Schedules deletion after the grace period and signs you out immediately.
        </p>
        <button type="button" onClick={requestDeletion} className="font-mono text-xs uppercase tracking-wider text-red-700 border border-red-300 rounded-lg px-4 py-2">
          Request deletion
        </button>
      </section>

      {message ? <p className="font-mono text-sm text-primary-700">{message}</p> : null}
      {error ? <p className="font-mono text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
