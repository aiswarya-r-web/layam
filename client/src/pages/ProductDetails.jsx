import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import api from '../api/axios'
import Rating from '../components/Rating'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import PawBurst from '../components/PawBurst'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function ProductDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState('')
  const [burst, setBurst] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get(`/products/${id}`)
      .then((r) => {
        setProduct(r.data.product)
        setRelated(r.data.related)
        setQty(1)
        return api.get(`/reviews/${r.data.product._id}`)
      })
      .then((r) => setReviews(r.data.reviews))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!product) {
    return (
      <main className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <p className="text-5xl">🐶</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#5d3a1a]">Product not found</h1>
      </main>
    )
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0
  const wished = isWishlisted(product._id)

  const guard = (fn, key) => async () => {
    if (!user) return navigate('/login')
    if (busy) return
    setBusy(key)
    try {
      await fn()
      if (key === 'wish' && !wished) {
        setBurst(true)
        setTimeout(() => setBurst(false), 750)
      }
    } catch {} finally {
      setBusy('')
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setMsg('')
    setBusy('review')
    try {
      await api.post(`/reviews/${product._id}`, review)
      const r = await api.get(`/reviews/${product._id}`)
      setReviews(r.data.reviews)
      setReview({ rating: 5, comment: '' })
      setMsg('Review submitted. Thank you!')
      toast('Review submitted')
    } catch (err) {
      const message = err.response?.data?.message || 'Could not submit review'
      setMsg(message)
      toast(message, 'error')
    } finally {
      setBusy('')
    }
  }

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10 md:px-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[30px] border border-[#e8dcc8] bg-white shadow-sm">
          <img src={product.images?.[0]} alt={product.name} className="h-[420px] w-full object-cover" />
          {product.images?.length > 1 && (
            <div className="flex gap-2 p-3">
              {product.images.map((img) => (
                <img key={img} src={img} alt="" className="h-16 w-16 rounded-xl border border-[#e8dcc8] object-cover" />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-[#8a5a2b]">
            {product.categoryId?.name?.toUpperCase()}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#5d3a1a] md:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewCount} size={18} />
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-[#5d3a1a]">{inr(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-[#a08b74] line-through">{inr(product.originalPrice)}</span>
                <span className="rounded-full bg-[#7a4a21] px-3 py-1 text-xs font-bold text-white">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-[#6b553f]">{product.description}</p>

          <div className="mt-5 space-y-1.5 text-sm text-[#8a6a4a]">
            <p><span className="font-semibold text-[#6b4423]">Brand:</span> {product.brand}</p>
            <p><span className="font-semibold text-[#6b4423]">For:</span> {product.ageGroup} dogs · {product.dogSize} size</p>
            <p>
              <span className="font-semibold text-[#6b4423]">Stock:</span>{' '}
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-[#e5d3b3] bg-white">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3" aria-label="Decrease">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3" aria-label="Increase">
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={guard(() => addToCart(product._id, qty), 'cart')}
              disabled={product.stock < 1 || Boolean(busy)}
              className="inline-flex items-center gap-2 rounded-full bg-[#7a4a21] px-7 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#5f3a19] disabled:opacity-40"
            >
              {busy === 'cart' ? <Spinner /> : <ShoppingCart size={19} />} Add to cart
            </button>

            <button
              onClick={guard(
                () => (wished ? removeFromWishlist(product._id) : addToWishlist(product._id)),
                'wish'
              )}
              disabled={Boolean(busy)}
              className={`relative inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-bold transition disabled:opacity-50 ${
                wished
                  ? 'border-[#7a4a21] bg-[#7a4a21] text-white'
                  : 'border-[#e5d3b3] bg-white text-[#7a4a21] hover:bg-[#f1e6d2]'
              }`}
            >
              {busy === 'wish' ? (
                <Spinner className={wished ? '' : 'h-4 w-4 border-[#7a4a21]/30 border-t-[#7a4a21]'} />
              ) : (
                <Heart size={19} fill={wished ? 'currentColor' : 'none'} />
              )}
              {wished ? 'Wishlisted' : 'Wishlist'}
              {burst && <PawBurst />}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-16">
        <h2 className="text-2xl font-extrabold text-[#5d3a1a]">
          Reviews ({reviews.length})
        </h2>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[380px_1fr]">
          {user ? (
            <form onSubmit={submitReview} className="h-fit rounded-[25px] border border-[#e8dcc8] bg-white p-6">
              <h3 className="font-bold text-[#5d3a1a]">Write a review</h3>
              <select
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                className="mt-3 w-full rounded-xl border border-[#e5d3b3] bg-white px-3 py-2.5 text-sm outline-none"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="How did your dog like it?"
                rows={4}
                className="mt-3 w-full rounded-xl border border-[#e5d3b3] bg-white px-4 py-3 text-sm outline-none"
              />
              {msg && <p className="mt-2 text-sm font-semibold text-[#7a4a21]">{msg}</p>}
              <button
                disabled={Boolean(busy)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#7a4a21] py-3 font-bold text-white transition hover:bg-[#5f3a19] disabled:opacity-60"
              >
                {busy === 'review' && <Spinner />} Submit review
              </button>
            </form>
          ) : (
            <div className="rounded-[25px] border border-[#e8dcc8] bg-white p-6 text-sm text-[#8a6a4a]">
              <Link to="/login" className="font-bold text-[#7a4a21] hover:underline">Log in</Link>
              {' '}to write a review.
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-[25px] border border-dashed border-[#e5d3b3] bg-white/60 p-10 text-center">
                <p className="text-3xl">🐾</p>
                <p className="mt-2 font-bold text-[#5d3a1a]">No reviews yet</p>
                <p className="mt-1 text-sm text-[#8a6a4a]">
                  Be the first to share how your dog liked it.
                </p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="rounded-[20px] border border-[#e8dcc8] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#5d3a1a]">{r.userId?.name || 'Customer'}</p>
                    {r.isVerifiedPurchase && (
                      <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-700">
                        Verified purchase
                      </span>
                    )}
                  </div>
                  <Rating value={r.rating} size={14} />
                  {r.comment && <p className="mt-2 text-sm text-[#6b553f]">{r.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-[#5d3a1a]">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
