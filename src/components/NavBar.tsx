/**
 * NavBar — Clean Shopper
 *
 * Built to docs/component-spec.md §5. Styled entirely with design tokens from
 * tailwind.config.js (generated from docs/design.md). No hardcoded color values,
 * font sizes, or spacing — every utility resolves to a named token:
 *   bg-surface / border-border / text-text / text-text-muted / text-accent /
 *   bg-accent / text-surface, font-display / text-h3 / text-body / text-small,
 *   px-lg / py-sm / gap-lg / px-sm, rounded-md / rounded-full, shadow-sm.
 */

import { Link } from "react-router-dom";

export type NavKey = "home" | "chat" | "compare" | "preferences";

const NAV_ITEMS: { key: NavKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "chat", label: "Chat" },
];

export interface NavBarProps {
  /** Highlights the current section. Defaults to "home". */
  active?: NavKey;
  /** Item count badge on the cart control; the pill is hidden when 0 / undefined. */
  cartCount?: number;
  /** Controlled search query value. */
  searchQuery?: string;
  /** Fires on each keystroke in the search field. */
  onSearchChange?: (value: string) => void;
  /** Nav-item click handler. */
  onNavigate?: (key: NavKey) => void;
  /** Cart click handler. */
  onOpenCart?: () => void;
  /** Optional extra classes for layout. */
  className?: string;
}

export function NavBar({
  active = "home",
  cartCount,
  searchQuery = "",
  onSearchChange,
  onNavigate,
  onOpenCart,
  className = "",
}: NavBarProps) {
  const hasItems = typeof cartCount === "number" && cartCount > 0;

  const searchField = onSearchChange !== undefined ? (
    <div className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search Clean Shopper"
        aria-label="Search products"
        className="w-full rounded-md border border-border bg-surface px-md py-sm text-body text-text placeholder:text-text-muted focus:border-accent focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-1"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
          className="absolute right-sm top-1/2 -translate-y-1/2 p-xs text-text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ✕
        </button>
      )}
    </div>
  ) : null;

  return (
    <header
      className={`sticky top-0 z-10 border-b border-border bg-bg shadow-sm ${className}`}
    >
      {/* Primary row — brand / search (desktop) / nav / cart */}
      <div className="flex items-center gap-md px-lg py-sm">
        <Link to="/" className="font-display text-h3 text-text shrink-0 hover:text-accent transition-colors">Clean Shopper</Link>

        {/* Search — desktop only, grows to fill space */}
        {onSearchChange !== undefined && (
          <div className="relative hidden flex-1 md:block">{searchField}</div>
        )}

        {/* Nav links — desktop only */}
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-lg md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate?.(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`text-body font-medium transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-text-muted"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Cart — always visible */}
        <button
          type="button"
          onClick={onOpenCart}
          className="inline-flex shrink-0 items-center gap-sm rounded-md bg-accent px-lg py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Cart
          {hasItems && (
            <span
              className="inline-flex items-center rounded-full bg-surface px-sm text-small text-accent"
              aria-label={`${cartCount} items in cart`}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile search row — full width, below the brand/cart strip */}
      {onSearchChange !== undefined && (
        <div className="px-lg pb-sm md:hidden">{searchField}</div>
      )}
    </header>
  );
}

export default NavBar;
