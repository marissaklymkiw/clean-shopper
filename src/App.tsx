import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/CartContext'
import BrowsePage from './pages/BrowsePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
