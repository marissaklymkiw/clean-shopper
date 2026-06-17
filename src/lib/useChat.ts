import { useState } from 'react'
import { supabase } from './supabase'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat(catalogContext: string | null | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('chat', {
        body: { messages: nextMessages, context: catalogContext ?? undefined },
      })

      if (fnError) throw fnError
      if (data?.error) throw new Error(data.error)

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply as string }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setMessages([])
    setError(null)
  }

  return { messages, input, setInput, loading, error, send, clear }
}
