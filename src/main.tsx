import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { ensureSession } from './lib/supabase'
import { getProducts } from './lib/catalog'

ensureSession()
  .then((session) => {
    console.log('[clean-shopper] anonymous session:', session?.user.id)
    return getProducts()
  })
  .then((products) => {
    console.log('[clean-shopper] catalog sample:', products.slice(0, 3))
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
