import { useState } from 'react'
import { Heart, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Rating from './Rating'
import Spinner from './Spinner'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useCart()
  const navigate = useNavigate()
  const [busy, setBusy] = useState('')

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
    } catch {} finally {
      setBusy('')
    }
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-[25px] border border-[#e8dcc8]
      bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-[#faf3e7]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#7a4a21] px-3 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={guard(wished ? removeFromWishlist : addToWishlist, 'wish')}
          disabled={Boolean(busy)}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center
          rounded-full bg-white/90 text-[#7a4a21] shadow transition hover:scale-110
          disabled:opacity-50"
        >
          {busy === 'wish' ? (
            <Spinner className="h-4 w-4 border-[#7a4a21]/30 border-t-[#7a4a21]" />
          ) : (
            <Heart size={17} fill={wished ? 'currentColor' : 'none'} />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold tracking-widest text-[#8a5a2b]">
          {product.categoryId?.name?.toUpperCase() || product.brand?.toUpperCase()}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-[#382619]">
          {product.name}
        </h3>
        <Rating value={product.rating} count={product.reviewCount} />

        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="font-extrabold text-[#5d3a1a]">{inr(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-[#a08b74] line-through">
                {inr(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={guard(addToCart, 'cart')}
            aria-label="Add to cart"
            disabled={product.stock < 1 || Boolean(busy)}
            className="flex h-9 w-9 items-center justify-center rounded-full
            bg-[#7a4a21] text-white transition hover:scale-110 hover:bg-[#5f3a19]
            disabled:opacity-40"
          >
            {busy === 'cart' ? <Spinner /> : <Plus size={18} />}
          </button>
        </div>
        {product.stock < 1 && (
          <p className="mt-1 text-xs font-semibold text-red-600">Out of stock</p>
        )}
      </div>
    </Link>
  )
}
