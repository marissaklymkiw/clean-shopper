import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { ChatBubble } from '../components/ChatBubble'
import { useChat } from '../lib/useChat'
import { useCart } from '../lib/CartContext'
import { getCategoryContext, formatCategoryContext } from '../lib/catalog'
import { useState } from 'react'

const SUGGESTED_PROMPTS = [
  'Is this fragrance-free?',
  'What ingredients should I avoid for sensitive skin?',
  'What does EWG Verified mean?',
  'Are parabens actually harmful?',
]

export function ChatPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const { cartCount } = useCart()

  const [categoryName, setCategoryName] = useState<string | null>(null)
  const [catalogContext, setCatalogContext] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!categoryId) return
    getCategoryContext(categoryId)
      .then((ctx) => {
        setCategoryName(ctx.categoryName)
        setCatalogContext(formatCategoryContext(ctx))
      })
      .catch(() => {})
  }, [categoryId])

  const { messages, input, setInput, loading, error, send, clear } = useChat(catalogContext)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const isEmpty = messages.length === 0 && !loading

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <NavBar
        active="chat"
        cartCount={cartCount}
        onNavigate={(key) => {
          if (key === 'home') navigate('/')
          else if (key !== 'chat') navigate(`/${key}`)
        }}
        onOpenCart={() => navigate('/cart')}
      />

      <main className="flex flex-1 flex-col">
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-xl p-xl text-center">
            <div className="flex flex-col items-center gap-md">
              {categoryName && (
                <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-sm py-xs text-small text-accent">
                  {categoryName}
                </span>
              )}
              <span className="font-display text-h2 text-text">
                {categoryName ? `Ask about ${categoryName}` : 'Ask me anything'}
              </span>
              <p className="max-w-sm text-body text-text-muted">
                {categoryName
                  ? `I have ingredient and rating data for the ${categoryName.toLowerCase()} products in the Clean Shopper catalog.`
                  : 'I can help you find out if a product is fragrance-free, explain what an ingredient is, or guide you through certifications and clean standards.'}
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-small text-text-muted underline underline-offset-2 hover:text-accent transition-colors"
              >
                ← Browse products
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-sm">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  className="rounded-full border border-border bg-surface px-md py-sm text-small text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-md px-lg py-xl max-w-2xl mx-auto w-full">
            {categoryName && (
              <div className="flex justify-center">
                <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-sm py-xs text-small text-accent">
                  {categoryName} context loaded
                </span>
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {loading && <ChatBubble role="assistant" content="" loading />}
            {error && (
              <div className="flex justify-start">
                <p className="max-w-[75%] rounded-lg border border-error/30 bg-error/5 px-md py-sm text-small text-error">
                  {error}
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      <div className="sticky bottom-0 border-t border-border bg-bg px-lg py-md">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input) }}
          className="mx-auto flex max-w-2xl items-center gap-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ingredients, certifications, or products…"
            disabled={loading}
            aria-label="Message"
            className="flex-1 rounded-md border border-border bg-surface px-md py-sm text-body text-text placeholder:text-text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-1 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-busy={loading}
            className="inline-flex items-center justify-center gap-sm rounded-md bg-accent px-lg py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
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
  )
}

export default ChatPage
