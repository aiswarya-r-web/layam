import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import AdminTable from '../components/AdminTable'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [coupons, setCoupons] = useState([])
  const [spins, setSpins] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [campaign, setCampaign] = useState(null)
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState(null)
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
    api.get('/spin/admin/history').then((r) => {
      setSpins(r.data.attempts)
      setCampaign(r.data.campaign)
    }).catch(() => {})
    api.get('/categories').then((r) => setCategories(r.data.categories)).catch(() => {})
    api.get('/admin/analytics').then((r) => setAnalytics(r.data)).catch(() => {})
  }, [])

  const startEdit = (p) => {
    setEditing(p._id)
    setEditForm({
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || '',
      stock: p.stock,
      brand: p.brand || '',
      categoryId: p.categoryId?._id || '',
      ageGroup: p.ageGroup || 'all',
      dogSize: p.dogSize || 'all',
    })
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    try {
      const r = await api.put(`/products/${editing}`, {
        ...editForm,
        price: Number(editForm.price),
        originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : undefined,
        stock: Number(editForm.stock),
      })
      setProducts((ps) => ps.map((x) => (x._id === editing ? r.data.product : x)))
      setEditing(null)
      setMsg('')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not save product')
    }
  }

  const saveCampaign = async (e) => {
    e.preventDefault()
    try {
      const r = await api.put('/spin/admin/campaign', {
        minimumOrderAmount: Number(campaign.minimumOrderAmount),
        maxSpinsPerCustomer: Number(campaign.maxSpinsPerCustomer),
        couponExpiryDays: Number(campaign.couponExpiryDays),
        isActive: campaign.isActive,
      })
      setCampaign(r.data.campaign)
      setMsg('')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not save campaign')
    }
  }

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

  const lowStockCount = products.filter((p) => p.stock <= 5).length

  const tabs = [
    ['overview', 'Overview'],
    ['analytics', 'Analytics'],
    ['orders', `Orders (${orders.length})`],
    ['products', `Products (${products.length})${lowStockCount ? ` ⚠${lowStockCount}` : ''}`],
    ['customers', `Customers (${users.length})`],
    ['coupons', `Coupons (${coupons.length})`],
    ['spins', `Paw Spin (${spins.length})`],
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

      {tab === 'analytics' && analytics && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Avg order value', inr(analytics.avgOrderValue)],
              ['Paid orders', analytics.paidOrders],
              ['Top product', analytics.topProducts[0]?.name || '—'],
              ['Revenue (14d)', inr(analytics.revenueByDay.reduce((s, d) => s + d.total, 0))],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] border border-[var(--line)] bg-white p-6">
                <p className="text-sm text-[var(--muted)]">{label}</p>
                <p className="mt-1 text-2xl font-extrabold text-[var(--ink)]">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[20px] border border-[var(--line)] bg-white p-6">
            <h3 className="font-bold text-[var(--ink)]">Revenue — last 14 days</h3>
            <div className="mt-4 flex h-40 items-end gap-1.5">
              {analytics.revenueByDay.map((d) => {
                const max = Math.max(...analytics.revenueByDay.map((x) => x.total), 1)
                return (
                  <div key={d.date} className="group flex h-full flex-1 flex-col items-center gap-1" title={`${d.date}: ${inr(d.total)} (${d.count} orders)`}>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-[var(--brand)]/80 transition group-hover:bg-[var(--brand)]"
                        style={{ height: `${Math.max(2, (d.total / max) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-[var(--faint)]">{d.date.slice(5)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[20px] border border-[var(--line)] bg-white p-6">
              <h3 className="font-bold text-[var(--ink)]">Orders by status</h3>
              <div className="mt-4 space-y-3">
                {STATUSES.map((s) => {
                  const n = analytics.ordersByStatus[s] || 0
                  const total = Math.max(...STATUSES.map((x) => analytics.ordersByStatus[x] || 0), 1)
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-semibold capitalize text-[var(--label)]">{s}</span>
                      <div className="h-3 flex-1 rounded-full bg-[var(--cream)]">
                        <div className="h-3 rounded-full bg-[var(--brand)]" style={{ width: `${(n / total) * 100}%` }} />
                      </div>
                      <span className="w-8 text-right text-sm font-bold text-[var(--ink)]">{n}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[20px] border border-[var(--line)] bg-white p-6">
              <h3 className="font-bold text-[var(--ink)]">Top products</h3>
              <div className="mt-4 space-y-3">
                {analytics.topProducts.map((p, i) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--label)]">
                      <span className="mr-2 text-[var(--gold-dark)]">#{i + 1}</span>{p.name}
                    </span>
                    <span className="text-[var(--muted)]">{p.qty} sold · {inr(p.revenue)}</span>
                  </div>
                ))}
                {analytics.topProducts.length === 0 && (
                  <p className="text-sm text-[var(--muted)]">No sales yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="mt-8">
          <AdminTable
            minWidth={700}
            columns={['Order', 'Customer', 'Total', 'Payment', 'Status']}
            empty="No orders yet"
            rows={orders.map((o) => [
              <span className="font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</span>,
              <>{o.userId?.name}<br /><span className="text-xs text-[var(--faint)]">{o.userId?.email}</span></>,
              <span className="font-bold">{inr(o.totalAmount)}</span>,
              <span className="text-xs">
                <span className="font-bold uppercase">{o.paymentMethod}</span><br />
                <span className={`font-semibold capitalize ${o.paymentStatus === 'paid' ? 'text-green-700' : 'text-amber-600'}`}>{o.paymentStatus}</span>
              </span>,
              <select
                value={o.orderStatus}
                onChange={(e) => setStatus(o._id, e.target.value)}
                className="rounded-lg border border-[var(--line-2)] bg-white px-2 py-1.5 capitalize outline-none"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>,
            ])}
          />
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-8 space-y-6">
          {editing && editForm && (
            <form onSubmit={saveEdit} className="rounded-[20px] border border-[var(--line)] bg-white p-5">
              <h3 className="font-bold text-[var(--ink)]">Edit product</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input required placeholder="Name" value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <select value={editForm.categoryId}
                  onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none">
                  <option value="">Category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <textarea required placeholder="Description" value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none sm:col-span-2" rows="3" />
                <input required type="number" min="0" placeholder="Price ₹" value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <input type="number" min="0" placeholder="Original price ₹ (optional)" value={editForm.originalPrice}
                  onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <input required type="number" min="0" placeholder="Stock" value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <input placeholder="Brand" value={editForm.brand}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <select value={editForm.ageGroup}
                  onChange={(e) => setEditForm({ ...editForm, ageGroup: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none">
                  {['all', 'puppy', 'adult', 'senior'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <select value={editForm.dogSize}
                  onChange={(e) => setEditForm({ ...editForm, dogSize: e.target.value })}
                  className="rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none">
                  {['all', 'small', 'medium', 'large'].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)]">
                  Save changes
                </button>
                <button type="button" onClick={() => setEditing(null)}
                  className="rounded-full border border-[var(--line-2)] px-6 py-2.5 text-sm font-bold text-[var(--label)] transition hover:bg-[var(--cream)]">
                  Cancel
                </button>
              </div>
            </form>
          )}
          <AdminTable
            minWidth={700}
            columns={['Product', 'Category', 'Price', 'Stock', 'Active']}
            empty="No products yet"
            rows={products.map((p) => [
              <span className="font-semibold">{p.name}</span>,
              p.categoryId?.name,
              inr(p.price),
              <>
                {p.stock}
                {p.stock === 0 && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">Out</span>}
                {p.stock > 0 && p.stock <= 5 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">Low</span>}
              </>,
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-full border border-[var(--line-2)] px-3 py-1.5 text-xs font-bold text-[var(--brand)] transition hover:bg-[var(--cream)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleProduct(p)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {p.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>,
            ])}
          />
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

          <AdminTable
            columns={['Code', 'Discount', 'Min order', 'Expiry', 'Used', 'Status', '']}
            empty="No coupons yet"
            rows={coupons.map((c) => [
              <span className="font-bold">{c.code}</span>,
              c.discountType === 'percentage' ? `${c.discountValue}%` : inr(c.discountValue),
              c.minimumOrderAmount ? inr(c.minimumOrderAmount) : '—',
              new Date(c.expiryDate).toLocaleDateString('en-IN'),
              `${c.usedCount}${c.usageLimit ? `/${c.usageLimit}` : ''}`,
              <button onClick={() => toggleCoupon(c)} className={`rounded-full px-3 py-1 text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {c.isActive ? 'Active' : 'Inactive'}
              </button>,
              <button onClick={() => deleteCoupon(c._id)} className="text-xs font-bold text-red-500 hover:underline">Delete</button>,
            ])}
          />
        </div>
      )}

      {tab === 'spins' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <form onSubmit={saveCampaign} className="h-fit rounded-[20px] border border-[var(--line)] bg-white p-5">
            <h3 className="font-bold text-[var(--ink)]">Campaign settings</h3>
            {campaign ? (
              <div className="mt-3 space-y-3">
                <label className="block text-xs font-bold text-[var(--label)]">Min order ₹ to unlock spin</label>
                <input type="number" min="0" value={campaign.minimumOrderAmount}
                  onChange={(e) => setCampaign({ ...campaign, minimumOrderAmount: e.target.value })}
                  className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <label className="block text-xs font-bold text-[var(--label)]">Max spins per customer</label>
                <input type="number" min="1" value={campaign.maxSpinsPerCustomer}
                  onChange={(e) => setCampaign({ ...campaign, maxSpinsPerCustomer: e.target.value })}
                  className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <label className="block text-xs font-bold text-[var(--label)]">Coupon expiry (days)</label>
                <input type="number" min="1" value={campaign.couponExpiryDays}
                  onChange={(e) => setCampaign({ ...campaign, couponExpiryDays: e.target.value })}
                  className="w-full rounded-xl border border-[var(--line-2)] bg-white px-3 py-2.5 text-sm outline-none" />
                <button
                  type="button"
                  onClick={() => setCampaign({ ...campaign, isActive: !campaign.isActive })}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${campaign.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                >
                  {campaign.isActive ? 'Campaign Active' : 'Campaign Inactive'}
                </button>
                <button className="block w-full rounded-full bg-[var(--brand)] py-2.5 font-bold text-white transition hover:bg-[var(--brand-dark)]">
                  Save settings
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">No campaign yet — one is created automatically on first spin.</p>
            )}
          </form>

          <AdminTable
            columns={['Customer', 'Order', 'Reward', 'Code', 'Spun at']}
            empty="No spins yet"
            rows={spins.map((s) => [
              <>{s.userId?.name}<br /><span className="text-xs text-[var(--faint)]">{s.userId?.email}</span></>,
              <span className="font-mono text-xs">#{s.orderId?._id?.slice(-8).toUpperCase()}<br /><span className="text-[var(--faint)]">{inr(s.orderId?.subtotal || 0)}</span></span>,
              <span className="font-semibold">{s.rewardId?.name}</span>,
              <span className="font-mono text-xs">{s.couponId?.code || s.giftCode || '—'}</span>,
              new Date(s.spunAt).toLocaleDateString('en-IN'),
            ])}
          />
        </div>
      )}

      {tab === 'customers' && (
        <div className="mt-8">
          <AdminTable
            minWidth={600}
            columns={['Name', 'Email', 'Role', 'Joined']}
            empty="No customers yet"
            rows={users.map((u) => [
              <span className="font-semibold">{u.name}</span>,
              u.email,
              <span className="capitalize">{u.role}</span>,
              new Date(u.createdAt).toLocaleDateString('en-IN'),
            ])}
          />
        </div>
      )}
    </main>
  )
}
