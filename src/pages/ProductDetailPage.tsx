import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import CategoryTag from "../components/CategoryTag";
import ChatDrawer from "../components/ChatDrawer";
import { getProductById, formatProductContext, type ProductDetail, type SafetyLevel } from "../lib/catalog";
import { useCart } from "../lib/CartContext";

const SAFETY_COLORS: Record<SafetyLevel, string> = {
  clean: "border border-success bg-success/10 text-success",
  caution: "border border-warning bg-warning/10 text-warning",
  avoid: "border border-error bg-error/10 text-error",
};

function SafetyPill({ level, label, className = "" }: { level: SafetyLevel; label: string; className?: string }) {
  return (
    <span
      aria-label={`Safety: ${label}`}
      className={`inline-flex items-center rounded-full px-sm py-xs text-small ${SAFETY_COLORS[level]} ${className}`}
    >
      {label}
    </span>
  );
}

const CONCERN_LABEL: Record<string, string> = {
  none: "No concern",
  caution: "Use with caution",
  avoid: "Avoid",
};

const CONCERN_COLORS: Record<string, string> = {
  none: "text-success",
  caution: "text-warning",
  avoid: "text-error",
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedIds, cartIds, cartCount, toggleSaved, toggleCart } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    getProductById(id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setProduct(data);
        setLoading(false);
      })
      .catch(() => { setFetchError(true); setLoading(false); });
  }, [id]);

  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <NavBar active="home" cartCount={cartCount} onNavigate={() => navigate("/")} onOpenCart={() => navigate('/cart')} />

      <ChatDrawer
        context={product ? formatProductContext(product) : null}
        contextLabel={product?.name ?? null}
      />

      <main className="mx-auto max-w-3xl px-lg py-xl">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-lg text-body text-text-muted hover:text-accent transition-colors"
        >
          ← Back
        </button>

        {loading ? (
          <LoadingSkeleton />
        ) : fetchError ? (
          <FetchError onBack={() => navigate("/")} />
        ) : notFound ? (
          <NotFound onBack={() => navigate("/")} />
        ) : product ? (
          <ProductContent
            product={product}
            saved={savedIds.has(product.id)}
            onToggleSave={() => toggleSaved(product.id)}
            inCart={cartIds.has(product.id)}
            onToggleCart={() => toggleCart(product.id)}
          />
        ) : null}
      </main>
    </div>
  );
}

