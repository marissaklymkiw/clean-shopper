import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getItemIds, addItem, removeItem, moveToCart } from './catalog'

interface CartContextValue {
  savedIds: Set<string>
  cartIds: Set<string>
  cartCount: number
  toggleSaved: (productId: string) => Promise<void>
  toggleCart: (productId: string) => Promise<void>
  moveSavedToCart: (productId: string) => Promise<void>
  reload: () => Promise<void>
}

const CartContext = createContext<CartContextValue>({
  savedIds: new Set(),
  cartIds: new Set(),
  cartCount: 0,
  toggleSaved: async () => {},
  toggleCart: async () => {},
  moveSavedToCart: async () => {},
  reload: async () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [cartIds, setCartIds] = useState<Set<string>>(new Set())

  const reload = useCallback(async () => {
    const [saved, cart] = await Promise.all([
      getItemIds('saved'),
      getItemIds('cart'),
    ])
    setSavedIds(new Set(saved))
    setCartIds(new Set(cart))
  }, [])

  useEffect(() => { reload() }, [reload])

  const toggleSaved = useCallback(async (productId: string) => {
    if (savedIds.has(productId)) {
      setSavedIds((prev) => { const next = new Set(prev); next.delete(productId); return next })
      await removeItem(productId, 'saved')
    } else {
      setSavedIds((prev) => new Set(prev).add(productId))
      await addItem(productId, 'saved')
    }
  }, [savedIds])

  const toggleCart = useCallback(async (productId: string) => {
    if (cartIds.has(productId)) {
      setCartIds((prev) => { const next = new Set(prev); next.delete(productId); return next })
      await removeItem(productId, 'cart')
    } else {
      setCartIds((prev) => new Set(prev).add(productId))
      await addItem(productId, 'cart')
    }
  }, [cartIds])

  const moveSavedToCart = useCallback(async (productId: string) => {
    setSavedIds((prev) => { const next = new Set(prev); next.delete(productId); return next })
    setCartIds((prev) => new Set(prev).add(productId))
    await moveToCart(productId)
  }, [])

  return (
    <CartContext.Provider value={{
      savedIds,
      cartIds,
      cartCount: cartIds.size,
      toggleSaved,
      toggleCart,
      moveSavedToCart,
      reload,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
