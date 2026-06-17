import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import ProductCard from '../components/ProductCard'
import { getItemProducts, type ProductSummary } from '../lib/catalog'
import { useCart } from '../lib/CartContext'

export function CartPage() {
  const navigate = useNavigate()
  const { cartCount, cartIds, savedIds, toggleCart, toggleSaved, moveSavedToCart, reload } = useCart()
  const [cartProducts, setCartProducts] = useState<ProductSummary[]>([])
  const [savedProducts, setSavedProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    reload()
      .then(() => Promise.all([getItemProducts('cart'), getItemProducts('saved')]))
      .then(([cart, saved]) => {
        setCartProducts(cart)
        setSavedProducts(saved)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load your cart. Check your connection and try again.')
        setLoading(false)
      })
  }, [reload])

  const handleRemoveFromCart = async (product: ProductSummary) => {
    await toggleCart(product.id)
    setCartProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  const handleUnsave = async (product: ProductSummary) => {
    await toggleSaved(product.id)
    setSavedProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  const handleMoveToCart = async (product: ProductSummary) => {
    await moveSavedToCart(product.id)
    setSavedProducts((prev) => prev.filter((p) => p.id !== product.id))
    setCartProducts((prev) => (prev.find((p) => p.id === product.id) ? prev : [...prev, product]))
  }

  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <NavBar
        active="home"
        cartCount={cartCount}
        onOpenCart={() => navigate('/cart')}
        onNavigate={() => navigate('/')}
      />

      <main className="mx-auto max-w-6xl px-lg py-xl">

        {/* ── Cart ── */}
        <header className="mb-lg">
          <h1 className="font-display text-h1 text-text">Cart</h1>
          <p className="mt-xs text-body text-text-muted">
            {cartIds.size === 0 ? 'Your cart is empty.' : `${cartIds.size} item${cartIds.size === 1 ? '' : 's'}`}
          </p>
        </header>

        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="flex flex-col items-center gap-md rounded-lg border border-border bg-surface p-xl text-center">
            <p className="text-body text-text-muted">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center rounded-md bg-accent px-lg py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover"
            >
              Back to browse
            </button>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-md rounded-lg border border-border bg-surface p-xl text-center">
            <p className="text-body text-text-muted">Your cart is empty.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center rounded-md bg-accent px-lg py-sm text-body font-medium text-surface transition-colors hover:bg-accent-hover"
            >
              Browse products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
            {cartProducts.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                safety={p.safety}
                score={p.cleanScore}
                brand={p.brand ?? undefined}
                category={p.categoryName}
                imageUrl={p.imageUrl ?? undefined}
                onCardClick={() => navigate(`/product/${p.id}`)}
                inCart
                onAddToCart={() => handleRemoveFromCart(p)}
              />
            ))}
          </div>
        )}

        {/* ── Saved for later ── */}
        {(loading || savedProducts.length > 0) && (
          <section className="mt-2xl">
            <div className="mb-lg border-t border-border pt-xl">
              <h2 className="font-display text-h2 text-text">Saved for later</h2>
              <p className="mt-xs text-body text-text-muted">
                {savedIds.size} item{savedIds.size === 1 ? '' : 's'} saved
              </p>
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : (
              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
                {savedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    name={p.name}
                    safety={p.safety}
                    score={p.cleanScore}
                    brand={p.brand ?? undefined}
                    category={p.categoryName}
                    imageUrl={p.imageUrl ?? undefined}
                    onCardClick={() => navigate(`/product/${p.id}`)}
                    saved
                    onSave={() => handleUnsave(p)}
                    inCart={cartIds.has(p.id)}
                    onAddToCart={() => handleMoveToCart(p)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <ProductCard key={i} loading name="" safety="clean" category="" />
      ))}
    </div>
  )
}

export default CartPage
