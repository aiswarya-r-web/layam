import { useState } from 'react'
import { Heart, Minus, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Rating from './Rating'
import Spinner from './Spinner'
import PawBurst from './PawBurst'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { cart, addToCart, updateQty, addToWishlist, removeFromWishlist, isWishlisted } = useCart()
  const navigate = useNavigate()
  const [busy, setBusy] = useState('')
  const [burst, setBurst] = useState(false)

  const cartItem = cart.items.find((i) => i.product._id === product._id)

  const stepQty = (delta) => async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (busy) return
    setBusy('cart')
    try {
      await updateQty(product._id, (cartItem?.quantity || 0) + delta)
    } finally {
      setBusy('')
    }
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0
  const wished = isWishlisted(product._id)

  const guard = (fn, key) => async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (busy) return
    setBusy(key)
    try {
      await fn(product._id)
      if (key === 'wish' && !wished) {
        setBurst(true)
        setTimeout(() => setBurst(false), 750)
      }
    } catch {} finally {
      setBusy('')
    }
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-[25px] border border-[var(--line)]
      bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--page)]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={guard(wished ? removeFromWishlist : addToWishlist, 'wish')}
          disabled={Boolean(busy)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center
          rounded-full bg-white/90 text-[var(--brand)] shadow transition hover:scale-110
          disabled:opacity-50"
        >
          {busy === 'wish' ? (
            <Spinner className="h-4 w-4 border-[var(--brand)]/30 border-t-[var(--brand)]" />
          ) : (
            <Heart size={17} fill={wished ? 'currentColor' : 'none'} />
          )}
          {burst && <PawBurst />}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold tracking-widest text-[var(--accent-dark)]">
          {product.categoryId?.name?.toUpperCase() || product.brand?.toUpperCase()}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-[var(--text)]">
          {product.name}
        </h3>
        <Rating value={product.rating} count={product.reviewCount} />

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="font-extrabold text-[var(--ink)]">{inr(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-[var(--faint)] line-through">
                {inr(product.originalPrice)}
              </span>
            )}
          </div>
          {cartItem ? (
            <div
              onClick={(e) => e.preventDefault()}
              className="flex h-9 shrink-0 items-center rounded-full bg-[var(--brand)] text-white"
            >
              <button
                onClick={stepQty(-1)}
                disabled={Boolean(busy)}
                aria-label="Decrease quantity"
                className="flex h-full items-center px-2.5 disabled:opacity-40"
              >
                <Minus size={15} />
              </button>
              <span className="min-w-5 text-center text-sm font-bold">
                {busy === 'cart' ? (
                  <Spinner className="h-3 w-3 border-white/40 border-t-white" />
                ) : (
                  cartItem.quantity
                )}
              </span>
              <button
                onClick={stepQty(1)}
                disabled={Boolean(busy)}
                aria-label="Increase quantity"
                className="flex h-full items-center px-2.5 disabled:opacity-40"
              >
                <Plus size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={guard(addToCart, 'cart')}
              aria-label="Add to cart"
              disabled={product.stock < 1 || Boolean(busy)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
              bg-[var(--brand)] text-white transition hover:scale-110 hover:bg-[var(--brand-dark)]
              disabled:opacity-40"
            >
              {busy === 'cart' ? <Spinner /> : <Plus size={18} />}
            </button>
          )}
        </div>
        {product.stock < 1 && (
          <p className="mt-1 text-xs font-semibold text-red-600">Out of stock</p>
        )}
      </div>
    </Link>
  )
}
