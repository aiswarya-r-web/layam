import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.order)).catch(() => setOrder(null))
  }, [id])

  if (!order) return <LoadingSpinner text="Loading order..." />

  const cancel = async () => {
    try {
      const r = await api.patch(`/orders/${id}/cancel`)
      setOrder(r.data.order)
      setMsg('Order cancelled successfully')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not cancel order')
    }
  }

  const a = order.shippingAddress

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-10 md:px-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5d3a1a]">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="mt-1 text-sm text-[#8a6a4a]">
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
      {msg && <p className="mt-3 rounded-xl bg-[#faf3e7] px-4 py-2 text-sm font-semibold text-[#7a4a21]">{msg}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {order.items.map((i) => (
            <div key={i.productId} className="flex items-center gap-4 rounded-[20px] border border-[#e8dcc8] bg-white p-4">
              <img src={i.image} alt={i.productName} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="font-bold text-[#5d3a1a]">{i.productName}</p>
                <p className="text-sm text-[#8a6a4a]">{inr(i.price)} × {i.quantity}</p>
              </div>
              <span className="font-extrabold text-[#5d3a1a]">{inr(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-[25px] border border-[#e8dcc8] bg-white p-6">
            <h2 className="font-extrabold text-[#5d3a1a]">Delivery to</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6b553f]">
              <span className="font-bold">{a.name}</span><br />
              {a.street}<br />
              {a.city}, {a.state} {a.postalCode}<br />
              {a.country}<br />
              📞 {a.phone}
            </p>
          </div>

          <div className="rounded-[25px] border border-[#e8dcc8] bg-white p-6">
            <h2 className="font-extrabold text-[#5d3a1a]">Payment</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#6b553f]"><span>Method</span><span className="uppercase">{order.paymentMethod}</span></div>
              <div className="flex justify-between text-[#6b553f]"><span>Status</span><span className="capitalize">{order.paymentStatus}</span></div>
              <div className="flex justify-between text-[#6b553f]"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between font-semibold text-green-700">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                  <span>-{inr(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6b553f]"><span>Delivery</span><span>{order.deliveryCharge === 0 ? 'Free' : inr(order.deliveryCharge)}</span></div>
              <div className="flex justify-between border-t border-[#e8dcc8] pt-3 font-extrabold text-[#5d3a1a]">
                <span>Total</span><span>{inr(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
