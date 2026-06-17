export type SafetyLevel = "clean" | "caution" | "avoid";

export interface ProductCardProps {
  name: string;
  safety: SafetyLevel;
  score?: number;
  brand?: string;
  category: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  loading?: boolean;
  onCardClick?: () => void;
  /** Fires when the bookmark/save icon is toggled. */
  onSave?: () => void;
  /** Whether this product is already saved to the list. */
  saved?: boolean;
  /** Fires when the add-to-cart button is clicked. */
  onAddToCart?: () => void;
  /** Whether this product is already in the cart. */
  inCart?: boolean;
  className?: string;
}

const SAFETY: Record<SafetyLevel, { label: string; badge: string }> = {
  clean: { label: "Clean", badge: "border border-success bg-success/10 text-success" },
  caution: { label: "Caution", badge: "border border-warning bg-warning/10 text-warning" },
  avoid: { label: "Avoid", badge: "border border-error bg-error/10 text-error" },
};

export function ProductCard({
  name,
  safety,
  score,
  brand,
  category,
  description,
  imageUrl,
  loading = false,
  onCardClick,
  onSave,
  saved = false,
  onAddToCart,
  inCart = false,
  className = "",
}: ProductCardProps) {
  const cardClasses = `relative flex flex-col gap-md rounded-lg border border-border bg-surface p-lg shadow-md transition-shadow hover:shadow-lg group ${onCardClick ? "cursor-pointer" : ""} ${className}`;

  if (loading) {
    return (
      <article className={cardClasses} aria-busy="true" aria-live="polite">
        <div className="h-h3 w-2/3 animate-pulse rounded-md bg-border/40" />
        <div className="h-small w-1/3 animate-pulse rounded-full bg-border/40" />
        <div className="h-body w-full animate-pulse rounded-md bg-border/40" />
        <div className="h-body w-4/5 animate-pulse rounded-md bg-border/40" />
      </article>
    );
  }

  const verdict = SAFETY[safety];
  const hasScore = typeof score === "number";
  const badgeLabel = hasScore ? `${verdict.label} · ${score}` : verdict.label;

  return (
    <article
      className={cardClasses}
      onClick={onCardClick}
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onKeyDown={onCardClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCardClick(); }
      } : undefined}
    >
      {imageUrl && (
        <img src={imageUrl} alt="" className="aspect-video w-full rounded-md object-cover" />
      )}

      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col gap-xs">
          {brand && (
            <span className="font-body text-small uppercase tracking-wide text-text-muted">{brand}</span>
          )}
          <h3 className="font-display text-h3 text-text">{name}</h3>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-sm py-xs text-small ${verdict.badge}`}
          aria-label={`Safety verdict: ${verdict.label}${hasScore ? `, score ${score} of 100` : ""}`}
        >
          {badgeLabel}
        </span>
      </div>

      <span className="inline-flex self-start rounded-full border border-border px-sm py-xs text-small text-text-muted">
        {category}
      </span>

      {description && <p className="text-body text-text-muted">{description}</p>}

      {/* Card actions — visible on hover or when active */}
      {(onSave || onAddToCart) && (
        <div className="flex items-center gap-sm opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          {onSave && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSave(); }}
              aria-label={saved ? "Remove from saved list" : "Save to list"}
              title={saved ? "Remove from saved list" : "Save to list"}
              className={`rounded-full border px-sm py-xs text-small transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                saved
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {saved ? "Saved ♥" : "Save ♡"}
            </button>
          )}
          {onAddToCart && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              aria-label={inCart ? "Remove from cart" : "Add to cart"}
              title={inCart ? "Remove from cart" : "Add to cart"}
              className={`rounded-full border px-sm py-xs text-small transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                inCart
                  ? "border-accent bg-accent text-surface hover:bg-accent-hover"
                  : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {inCart ? "In cart" : "+ Cart"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default ProductCard;
