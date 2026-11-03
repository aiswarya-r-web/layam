import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const EMPTY_CART = { items: [], subtotal: 0, deliveryCharge: 0, total: 0 }

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(EMPTY_CART)
  const [wishlist, setWishlist] = useState([])

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('layam_token')) {
      setCart(EMPTY_CART)
      setWishlist([])
      return
    }
    try {
      const [c, w] = await Promise.all([api.get('/cart'), api.get('/wishlist')])
      setCart(c.data.cart)
      setWishlist(w.data.products)
    } catch {
      setCart(EMPTY_CART)
      setWishlist([])
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [user, refresh])

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart', { productId, quantity })
    setCart(res.data.cart)
  }

  const updateQty = async (productId, quantity) => {
    const res = await api.put(`/cart/${productId}`, { quantity })
    setCart(res.data.cart)
  }

  const removeFromCart = async (productId) => {
    const res = await api.delete(`/cart/${productId}`)
    setCart(res.data.cart)
  }

  const addToWishlist = async (productId) => {
    const res = await api.post(`/wishlist/${productId}`)
    setWishlist(res.data.products)
  }

  const removeFromWishlist = async (productId) => {
    const res = await api.delete(`/wishlist/${productId}`)
    setWishlist(res.data.products)
  }

  const moveToCart = async (productId) => {
    const res = await api.post(`/wishlist/${productId}/move-to-cart`)
    setWishlist(res.data.products)
    await refresh()
  }

  const isWishlisted = (productId) =>
    wishlist.some((w) => w.product._id === productId)

  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        refresh,
        addToCart,
        updateQty,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
