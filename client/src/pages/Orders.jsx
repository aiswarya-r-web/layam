import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    api.get('/orders/my-orders').then((r) => setOrders(r.data.orders)).catch(() => setOrders([]))
  }, [])

  if (!orders) return <LoadingSpinner text="Fetching your orders..." />

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-[700px] px-6 py-20 text-center">
        <p className="text-5xl">📦</p>
        <h1 className="mt-4 text-2xl font-extrabold text-[var(--ink)]">No orders yet</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[var(--brand)] px-8 py-3 font-bold text-white transition hover:bg-[var(--brand-dark)]">
          Start shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[var(--ink)]">My Orders</h1>

      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <Link
            key={o._id}
            to={`/orders/${o._id}`}
            className="block rounded-[20px] border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[var(--faint)]">Order #{o._id.slice(-8).toUpperCase()}</p>
                <p className="mt-0.5 text-sm text-[var(--muted)]">
                  {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}{o.items.length} item{o.items.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[o.orderStatus]}`}>
                  {o.orderStatus}
                </span>
                <span className="font-extrabold text-[var(--ink)]">{inr(o.totalAmount)}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {o.items.slice(0, 4).map((i) => (
                <img key={i.productId} src={i.image} alt={i.productName} className="h-12 w-12 rounded-xl border border-[var(--line)] object-cover" />
              ))}
              {o.items.length > 4 && (
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--page)] text-xs font-bold text-[var(--accent-dark)]">
                  +{o.items.length - 4}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
