import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import CategoryTag from "../components/CategoryTag";
import ProductCard from "../components/ProductCard";
import ChatDrawer from "../components/ChatDrawer";
import { getCategories, getProducts, searchProducts, getCategoryContext, formatCategoryContext, type Category, type ProductSummary } from "../lib/catalog";
import { useCart } from "../lib/CartContext";

export function BrowsePage() {
  const navigate = useNavigate();
  const { savedIds, cartIds, cartCount, toggleSaved, toggleCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [drawerContext, setDrawerContext] = useState<string | null>(null);
  const [drawerContextLabel, setDrawerContextLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductSummary[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input → commit to searchQuery after 350ms idle
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(value.trim()), 350);
  };

  // Run search whenever committed query changes
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    searchProducts(searchQuery)
      .then((data) => {
        setSearchResults(data);
        setSearchLoading(false);
      })
      .catch(() => {
        setSearchError("Search failed. Check your connection and try again.");
        setSearchLoading(false);
      });
  }, [searchQuery]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let queryOptions: { categoryIds?: string[] } | undefined;
    if (activeCategoryId) {
      const childIds = categories
        .filter((c) => c.parentId === activeCategoryId)
        .map((c) => c.id);
      const categoryIds = childIds.length > 0
        ? [activeCategoryId, ...childIds]
        : [activeCategoryId];
      queryOptions = { categoryIds };
    }

    getProducts(queryOptions)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong loading products. Check your connection and try again.");
        setLoading(false);
      });
  }, [activeCategoryId, categories, retryKey]);

  // Fetch category context for the chat drawer whenever the active category changes
  useEffect(() => {
    if (!activeCategoryId) {
      setDrawerContext(null);
      setDrawerContextLabel(null);
      return;
    }
    getCategoryContext(activeCategoryId)
      .then((ctx) => {
        setDrawerContextLabel(ctx.categoryName);
        setDrawerContext(formatCategoryContext(ctx));
      })
      .catch(() => {});
  }, [activeCategoryId]);

  const topLevelCategories = categories.filter((c) => c.parentId === null);

  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <NavBar
        active="home"
        cartCount={cartCount}
        searchQuery={searchInput}
        onSearchChange={handleSearchChange}
        onNavigate={(key) => {
          if (key === 'chat') {
            const dest = activeCategoryId ? `/chat?categoryId=${activeCategoryId}` : '/chat'
            navigate(dest)
          } else if (key !== 'home') {
            navigate(`/${key}`)
          }
        }}
        onOpenCart={() => navigate('/cart')}
      />

      <main className="mx-auto max-w-6xl px-lg py-xl">
        {searchQuery ? (
          <>
            <header className="mb-lg">
              <h1 className="font-display text-h1 text-text">
                Results for "{searchQuery}"
              </h1>
            </header>

            {searchLoading ? (
              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCard key={i} loading name="" safety="clean" category="" />
                ))}
              </div>
            ) : searchError ? (
              <div className="flex flex-col items-center gap-md p-xl text-center">
                <h3 className="font-display text-h3 text-text">Search failed</h3>
                <p className="max-w-prose text-body text-text-muted">{searchError}</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    safety={product.safety}
                    score={product.cleanScore}
                    brand={product.brand ?? undefined}
                    category={product.categoryName}
                    imageUrl={product.imageUrl ?? undefined}
                    onCardClick={() => navigate(`/product/${product.id}`)}
                    saved={savedIds.has(product.id)}
                    onSave={() => toggleSaved(product.id)}
                    inCart={cartIds.has(product.id)}
                    onAddToCart={() => toggleCart(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-md p-xl text-center">
                <h3 className="font-display text-h3 text-text">No results found</h3>
                <p className="max-w-prose text-body text-text-muted">
                  No products matched "{searchQuery}". Try a different name or brand.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <header className="mb-lg">
              <h1 className="font-display text-h1 text-text">Browse clean products</h1>
              <p className="mt-sm text-body text-text-muted">
                Researched against your standards — every item is scored and explained.
              </p>
            </header>

            {topLevelCategories.length > 0 && (
              <div className="mb-xl flex flex-wrap gap-sm" role="group" aria-label="Filter by category">
                <CategoryTag
                  label="All"
                  interactive
                  selected={activeCategoryId === null}
                  onClick={() => setActiveCategoryId(null)}
                />
                {topLevelCategories.map((category) => (
                  <CategoryTag
                    key={category.id}
                    label={category.name}
                    interactive
                    selected={activeCategoryId === category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                  />
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCard key={i} loading name="" safety="clean" category="" />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-md p-xl text-center">
                <h3 className="font-display text-h3 text-text">Couldn't load products</h3>
                <p className="max-w-prose text-body text-text-muted">{error}</p>
                <button
                  type="button"
                  onClick={() => setRetryKey((k) => k + 1)}
                  className="inline-flex items-center justify-center gap-sm rounded-md bg-accent px-lg py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Try again
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    safety={product.safety}
                    score={product.cleanScore}
                    brand={product.brand ?? undefined}
                    category={product.categoryName}
                    imageUrl={product.imageUrl ?? undefined}
                    onCardClick={() => navigate(`/product/${product.id}`)}
                    saved={savedIds.has(product.id)}
                    onSave={() => toggleSaved(product.id)}
                    inCart={cartIds.has(product.id)}
                    onAddToCart={() => toggleCart(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-md p-xl text-center">
                <h3 className="font-display text-h3 text-text">No products in this category yet</h3>
                <p className="max-w-prose text-body text-text-muted">
                  Try another category, or check back as the catalog grows.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <ChatDrawer context={drawerContext} contextLabel={drawerContextLabel} />
    </div>
  );
}

export default BrowsePage;
