import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgePercent } from 'lucide-react'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCart } from '../context/CartContext'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const emptyAddr = { name: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India' }
const CONFETTI_COLORS = ['#7a4a21', '#dda044', '#f4b860', '#e2574c', '#5aa469', '#8a5a2b']

export default function Checkout() {
  const { user } = useAuth()
  const { cart, cartLoading, refresh } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0]
  const [address, setAddress] = useState({
    name: defaultAddr?.name || user?.name || '',
    phone: defaultAddr?.phone || user?.phone || '',
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    postalCode: defaultAddr?.postalCode || '',
    country: defaultAddr?.country || 'India',
  })
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [availableCoupons, setAvailableCoupons] = useState([])
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [couponBusy, setCouponBusy] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const confetti = Array.from({ length: 36 }, (_, i) => ({
    left: `${(i * 83) % 100}%`,
    delay: `${(i % 10) * 0.14}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    width: 6 + (i % 3) * 3,
    height: 10 + (i % 4) * 3,
  }))

  const set = (k) => (e) => setAddress({ ...address, [k]: e.target.value })

  useEffect(() => {
    api.get('/coupons/available').then((r) => setAvailableCoupons(r.data.coupons)).catch(() => {})
  }, [])

  const applyCoupon = async (code = couponInput) => {
    setMsg('')
    setCouponBusy(true)
    try {
      const res = await api.post('/coupons/validate', {
        code,
        orderAmount: cart.subtotal,
      })
      setCoupon(res.data)
      setCouponInput(res.data.code)
      toast(`${res.data.code} applied`)
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid coupon'
      setCoupon(null)
      setMsg(message)
      toast(message, 'error')
    } finally {
      setCouponBusy(false)
    }
  }

  const discount = coupon?.discount || 0
  const total = cart.subtotal - discount + cart.deliveryCharge

  const placeOrder = async (e) => {
    e.preventDefault()
    setMsg('')
    setBusy(true)
    try {
      const res = await api.post('/orders', {
        shippingAddress: address,
        couponCode: coupon?.code,
        paymentMethod: 'cod',
      })
      await refresh()
      toast('Order placed successfully')
      setCelebrating(true)
      setTimeout(() => navigate(`/orders/${res.data.order._id}`, { replace: true }), 2000)
    } catch (err) {
      const message = err.response?.data?.message || 'Could not place order'
      setMsg(message)
      toast(message, 'error')
      setBusy(false)
    }
  }

  if (cartLoading) return <LoadingSpinner text="Preparing checkout..." />

  if (cart.items.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  const addrFields = [
    ['name', 'Full name'], ['phone', 'Phone'], ['street', 'Street address'],
    ['city', 'City'], ['state', 'State'], ['postalCode', 'Postal code'],
  ]

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[#5d3a1a]">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[25px] border border-[#e8dcc8] bg-white p-6">
          <h2 className="font-extrabold text-[#5d3a1a]">Shipping address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {addrFields.map(([k, label]) => (
              <div key={k} className={k === 'street' ? 'sm:col-span-2' : ''}>
                <label className="text-sm font-semibold text-[#6b4423]">{label}</label>
                <input
                  required
                  value={address[k]}
                  onChange={set(k)}
                  className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-2.5 outline-none focus:border-[#8a5a2b]"
                />
              </div>
            ))}
          </div>

          <h2 className="mt-8 font-extrabold text-[#5d3a1a]">Payment</h2>
          <label className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-[#7a4a21] bg-[#faf3e7] p-4">
            <input type="radio" checked readOnly className="accent-[#7a4a21]" />
            <div>
              <p className="font-bold text-[#5d3a1a]">Cash on Delivery</p>
              <p className="text-xs text-[#8a6a4a]">Pay when your order arrives</p>
            </div>
          </label>
        </div>

        <div className="h-fit rounded-[25px] border border-[#e8dcc8] bg-white p-6 shadow-sm">
          <h2 className="font-extrabold text-[#5d3a1a]">Order summary</h2>

          <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
            {cart.items.map(({ product, quantity }) => (
              <div key={product._id} className="flex justify-between text-sm text-[#6b553f]">
                <span className="line-clamp-1">{product.name} × {quantity}</span>
                <span>{inr(product.price * quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="w-full rounded-full border border-[#e5d3b3] bg-white px-4 py-2 text-sm uppercase outline-none"
            />
            <button
              type="button"
              onClick={() => applyCoupon()}
              disabled={couponBusy || !couponInput}
              className="inline-flex items-center gap-1 rounded-full border border-[#7a4a21] px-4 text-sm font-bold text-[#7a4a21] transition hover:bg-[#f1e6d2] disabled:opacity-50"
            >
              {couponBusy ? <Spinner className="h-3.5 w-3.5 border-[#7a4a21]/30 border-t-[#7a4a21]" /> : <BadgePercent size={15} />} Apply
            </button>
          </div>
          {coupon && (
            <p className="mt-2 text-xs font-bold text-green-700">
              {coupon.code} applied — you save {inr(coupon.discount)}
              <button
                type="button"
                onClick={() => { setCoupon(null); setCouponInput('') }}
                className="ml-2 text-red-500 hover:underline"
              >
                Remove
              </button>
            </p>
          )}
          {availableCoupons.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[#8a6a4a]">Available coupons</p>
              {availableCoupons.map((c) => {
                const eligible = cart.subtotal >= (c.minimumOrderAmount || 0)
                const applied = coupon?.code === c.code
                return (
                  <div
                    key={c.code}
                    className="flex items-center justify-between rounded-xl border border-dashed border-[#d9c5a0] bg-[#faf7f0] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-[#5d3a1a]">{c.code}</p>
                      <p className="truncate text-xs text-[#8a6a4a]">
                        {c.discountType === 'percentage' ? `${c.discountValue}% off` : `${inr(c.discountValue)} off`}
                        {c.maximumDiscount ? ` up to ${inr(c.maximumDiscount)}` : ''}
                        {c.minimumOrderAmount ? ` · min order ${inr(c.minimumOrderAmount)}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyCoupon(c.code)}
                      disabled={!eligible || applied || couponBusy}
                      className="ml-2 shrink-0 rounded-full border border-[#7a4a21] px-3 py-1 text-xs font-bold text-[#7a4a21] transition hover:bg-[#f1e6d2] disabled:opacity-40"
                    >
                      {applied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-4 space-y-2 border-t border-[#e8dcc8] pt-4 text-sm">
            <div className="flex justify-between text-[#6b553f]">
              <span>Subtotal</span><span>{inr(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6b553f]">
              <span>Delivery</span><span>{cart.deliveryCharge === 0 ? 'Free' : inr(cart.deliveryCharge)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-semibold text-green-700">
                <span>Discount</span><span>-{inr(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#e8dcc8] pt-3 text-lg font-extrabold text-[#5d3a1a]">
              <span>Total</span><span>{inr(total)}</span>
            </div>
          </div>

          {msg && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{msg}</p>}

          <button
            disabled={busy}
            className="mt-5 w-full rounded-full bg-[#7a4a21] py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#5f3a19] disabled:opacity-60"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <img src="/dognew.gif" alt="" className="h-7" />
              {busy ? 'Placing order...' : `Place order · ${inr(total)}`}
            </span>
          </button>
        </div>
      </form>

      {celebrating && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confetti.map((c, i) => (
            <span
              key={i}
              className="confetti-rise-piece"
              style={{
                left: c.left,
                width: c.width,
                height: c.height,
                backgroundColor: c.color,
                animationDelay: c.delay,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="flex items-center gap-3 rounded-full bg-white/95 px-8 py-4 text-xl font-extrabold text-[#5d3a1a] shadow-xl">
              <img src="/dognew.gif" alt="" className="h-10" />
              Order placed — thank you!
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
