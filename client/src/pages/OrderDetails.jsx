import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../context/ToastContext'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
}

const STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

const WAVE_PATH = 'M0 20 Q30 4 60 20 T120 20 T180 20 T240 20 T300 20'

const waveTopPct = (f) => {
  const x = f * 300
  const bump = Math.floor(x / 60)
  const t = (x % 60) / 60
  const sign = bump % 2 === 0 ? -1 : 1
  return ((20 + sign * 32 * t * (1 - t)) / 40) * 100
}

export default function OrderDetails() {
  const { id } = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [msg, setMsg] = useState('')
  const [wave, setWave] = useState(0)

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.order)).catch(() => setOrder(null))
  }, [id])

  useEffect(() => {
    const idx = STEPS.indexOf(order?.orderStatus)
    if (idx < 0) return
    setWave(0)
    const target = idx / (STEPS.length - 1)
    const dur = 1300
    let raf
    const delay = setTimeout(() => {
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur)
        setWave((1 - Math.pow(1 - p, 3)) * target)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, 400)
    return () => {
      clearTimeout(delay)
      cancelAnimationFrame(raf)
    }
  }, [order?._id, order?.orderStatus])

  if (!order) return <LoadingSpinner text="Loading order..." />

  const cancel = async () => {
    try {
      const r = await api.patch(`/orders/${id}/cancel`)
      setOrder(r.data.order)
      setMsg('Order cancelled successfully')
      toast('Order cancelled', 'info')
    } catch (err) {
      const message = err.response?.data?.message || 'Could not cancel order'
      setMsg(message)
      toast(message, 'error')
    }
  }

  const a = order.shippingAddress

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-10 md:px-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--ink)]">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize ${STATUS_COLORS[order.orderStatus]}`}>
            {order.orderStatus}
          </span>
          {['pending', 'confirmed'].includes(order.orderStatus) && (
            <button
              onClick={cancel}
              className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Cancel order
            </button>
          )}
        </div>
      </div>
      {order.orderStatus !== 'cancelled' && (
        <div className="mt-8 rounded-[25px] border border-[var(--line)] bg-white px-6 pb-5 pt-16">
          <div className="relative h-20">
            <svg viewBox="0 0 300 40" preserveAspectRatio="none" className="h-full w-full">
              <path
                d={WAVE_PATH}
                fill="none"
                stroke="var(--line)"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={WAVE_PATH}
                fill="none"
                stroke="var(--brand)"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength="1"
                style={{ strokeDasharray: 1, strokeDashoffset: 1 - wave }}
              />
            </svg>
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300 ${
                  wave >= i / (STEPS.length - 1) - 0.02
                    ? 'border-[var(--brand)] bg-[var(--brand)]'
                    : 'border-[var(--line-2)] bg-white'
                }`}
                style={{
                  left: `${(i / (STEPS.length - 1)) * 100}%`,
                  top: `${waveTopPct(i / (STEPS.length - 1))}%`,
                }}
              />
            ))}
            <img
              src="/Dogne.gif"
              alt=""
              className="absolute h-14 -translate-x-1/2 -translate-y-full"
              style={{ left: `${wave * 100}%`, top: `${waveTopPct(wave)}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wide">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`transition-colors duration-300 ${
                  wave >= i / (STEPS.length - 1) - 0.02 ? 'text-[var(--ink)]' : 'text-[var(--faint)]'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {msg && <p className="mt-3 rounded-xl bg-[var(--page)] px-4 py-2 text-sm font-semibold text-[var(--brand)]">{msg}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {order.items.map((i) => (
            <div key={i.productId} className="flex items-center gap-4 rounded-[20px] border border-[var(--line)] bg-white p-4">
              <img src={i.image} alt={i.productName} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="font-bold text-[var(--ink)]">{i.productName}</p>
                <p className="text-sm text-[var(--muted)]">{inr(i.price)} × {i.quantity}</p>
              </div>
              <span className="font-extrabold text-[var(--ink)]">{inr(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-[25px] border border-[var(--line)] bg-white p-6">
            <h2 className="font-extrabold text-[var(--ink)]">Delivery to</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-dark)]">
              <span className="font-bold">{a.name}</span><br />
              {a.street}<br />
              {a.city}, {a.state} {a.postalCode}<br />
              {a.country}<br />
              📞 {a.phone}
            </p>
          </div>

          <div className="rounded-[25px] border border-[var(--line)] bg-white p-6">
            <h2 className="font-extrabold text-[var(--ink)]">Payment</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[var(--muted-dark)]"><span>Method</span><span className="uppercase">{order.paymentMethod}</span></div>
              <div className="flex justify-between text-[var(--muted-dark)]"><span>Status</span><span className="capitalize">{order.paymentStatus}</span></div>
              <div className="flex justify-between text-[var(--muted-dark)]"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between font-semibold text-green-700">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                  <span>-{inr(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--muted-dark)]"><span>Delivery</span><span>{order.deliveryCharge === 0 ? 'Free' : inr(order.deliveryCharge)}</span></div>
              <div className="flex justify-between border-t border-[var(--line)] pt-3 font-extrabold text-[var(--ink)]">
                <span>Total</span><span>{inr(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {order.orderStatus === 'delivered' ? (
            <Link
              to={`/orders/${order._id}/spin`}
              className="block rounded-[25px] border border-[var(--line)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-3xl">🎡</p>
              <p className="mt-1 font-extrabold text-[var(--ink)]">Spin &amp; Win</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">Your pawsome surprise awaits — try your luck!</p>
            </Link>
          ) : order.orderStatus !== 'cancelled' ? (
            <p className="rounded-[25px] border border-dashed border-[var(--line-2)] p-4 text-center text-xs font-semibold text-[var(--muted)]">
              🔒 Your spin unlocks once the order is delivered
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}
