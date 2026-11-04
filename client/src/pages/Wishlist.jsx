import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Rating from '../components/Rating'
import Spinner from '../components/Spinner'
import LoadingSpinner from '../components/LoadingSpinner'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function Wishlist() {
  const { wishlist, cartLoading, removeFromWishlist, moveToCart } = useCart()
  const [busyId, setBusyId] = useState(null)

  const run = async (id, fn) => {
    if (busyId) return
    setBusyId(id)
    try {
      await fn()
    } catch {} finally {
      setBusyId(null)
    }
  }

  if (cartLoading) return <LoadingSpinner text="Loading your wishlist..." />

  if (wishlist.length === 0) {
    return (
      <main className="mx-auto max-w-[700px] px-6 py-20 text-center">
        <p className="text-5xl">❤️</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[var(--ink)]">Your wishlist is empty</h1>
        <p className="mt-2 text-[var(--muted)]">Save products you love for later.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[var(--brand)] px-8 py-3 font-bold text-white transition hover:bg-[var(--brand-dark)]">
          Browse products
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[var(--ink)]">My Wishlist</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map(({ product }) => (
          <div key={product._id} className="flex gap-4 rounded-[20px] border border-[var(--line)] bg-white p-4">
            <Link to={`/products/${product._id}`}>
              <img src={product.images?.[0]} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <Link to={`/products/${product._id}`} className="font-bold text-[var(--ink)] hover:text-[var(--brand)]">
                {product.name}
              </Link>
              <Rating value={product.rating} count={product.reviewCount} />
              <span className="mt-1 font-extrabold text-[var(--ink)]">{inr(product.price)}</span>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => run(product._id, () => moveToCart(product._id))}
                  disabled={product.stock < 1 || Boolean(busyId)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--brand-dark)] disabled:opacity-40"
                >
                  {busyId === product._id ? <Spinner className="h-3 w-3 border-white/40 border-t-white" /> : <ShoppingCart size={14} />} Move to cart
                </button>
                <button
                  onClick={() => run(product._id, () => removeFromWishlist(product._id))}
                  disabled={Boolean(busyId)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--line-2)] px-4 py-2 text-xs font-bold text-[var(--faint)] transition hover:text-red-600 disabled:opacity-40"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
