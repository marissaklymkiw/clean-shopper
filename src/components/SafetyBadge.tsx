export type SafetyLevel = 'clean' | 'caution' | 'avoid'

const LEVELS: Record<SafetyLevel, { defaultLabel: string; classes: string }> = {
  clean:   { defaultLabel: 'Clean',   classes: 'bg-success/10 text-success border-success' },
  caution: { defaultLabel: 'Caution', classes: 'bg-warning/10 text-warning border-warning' },
  avoid:   { defaultLabel: 'Avoid',   classes: 'bg-error/10 text-error border-error' },
}

export interface SafetyBadgeProps {
  level: SafetyLevel
  score?: number
  label?: string
  className?: string
}

export function SafetyBadge({ level, score, label, className = '' }: SafetyBadgeProps) {
  const config = LEVELS[level]
  const displayLabel = label ?? (score != null ? `${config.defaultLabel} · ${score}` : config.defaultLabel)
  return (
    <span
      className={`inline-flex items-center rounded-full border px-sm py-xs text-small ${config.classes} ${className}`}
      aria-label={`Safety verdict: ${config.defaultLabel}${score != null ? `, score ${score} of 100` : ''}`}
    >
      {displayLabel}
    </span>
  )
}

export default SafetyBadge
