import { useEffect, useState } from 'react'
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
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data)).catch(() => setStats({}))
    api.get('/admin/orders').then((r) => setOrders(r.data.orders)).catch(() => {})
    api.get('/admin/products').then((r) => setProducts(r.data.products)).catch(() => {})
    api.get('/admin/users').then((r) => setUsers(r.data.users)).catch(() => {})
  }, [])

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
  ]

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[#5d3a1a]">Admin Dashboard</h1>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === k ? 'bg-[#7a4a21] text-white' : 'border border-[#e5d3b3] bg-white hover:bg-[#f1e6d2]'
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
            <div key={label} className="rounded-[20px] border border-[#e8dcc8] bg-white p-6">
              <p className="text-sm text-[#8a6a4a]">{label}</p>
              <p className="mt-1 text-3xl font-extrabold text-[#5d3a1a]">{value}</p>
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
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-[#e8dcc8] bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[#e8dcc8] text-[#8a6a4a]">
              <tr>
                <th className="p-4">Order</th><th className="p-4">Customer</th>
                <th className="p-4">Total</th><th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-[#f1e6d2]">
                  <td className="p-4 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">{o.userId?.name}<br /><span className="text-xs text-[#a08b74]">{o.userId?.email}</span></td>
                  <td className="p-4 font-bold">{inr(o.totalAmount)}</td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => setStatus(o._id, e.target.value)}
                      className="rounded-lg border border-[#e5d3b3] bg-white px-2 py-1.5 capitalize outline-none"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="p-8 text-center text-[#8a6a4a]">No orders yet</p>}
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-[#e8dcc8] bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[#e8dcc8] text-[#8a6a4a]">
              <tr>
                <th className="p-4">Product</th><th className="p-4">Category</th>
                <th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Active</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-[#f1e6d2]">
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

      {tab === 'customers' && (
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-[#e8dcc8] bg-white">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-[#e8dcc8] text-[#8a6a4a]">
              <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[#f1e6d2]">
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
