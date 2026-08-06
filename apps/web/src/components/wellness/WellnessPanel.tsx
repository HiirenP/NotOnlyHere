'use client';

import { useState } from 'react';

export function WellnessPanel() {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [trends, setTrends] = useState<{ points: { date: string; mood: number | null }[]; average: number | null } | null>(null);

  async function save() {
    const response = await fetch('/api/wellness/checkins', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mood, note: note || null, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    });
    if (!response.ok) {
      setMessage('Could not save check-in.');
      return;
    }
    setMessage('Check-in saved.');
    loadTrends();
  }

  async function loadTrends() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`/api/wellness/trends?window=7d&timeZone=${encodeURIComponent(tz)}`);
    if (response.ok) setTrends(await response.json());
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="surface-card p-6 space-y-4">
        <label className="font-mono text-xs uppercase tracking-widest text-foreground-500 block">
          Mood (1–5)
          <input
            type="range"
            min={1}
            max={5}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full mt-2"
          />
        </label>
        <p className="font-mono text-sm text-center">{mood}</p>
        <textarea
          className="w-full min-h-20 border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
          placeholder="Optional private note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="button" onClick={save} className="btn-primary font-mono text-xs uppercase px-4 py-2">
          Save check-in
        </button>
        {message ? <p className="font-mono text-sm text-foreground-600">{message}</p> : null}
      </div>
      <div className="surface-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-500">7-day trend</h2>
          <button type="button" onClick={loadTrends} className="font-mono text-xs uppercase text-foreground-600">
            Refresh
          </button>
        </div>
        {trends ? (
          <>
            <p className="font-mono text-sm text-foreground-700">
              Average mood: {trends.average ? trends.average.toFixed(1) : '—'}
            </p>
            <ul className="space-y-1 font-mono text-xs text-foreground-600">
              {trends.points.map((point) => (
                <li key={point.date}>
                  {point.date}: {point.mood ?? 'no check-in'}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="font-mono text-sm text-foreground-500">Load trends to see your week.</p>
        )}
      </div>
    </div>
  );
}
