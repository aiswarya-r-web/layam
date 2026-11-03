import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Spinner from '../components/Spinner'
import LoadingSpinner from '../components/LoadingSpinner'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function Cart() {
  const { cart, cartLoading, updateQty, removeFromCart } = useCart()
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

  if (cartLoading) return <LoadingSpinner text="Loading your cart..." />

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-[700px] px-6 py-20 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#5d3a1a]">Your cart is empty</h1>
        <p className="mt-2 text-[#8a6a4a]">Your pup is giving you the puppy eyes — go find something tasty.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[#7a4a21] px-8 py-3 font-bold text-white transition hover:bg-[#5f3a19]">
          Shop now
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[#5d3a1a]">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.items.map(({ product, quantity, lineTotal }) => (
            <div
              key={product._id}
              className="flex gap-4 rounded-[20px] border border-[#e8dcc8] bg-white p-4"
            >
              <Link to={`/products/${product._id}`}>
                <img src={product.images?.[0]} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to={`/products/${product._id}`} className="font-bold text-[#5d3a1a] hover:text-[#7a4a21]">
                  {product.name}
                </Link>
                <p className="text-sm text-[#8a6a4a]">{inr(product.price)} each</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className={`flex items-center rounded-full border border-[#e5d3b3] ${busyId === product._id ? 'opacity-50' : ''}`}>
                    <button
                      onClick={() => run(product._id, () => updateQty(product._id, quantity - 1))}
                      disabled={Boolean(busyId)}
                      className="p-2 disabled:opacity-40"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {busyId === product._id ? (
                        <Spinner className="h-3 w-3 border-[#7a4a21]/30 border-t-[#7a4a21]" />
                      ) : (
                        quantity
                      )}
                    </span>
                    <button
                      onClick={() => run(product._id, () => updateQty(product._id, quantity + 1))}
                      disabled={Boolean(busyId)}
                      className="p-2 disabled:opacity-40"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-extrabold text-[#5d3a1a]">{inr(lineTotal)}</span>
                </div>
              </div>
              <button
                onClick={() => run(product._id, () => removeFromCart(product._id))}
                disabled={Boolean(busyId)}
                className="self-start rounded-full p-2 text-[#a08b74] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                aria-label="Remove"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-[25px] border border-[#e8dcc8] bg-white p-6 shadow-sm">
          <h2 className="font-extrabold text-[#5d3a1a]">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#6b553f]">
              <span>Subtotal</span>
              <span>{inr(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6b553f]">
              <span>Delivery</span>
              <span>{cart.deliveryCharge === 0 ? 'Free' : inr(cart.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between border-t border-[#e8dcc8] pt-3 text-lg font-extrabold text-[#5d3a1a]">
              <span>Total</span>
              <span>{inr(cart.total)}</span>
            </div>
          </div>
          {cart.deliveryCharge > 0 && (
            <p className="mt-3 rounded-xl bg-[#faf3e7] px-3 py-2 text-xs font-semibold text-[#8a5a2b]">
              Add {inr(999 - cart.subtotal)} more for free delivery
            </p>
          )}
          <Link
            to="/checkout"
            className="mt-5 block rounded-full bg-[#7a4a21] py-3.5 text-center font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#5f3a19]"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </main>
  )
}
