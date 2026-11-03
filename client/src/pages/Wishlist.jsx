import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Rating from '../components/Rating'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function Wishlist() {
  const { wishlist, removeFromWishlist, moveToCart } = useCart()

  if (wishlist.length === 0) {
    return (
      <main className="mx-auto max-w-[700px] px-6 py-20 text-center">
        <p className="text-5xl">❤️</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#5d3a1a]">Your wishlist is empty</h1>
        <p className="mt-2 text-[#8a6a4a]">Save products you love for later.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[#7a4a21] px-8 py-3 font-bold text-white transition hover:bg-[#5f3a19]">
          Browse products
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[#5d3a1a]">My Wishlist</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map(({ product }) => (
          <div key={product._id} className="flex gap-4 rounded-[20px] border border-[#e8dcc8] bg-white p-4">
            <Link to={`/products/${product.slug}`}>
              <img src={product.images?.[0]} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <Link to={`/products/${product.slug}`} className="font-bold text-[#5d3a1a] hover:text-[#7a4a21]">
                {product.name}
              </Link>
              <Rating value={product.rating} count={product.reviewCount} />
              <span className="mt-1 font-extrabold text-[#5d3a1a]">{inr(product.price)}</span>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => moveToCart(product._id).catch(() => {})}
                  disabled={product.stock < 1}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#7a4a21] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#5f3a19] disabled:opacity-40"
                >
                  <ShoppingCart size={14} /> Move to cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id).catch(() => {})}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#e5d3b3] px-4 py-2 text-xs font-bold text-[#a08b74] transition hover:text-red-600"
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
