import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [coupons, setCoupons] = useState([])
  const [couponForm, setCouponForm] = useState({
    code: '', discountType: 'percentage', discountValue: '',
    minimumOrderAmount: 0, maximumDiscount: '', expiryDate: '', usageLimit: '',
  })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data)).catch(() => setStats({}))
    api.get('/admin/orders').then((r) => setOrders(r.data.orders)).catch(() => {})
    api.get('/admin/products').then((r) => setProducts(r.data.products)).catch(() => {})
    api.get('/admin/users').then((r) => setUsers(r.data.users)).catch(() => {})
    api.get('/coupons').then((r) => setCoupons(r.data.coupons)).catch(() => {})
  }, [])

  const saveCoupon = async (e) => {
    e.preventDefault()
    try {
      const r = await api.post('/coupons', {
        ...couponForm,
        discountValue: Number(couponForm.discountValue),
        minimumOrderAmount: Number(couponForm.minimumOrderAmount) || 0,
        maximumDiscount: couponForm.maximumDiscount ? Number(couponForm.maximumDiscount) : undefined,
        usageLimit: couponForm.usageLimit ? Number(couponForm.usageLimit) : undefined,
      })
      setCoupons((cs) => [r.data.coupon, ...cs])
      setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minimumOrderAmount: 0, maximumDiscount: '', expiryDate: '', usageLimit: '' })
      setMsg('')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not create coupon')
    }
  }

  const toggleCoupon = async (c) => {
    try {
      const r = await api.put(`/coupons/${c._id}`, { isActive: !c.isActive })
      setCoupons((cs) => cs.map((x) => (x._id === c._id ? r.data.coupon : x)))
    } catch {}
  }

  const deleteCoupon = async (id) => {
    try {
      await api.delete(`/coupons/${id}`)
      setCoupons((cs) => cs.filter((c) => c._id !== id))
    } catch {}
  }

  const setStatus = async (id, orderStatus) => {
    try {
      const r = await api.patch(`/admin/orders/${id}/status`, { orderStatus })
      setOrders((os) => os.map((o) => (o._id === id ? r.data.order : o)))
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed')
    }
  }

  const toggleProduct = async (p) => {
    try {
      const r = await api.put(`/products/${p._id}`, { isActive: !p.isActive })
      setProducts((ps) => ps.map((x) => (x._id === p._id ? r.data.product : x)))
    } catch {}
  }

  if (!stats) return <LoadingSpinner />

  const cards = [
    ['Revenue', inr(stats.totalRevenue)],
    ['Orders', stats.totalOrders],
    ['Customers', stats.totalCustomers],
    ['Products', stats.totalProducts],
  ]

  const tabs = [
    ['overview', 'Overview'],
    ['orders', `Orders (${orders.length})`],
    ['products', `Products (${products.length})`],
    ['customers', `Customers (${users.length})`],
    ['coupons', `Coupons (${coupons.length})`],
  ]

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10 md:px-14">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-[var(--ink)]">Admin Dashboard</h1>
        <Link
          to="/admin/birthdays"
          className="rounded-full border-b-4 border-[var(--gold-dark)] bg-gradient-to-b from-[var(--gold-lite)] to-[var(--gold)] px-5 py-2.5 text-sm font-bold text-[var(--ink)] shadow transition hover:-translate-y-0.5"
        >
          🎂 Paw Birthday Club
        </Link>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === k ? 'bg-[var(--brand)] text-white' : 'border border-[var(--line-2)] bg-white hover:bg-[var(--cream)]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      {msg && <p className="mt-3 text-sm font-semibold text-red-600">{msg}</p>}

      {tab === 'overview' && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-[20px] border border-[var(--line)] bg-white p-6">
              <p className="text-sm text-[var(--muted)]">{label}</p>
              <p className="mt-1 text-3xl font-extrabold text-[var(--ink)]">{value}</p>
            </div>
          ))}
          {stats.lowStock?.length > 0 && (
            <div className="rounded-[20px] border border-amber-300 bg-amber-50 p-6 sm:col-span-2 lg:col-span-4">
              <p className="font-bold text-amber-800">Low stock alerts</p>
              <ul className="mt-2 space-y-1 text-sm text-amber-800">
                {stats.lowStock.map((p) => (
                  <li key={p._id}>{p.name} — {p.stock} left</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-[var(--line)] bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[var(--muted)]">
              <tr>
                <th className="p-4">Order</th><th className="p-4">Customer</th>
                <th className="p-4">Total</th><th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-[var(--cream)]">
                  <td className="p-4 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">{o.userId?.name}<br /><span className="text-xs text-[var(--faint)]">{o.userId?.email}</span></td>
                  <td className="p-4 font-bold">{inr(o.totalAmount)}</td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => setStatus(o._id, e.target.value)}
                      className="rounded-lg border border-[var(--line-2)] bg-white px-2 py-1.5 capitalize outline-none"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="p-8 text-center text-[var(--muted)]">No orders yet</p>}
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-[var(--line)] bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[var(--muted)]">
              <tr>
                <th className="p-4">Product</th><th className="p-4">Category</th>
                <th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Active</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-[var(--cream)]">
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4">{p.categoryId?.name}</td>
                  <td className="p-4">{inr(p.price)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleProduct(p)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                        p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'coupons' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <form onSubmit={saveCoupon} className="h-fit rounded-[20px] border border-[var(--line)] bg-white p-5">
            <h3 className="font-bold text-[var(--ink)]">New coupon</h3>
            <div className="mt-3 space-y-3">
              <input required placeholder="CODE e.g. PAW10" value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm uppercase outline-none" />
              <div className="flex gap-2">
                <select value={couponForm.discountType}
                  onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  className="w-1/2 rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none">
                  <option value="percentage">% off</option>
                  <option value="fixed">₹ off</option>
                </select>
                <input required type="number" min="1" placeholder="Value" value={couponForm.discountValue}
                  onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  className="w-1/2 rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
              </div>
              <input type="number" min="0" placeholder="Min order ₹ (0 = none)" value={couponForm.minimumOrderAmount}
                onChange={(e) => setCouponForm({ ...couponForm, minimumOrderAmount: e.target.value })}
                className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
              <input type="number" min="0" placeholder="Max discount ₹ (optional)" value={couponForm.maximumDiscount}
                onChange={(e) => setCouponForm({ ...couponForm, maximumDiscount: e.target.value })}
                className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
              <input required type="date" value={couponForm.expiryDate}
                onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
              <input type="number" min="1" placeholder="Usage limit (optional)" value={couponForm.usageLimit}
                onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
            </div>
            <button className="mt-4 w-full rounded-full bg-[var(--brand)] py-2.5 font-bold text-white transition hover:bg-[var(--brand-dark)]">
              Create coupon
            </button>
          </form>

          <div className="overflow-x-auto rounded-[20px] border border-[var(--line)] bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[var(--line)] text-[var(--muted)]">
                <tr><th className="p-4">Code</th><th className="p-4">Discount</th><th className="p-4">Min order</th><th className="p-4">Expiry</th><th className="p-4">Used</th><th className="p-4">Status</th><th className="p-4" /></tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} className="border-b border-[var(--cream)]">
                    <td className="p-4 font-bold">{c.code}</td>
                    <td className="p-4">{c.discountType === 'percentage' ? `${c.discountValue}%` : inr(c.discountValue)}</td>
                    <td className="p-4">{c.minimumOrderAmount ? inr(c.minimumOrderAmount) : '—'}</td>
                    <td className="p-4">{new Date(c.expiryDate).toLocaleDateString('en-IN')}</td>
                    <td className="p-4">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</td>
                    <td className="p-4">
                      <button onClick={() => toggleCoupon(c)} className={`rounded-full px-3 py-1 text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => deleteCoupon(c._id)} className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {coupons.length === 0 && <p className="p-8 text-center text-[var(--muted)]">No coupons yet</p>}
          </div>
        </div>
      )}

      {tab === 'customers' && (
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-[var(--line)] bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[var(--muted)]">
              <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[var(--cream)]">
                  <td className="p-4 font-semibold">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 capitalize">{u.role}</td>
                  <td className="p-4">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
