import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  tone?: 'neutral' | 'error'
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  tone = 'neutral',
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center gap-md p-xl text-center ${className}`}>
      {icon && (
        <span className={`text-4xl ${tone === 'error' ? 'text-error' : 'text-text-muted'}`}>
          {icon}
        </span>
      )}
      <h3 className="font-display text-h3 text-text">{title}</h3>
      {description && (
        <p className="max-w-prose text-body text-text-muted">{description}</p>
      )}
      {action}
    </div>
  )
}

export default EmptyState
