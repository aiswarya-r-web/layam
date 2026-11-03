import { useEffect, useRef, useState } from 'react'
import { PawPrint, Send, X } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

const SUGGESTIONS = [
  'Best toys for a puppy?',
  'How does delivery work?',
  'Healthy treats for senior dogs',
]

const GREETING = {
  role: 'assistant',
  content: "Woof! I'm Paw-sistant 🐾 Ask me about products, orders, delivery or dog care.",
}

export default function PawAssistant() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (open) listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, open])

  if (!user) return null

  const send = async (text = input) => {
    const content = text.trim()
    if (!content || busy) return
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const res = await api.post('/assistant/chat', { messages: next })
      setMessages((m) => [...m, { role: 'assistant', content: res.data.reply }])
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: e.response?.data?.message || 'Sorry, I could not fetch a reply.' },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[420px] w-[320px] flex-col overflow-hidden rounded-[20px] border border-[var(--line)] bg-white shadow-2xl sm:right-6">
          <div className="flex items-center gap-2 bg-[var(--brand)] px-4 py-3 text-white">
            <PawPrint size={18} />
            <p className="font-extrabold">Paw-sistant</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ml-auto rounded-full p-1 transition hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[var(--input)] p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-[var(--brand)] text-white'
                      : 'rounded-bl-sm bg-white text-[var(--text)] shadow-sm'
                  }`}
                >
                  {m.content}
                </p>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm">
                  <Spinner className="h-4 w-4 border-[var(--brand)]/30 border-t-[var(--brand)]" />
                </p>
              </div>
            )}
            {messages.length === 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-[var(--line-2)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand)] transition hover:bg-[var(--cream)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="flex items-center gap-2 border-t border-[var(--line)] p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Paw-sistant..."
              className="w-full rounded-full border border-[var(--line-2)] bg-[var(--input)] px-4 py-2 text-sm outline-none focus:border-[var(--accent-dark)]"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white transition hover:bg-[var(--brand-dark)] disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Open Paw-sistant"
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-xl transition hover:scale-110 hover:bg-[var(--brand-dark)] sm:right-6"
      >
        {open ? <X size={22} /> : <PawPrint size={24} />}
      </button>
    </>
  )
}
