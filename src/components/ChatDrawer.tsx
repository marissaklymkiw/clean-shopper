import { useEffect, useRef, useState } from 'react'
import { ChatBubble } from './ChatBubble'
import { useChat } from '../lib/useChat'

interface ChatDrawerProps {
  context?: string | null
  contextLabel?: string | null
}

const SUGGESTED_PROMPTS = [
  'Is this fragrance-free?',
  'What ingredients should I avoid for sensitive skin?',
  'What does EWG Verified mean?',
]

export function ChatDrawer({ context, contextLabel }: ChatDrawerProps) {
  const [open, setOpen] = useState(false)
  const { messages, input, setInput, loading, error, send, clear } = useChat(context)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when drawer opens
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const isEmpty = messages.length === 0 && !loading

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
          className="fixed bottom-xl right-xl z-20 inline-flex items-center gap-sm rounded-full bg-accent px-lg py-sm text-body font-medium text-surface shadow-lg transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Ask AI
        </button>
      )}

      {/* Drawer panel */}
      {open && (
        <div
          className="fixed inset-y-0 right-0 z-20 flex w-full flex-col bg-bg shadow-lg sm:w-96"
          role="dialog"
          aria-label="Chat assistant"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-md py-sm">
            <div className="flex items-center gap-sm">
              <span className="font-display text-h3 text-text">Ask AI</span>
              {contextLabel && (
                <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-sm py-xs text-small text-accent">
                  {contextLabel}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-xs text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-lg p-lg text-center">
                <p className="text-body text-text-muted">
                  {contextLabel
                    ? `Ask me anything about ${contextLabel}.`
                    : 'Ask me about ingredients, certifications, or products.'}
                </p>
                <div className="flex flex-col gap-sm w-full">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt)}
                      className="rounded-md border border-border bg-surface px-md py-sm text-small text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-md p-md">
                {messages.map((msg, i) => (
                  <ChatBubble key={i} role={msg.role} content={msg.content} />
                ))}
                {loading && <ChatBubble role="assistant" content="" loading />}
                {error && (
                  <div className="flex justify-start">
                    <p className="max-w-[90%] rounded-lg border border-error/30 bg-error/5 px-md py-sm text-small text-error">
                      {error}
                    </p>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-border bg-bg px-md py-sm">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input) }}
              className="flex items-center gap-sm"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                disabled={loading}
                aria-label="Message"
                className="flex-1 rounded-md border border-border bg-surface px-md py-sm text-body text-text placeholder:text-text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-1 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-busy={loading}
                className="inline-flex items-center justify-center rounded-md bg-accent px-md py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  'Send'
                )}
              </button>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  disabled={loading}
                  title="End conversation"
                  aria-label="End conversation"
                  className="shrink-0 rounded-md border border-border bg-surface px-sm py-sm text-small text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  End chat
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatDrawer
