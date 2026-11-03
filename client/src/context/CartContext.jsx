import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

const CartContext = createContext(null)

const EMPTY_CART = { items: [], subtotal: 0, deliveryCharge: 0, total: 0 }

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const toastErr = useCallback(
    (e, fallback) => toast(e.response?.data?.message || fallback, 'error'),
    [toast]
  )
  const [cart, setCart] = useState(EMPTY_CART)
  const [wishlist, setWishlist] = useState([])
  const [fetching, setFetching] = useState(true)

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('layam_token')) {
      setCart(EMPTY_CART)
      setWishlist([])
      setFetching(false)
      return
    }
    setFetching(true)
    try {
      const [c, w] = await Promise.all([api.get('/cart'), api.get('/wishlist')])
      setCart(c.data.cart)
      setWishlist(w.data.products)
    } catch {
      setCart(EMPTY_CART)
      setWishlist([])
    } finally {
      setFetching(false)
    }
  }, [])

  const cartLoading = authLoading || fetching

  useEffect(() => {
    refresh()
  }, [user, refresh])

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart', { productId, quantity })
      setCart(res.data.cart)
      toast('Added to cart')
    } catch (e) {
      toastErr(e, 'Could not add to cart')
    }
  }

  const updateQty = async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/${productId}`, { quantity })
      setCart(res.data.cart)
    } catch (e) {
      toastErr(e, 'Could not update quantity')
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`)
      setCart(res.data.cart)
      toast('Removed from cart', 'info')
    } catch (e) {
      toastErr(e, 'Could not remove item')
    }
  }

  const addToWishlist = async (productId) => {
    try {
      const res = await api.post(`/wishlist/${productId}`)
      setWishlist(res.data.products)
      toast('Saved to wishlist')
    } catch (e) {
      toastErr(e, 'Could not add to wishlist')
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`)
      setWishlist(res.data.products)
      toast('Removed from wishlist', 'info')
    } catch (e) {
      toastErr(e, 'Could not remove item')
    }
  }

  const moveToCart = async (productId) => {
    try {
      const res = await api.post(`/wishlist/${productId}/move-to-cart`)
      setWishlist(res.data.products)
      await refresh()
      toast('Moved to cart')
    } catch (e) {
      toastErr(e, 'Could not move to cart')
    }
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
        cartLoading,
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
