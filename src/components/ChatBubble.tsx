import type { Message } from '../lib/useChat'

// Renders a line converting **bold** and *italic* spans.
function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return part
      })}
    </>
  )
}

// Renders assistant markdown: paragraphs, bullet lists, bold, italic.
export function AssistantContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/)
  return (
    <div className="flex flex-col gap-sm">
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        const isList = lines.every((l) => /^[-*]\s/.test(l.trim()) || l.trim() === '')
        if (isList) {
          return (
            <ul key={bi} className="flex flex-col gap-xs pl-md list-none">
              {lines.filter((l) => l.trim()).map((l, li) => (
                <li key={li} className="flex gap-sm">
                  <span className="shrink-0 text-text-muted">–</span>
                  <span><InlineMd text={l.replace(/^[-*]\s+/, '')} /></span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={bi}>
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                <InlineMd text={line} />
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

// ChatBubble — per component-spec.md §9
export function ChatBubble({
  role,
  content,
  loading,
}: {
  role: Message['role']
  content: string
  loading?: boolean
}) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-lg px-md py-sm text-body ${
          isUser
            ? 'bg-accent text-surface rounded-br-sm'
            : 'bg-surface text-text border border-border shadow-sm rounded-bl-sm'
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-xs" aria-label="Thinking…">
            <span className="h-2 w-2 rounded-full bg-border/60 animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="h-2 w-2 rounded-full bg-border/60 animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-2 rounded-full bg-border/60 animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
        ) : isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <AssistantContent content={content} />
        )}
      </div>
    </div>
  )
}