function ProductContent({ product, saved, onToggleSave, inCart, onToggleCart }: {
  product: ProductDetail;
  saved: boolean;
  onToggleSave: () => void;
  inCart: boolean;
  onToggleCart: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="rounded-lg border border-border bg-surface p-lg shadow-md">
        <div className="flex items-start justify-between gap-md">
          <div className="flex flex-col gap-xs">
            {product.brand && (
              <span className="font-body text-small uppercase tracking-wide text-text-muted">
                {product.brand}
              </span>
            )}
            <h1 className="font-display text-h1 text-text">{product.name}</h1>
          </div>
          <SafetyPill
            level={product.safety}
            label={`${product.safety.charAt(0).toUpperCase() + product.safety.slice(1)} · ${product.cleanScore}`}
            className="shrink-0 mt-xs"
          />
        </div>

        <div className="mt-md flex flex-wrap items-center gap-sm">
          <CategoryTag label={product.categoryName} />
          {product.certifications.map((cert) => (
            <CategoryTag key={cert.slug} label={cert.name} />
          ))}
        </div>

        <div className="mt-lg flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={onToggleSave}
            className={`inline-flex items-center gap-sm rounded-md border px-lg py-sm text-body font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              saved
                ? "border-accent bg-accent/10 text-accent hover:bg-accent/20"
                : "border-border bg-surface text-text hover:border-accent hover:text-accent"
            }`}
          >
            {saved ? "Saved ♥" : "Save ♡"}
          </button>
          <button
            type="button"
            onClick={onToggleCart}
            className={`inline-flex items-center gap-sm rounded-md border px-lg py-sm text-body font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              inCart
                ? "border-accent bg-accent text-surface hover:bg-accent-hover"
                : "border-border bg-surface text-text hover:border-accent hover:text-accent"
            }`}
          >
            {inCart ? "In cart" : "Add to cart"}
          </button>
        </div>
      </div>

      {/* Clean evaluation panel */}
      <section className="mt-lg rounded-lg border border-border bg-surface p-xl shadow-md">
        <h2 className="font-display text-h2 text-text">Clean evaluation</h2>
        <p className="mt-md text-body text-text-muted">
          Score is derived from ingredient safety ratings weighted by label prominence (ingredient #1 is the largest component of the product).
        </p>

        {/* Score summary */}
        <div className="mt-xl flex items-center gap-md rounded-md bg-border/20 p-lg">
          <SafetyPill
            level={product.safety}
            label={product.safety.charAt(0).toUpperCase() + product.safety.slice(1)}
          />
          <div>
            <p className="font-body text-body font-medium text-text">
              Clean score: {product.cleanScore} / 100
            </p>
            <p className="text-small text-text-muted">
              {product.safety === "clean" && "Meets clean standards — low concern across all ingredients."}
              {product.safety === "caution" && "Some ingredients warrant attention — review the breakdown below."}
              {product.safety === "avoid" && "One or more high-concern ingredients detected."}
            </p>
          </div>
        </div>

        {/* Ingredient breakdown */}
        {product.ingredients.length > 0 && (
          <div className="mt-xl">
            <h3 className="font-display text-h3 text-text mb-lg">Ingredient breakdown</h3>
            <p className="mb-sm text-small text-text-muted">Listed in order of label prominence (most prominent first).</p>
            <ol className="flex flex-col gap-xs">
              {product.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-xs border-b border-border py-sm last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-sm">
                    <span className="text-body font-medium text-text">{ing.name}</span>
                    <span className={`text-small font-medium shrink-0 ${CONCERN_COLORS[ing.concernLevel]}`}>
                      {CONCERN_LABEL[ing.concernLevel]}
                    </span>
                  </div>
                  {ing.concernReason && (
                    <p className="text-small text-text-muted">{ing.concernReason}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Certifications */}
        {product.certifications.length > 0 && (
          <div className="mt-2xl">
            <h3 className="font-display text-h3 text-text mb-md">Certifications</h3>
            <div className="flex flex-wrap gap-sm">
              {product.certifications.map((cert) => (
                <span
                  key={cert.slug}
                  className="rounded-full border border-success bg-success/10 px-sm py-xs text-small text-success"
                >
                  {cert.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-lg animate-pulse">
      <div className="rounded-lg border border-border bg-surface p-lg shadow-md flex flex-col gap-md">
        <div className="h-6 w-32 rounded-md bg-border/40" />
        <div className="h-10 w-2/3 rounded-md bg-border/40" />
        <div className="h-5 w-24 rounded-full bg-border/40" />
      </div>
      <div className="rounded-lg border border-border bg-surface p-lg shadow-md flex flex-col gap-md">
        <div className="h-8 w-48 rounded-md bg-border/40" />
        <div className="h-16 rounded-md bg-border/40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 rounded-md bg-border/40" />
        ))}
      </div>
    </div>
  );
}

function FetchError({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-md p-xl text-center">
      <h2 className="font-display text-h2 text-text">Couldn't load product</h2>
      <p className="max-w-prose text-body text-text-muted">
        Something went wrong. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center rounded-md bg-accent px-lg py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover"
      >
        Back to browse
      </button>
    </div>
  );
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-md p-xl text-center">
      <h2 className="font-display text-h2 text-text">Product not found</h2>
      <p className="max-w-prose text-body text-text-muted">
        This product doesn't exist or may have been removed from the catalog.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center rounded-md bg-accent px-lg py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover"
      >
        Back to browse
      </button>
    </div>
  );
}

export default ProductDetailPage;
