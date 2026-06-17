/**
 * CategoryTag — Clean Shopper
 *
 * Built to docs/component-spec.md §4. A quiet outlined pill for category /
 * certification labels, with an optional interactive (filter) variant.
 * Token-only styling: border-border / bg-surface / text-text-muted / text-small /
 * text-accent / bg-accent / text-surface, px-sm / py-xs, rounded-full.
 */

export interface CategoryTagProps {
  /** Tag text, e.g. "Personal Care" or "EWG Verified". */
  label: string;
  /** Enables the hover/selected affordances when used as a filter. */
  interactive?: boolean;
  /** Selected state (interactive filter chips only) — accent fill. */
  selected?: boolean;
  /** Filter selection handler. */
  onClick?: () => void;
  /** Optional extra classes for layout. */
  className?: string;
}

export function CategoryTag({
  label,
  interactive = false,
  selected = false,
  onClick,
  className = "",
}: CategoryTagProps) {
  const base =
    "inline-flex items-center rounded-full border px-sm py-xs text-small transition-colors";

  if (!interactive) {
    return (
      <span
        className={`${base} border-border bg-surface text-text-muted ${className}`}
      >
        {label}
      </span>
    );
  }

  const state = selected
    ? "border-accent bg-accent text-surface"
    : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${base} ${state} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {label}
    </button>
  );
}

export default CategoryTag;
