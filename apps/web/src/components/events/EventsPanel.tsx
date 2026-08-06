'use client';

import { useState } from 'react';
import type { EventSummary, EventsListResponse, RsvpStatus } from '@notonlyhere/contracts';

export function EventsPanel({ initial }: { initial: EventsListResponse }) {
  const [events, setEvents] = useState<EventSummary[]>(initial.items);
  const [view, setView] = useState<'list' | 'month'>(initial.view);
  const [message, setMessage] = useState<string | null>(null);

  async function reload(nextView: 'list' | 'month') {
    const from = new Date().toISOString();
    const to = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();
    const response = await fetch(
      `/api/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&view=${nextView}`,
    );
    if (!response.ok) return;
    const data: EventsListResponse = await response.json();
    setEvents(data.items);
    setView(data.view);
  }

  async function setRsvp(eventId: string, status: RsvpStatus) {
    const response = await fetch(`/api/events/${eventId}/rsvp`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setMessage('Could not update RSVP.');
      return;
    }
    setMessage('RSVP updated.');
    await reload(view);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-2">
        {(['list', 'month'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => reload(mode)}
            className={`font-mono text-xs uppercase px-3 py-2 border rounded-lg ${
              view === mode ? 'border-primary-500 text-primary-800' : 'border-background-200'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      {message ? <p className="font-mono text-sm text-foreground-600">{message}</p> : null}
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="surface-card p-5 space-y-3">
            <div>
              <h2 className="font-display text-xl uppercase">{event.title}</h2>
              <p className="font-mono text-xs text-foreground-500">
                {new Date(event.startsAt).toLocaleString(undefined, { timeZone: event.timeZone })} ({event.timeZone})
              </p>
              {event.locationName ? (
                <p className="font-mono text-xs text-foreground-600">{event.locationName}</p>
              ) : null}
            </div>
            <p className="font-mono text-sm text-foreground-700">{event.description}</p>
            <p className="font-mono text-xs text-foreground-500">{event.counts.going} going</p>
            {event.viewer.canRsvp ? (
              <div className="flex flex-wrap gap-2">
                {(['GOING', 'MAYBE', 'NOT_GOING'] as RsvpStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setRsvp(event.id, status)}
                    className={`font-mono text-[10px] uppercase px-3 py-2 border rounded-lg ${
                      event.viewer.rsvpStatus === status
                        ? 'border-primary-500 text-primary-800'
                        : 'border-background-200'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      {events.length === 0 ? (
        <p className="font-mono text-sm text-foreground-500">No upcoming events in this range.</p>
      ) : null}
    </div>
  );
}
