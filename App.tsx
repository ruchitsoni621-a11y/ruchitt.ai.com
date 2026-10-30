import { useState } from 'react';
import { api } from '@appdeploy/client';
import { Sparkles, ArrowUp, Plus } from 'lucide-react';
export default function App() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState('');
  async function send() {
    if (!draft.trim() || busy) return;
    const next = [...messages, { role: 'user', content: draft.trim() }];
    setMessages(next);
    setDraft('');
    setBusy(true);
    setErrorText('');
    try {
      const r = await api.post('/api/chat', { messages: next });
      setMessages([...next, { role: 'assistant', content: r.data.text }]);
    } catch {
      setErrorText(
        'ruchit.ai could not answer just now. Please try again shortly.'
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <Sparkles /> ruchit<span>.ai</span>
        </div>
        <button
          className="new"
          onClick={() => {
            setMessages([]);
            setErrorText('');
          }}
        >
          <Plus size={16} /> New chat
        </button>
        <p className="label">YOUR AI SPACE</p>
        <p className="muted">A little curiosity can take you anywhere.</p>
        <p className="muted">Founded by Ruchit Soni, a 16-year-old student from India.</p>
        <div className="powered">● AI powered by AppDeploy's managed AI service</div>
      </aside>
      <main>
        <header>
          ✦ ruchit.ai <span>READY TO HELP</span>
        </header>
        <section>
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="orb">
                <Sparkles size={30} />
              </div>
              <small>YOUR THOUGHT PARTNER</small>
              <h1>
                Big ideas start
                <br />
                with <em>a conversation.</em>
              </h1>
              <p>
                A little curiosity can take you anywhere.
                <br />
                What would you like to explore today?
              </p>
              <div className="cards">
                {[
                  ['✦', 'Write something', 'Help me write something engaging.'],
                  ['⌘', 'Learn a topic', 'Teach me a new topic simply.'],
                  ['↗', 'Build an idea', 'Help me make a practical plan.'],
                  [
                    '◈',
                    'Code with me',
                    'Help me create a small coding project.',
                  ],
                ].map(([i, t, p]) => (
                  <button
                    key={t}
                    onClick={() => {
                      setDraft(p);
                    }}
                  >
                    <b>
                      {i}　{t}
                    </b>
                    <small>{p}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="thread">
              {messages.map((m, i) => (
                <article key={i}>
                  <b>{m.role === 'user' ? 'You' : '✦ ruchit.ai'}</b>
                  <p>{m.content}</p>
                </article>
              ))}
              {busy && <p className="muted">ruchit.ai is thinking…</p>}
              {errorText && <p className="error">{errorText}</p>}
            </div>
          )}
        </section>
        <footer>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Ask anything…"
          />
          <button onClick={() => void send()} disabled={busy || !draft.trim()}>
            <ArrowUp size={18} />
          </button>
          <small>
            Founded by Ruchit Soni, a 16-year-old student from India. ruchit.ai can make mistakes; check important information.
          </small>
        </footer>
      </main>
    </div>
  );
}
