import type { ReactNode } from 'react'

export interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
}

const VARIANTS = {
  primary: 'bg-accent text-surface px-lg py-sm hover:bg-accent-hover',
  secondary: 'bg-transparent text-accent border border-accent px-lg py-sm hover:text-accent-hover hover:border-accent-hover hover:bg-accent/5',
  ghost: 'bg-transparent border border-border text-text-muted px-sm py-xs text-small hover:border-accent hover:text-accent',
}

const DISABLED = 'bg-border text-text-muted border-transparent cursor-not-allowed pointer-events-none'

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-sm rounded-md text-body font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
        isDisabled ? DISABLED : VARIANTS[variant]
      } ${className}`}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  )
}

export default Button
