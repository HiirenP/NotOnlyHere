'use client';

import { useState } from 'react';

export function AvaPanel() {
  const [consented, setConsented] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function grantConsent() {
    const response = await fetch('/api/ai/consent', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ consentType: 'AI_USE', granted: true }),
    });
    if (!response.ok) {
      setStatus('Could not record consent.');
      return;
    }
    setConsented(true);
    setStatus('Consent recorded. Ava is not therapy or emergency support.');
  }

  async function startChat() {
    const created = await fetch('/api/ai/conversations', { method: 'POST' });
    if (!created.ok) {
      setStatus('Could not start a conversation.');
      return;
    }
    const data = await created.json();
    setConversationId(data.id);
    setMessages([]);
  }

  async function send() {
    if (!conversationId || !input.trim()) return;
    const response = await fetch(`/api/ai/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: input }),
    });
    if (!response.ok) {
      setStatus('Message could not be sent.');
      return;
    }
    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      { role: 'USER', content: data.userMessage.content },
      { role: 'ASSISTANT', content: data.assistantMessage.content },
    ]);
    setInput('');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="surface-card p-6 space-y-3">
        <p className="font-mono text-xs text-foreground-600">
          Ava is an AI assistant, not a therapist or emergency service. Crisis resources are available on this page.
        </p>
        {!consented ? (
          <button type="button" onClick={grantConsent} className="btn-primary font-mono text-xs uppercase px-4 py-2">
            I understand — enable Ava
          </button>
        ) : (
          <button type="button" onClick={startChat} className="font-mono text-xs uppercase px-4 py-2 border rounded-lg">
            Start new conversation
          </button>
        )}
      </div>
      {conversationId ? (
        <div className="surface-card p-6 space-y-4">
          <ul className="space-y-3">
            {messages.map((message, index) => (
              <li key={index} className="font-mono text-sm">
                <span className="text-foreground-500">{message.role}: </span>
                {message.content}
              </li>
            ))}
          </ul>
          <textarea
            className="w-full min-h-20 border border-background-200 rounded-lg px-3 py-2 font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Ava"
          />
          <button type="button" onClick={send} className="btn-primary font-mono text-xs uppercase px-4 py-2">
            Send
          </button>
        </div>
      ) : null}
      {status ? <p className="font-mono text-sm text-foreground-600">{status}</p> : null}
    </div>
  );
}
