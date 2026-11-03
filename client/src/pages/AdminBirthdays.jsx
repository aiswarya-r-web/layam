import { useEffect, useState } from 'react'
import { Cake, Gift, Plus, X } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import Spinner from '../components/Spinner'
import { useToast } from '../context/ToastContext'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const FILTERS = [
  ['today', 'Today'],
  ['week', 'Next 7 days'],
  ['tendays', 'Next 10 days'],
  ['month', 'This month'],
  ['PENDING', 'Gift pending'],
  ['DISPATCHED', 'Dispatched'],
  ['DELIVERED', 'Delivered'],
]

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-purple-100 text-purple-800',
  DISPATCHED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
}

const NEXT = { PENDING: 'APPROVED', APPROVED: 'PACKED', PACKED: 'DISPATCHED', DISPATCHED: 'DELIVERED' }

export default function AdminBirthdays() {
  const { toast } = useToast()
  const [stats, setStats] = useState(null)
  const [list, setList] = useState([])
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('tendays')
  const [giftFor, setGiftFor] = useState(null)
  const [giftItems, setGiftItems] = useState([])
  const [giftMsg, setGiftMsg] = useState('')
  const [ship, setShip] = useState({})
  const [busy, setBusy] = useState('')

  const load = () => {
    api.get('/admin/birthdays/dashboard').then((r) => setStats(r.data)).catch(() => setStats({}))
    api.get(`/admin/birthdays/upcoming?filter=${filter}`).then((r) => setList(r.data.birthdays)).catch(() => {})
  }

  useEffect(() => { load() }, [filter])

  useEffect(() => {
    api.get('/admin/products').then((r) => setProducts(r.data.products)).catch(() => {})
  }, [])

  const run = async (key, fn, okMsg) => {
    if (busy) return
    setBusy(key)
    try {
      await fn()
      if (okMsg) toast(okMsg)
      load()
    } catch (e) {
      toast(e.response?.data?.message || 'Action failed', 'error')
    } finally {
      setBusy('')
    }
  }

  const estimated = giftItems.reduce((s, i) => {
    const p = products.find((x) => x._id === i.productId)
    return s + (p?.price || 0) * i.quantity
  }, 0)

  const addItem = (productId) => {
    if (!productId || giftItems.some((i) => i.productId === productId)) return
    setGiftItems([...giftItems, { productId, quantity: 1 }])
  }

  const submitGift = () => {
    if (!giftItems.length) return toast('Add at least one gift item', 'error')
    run('gift', async () => {
      await api.post('/admin/birthdays/gifts', {
        petId: giftFor.pet._id,
        items: giftItems,
        giftMessage: giftMsg,
      })
      setGiftFor(null)
      setGiftItems([])
      setGiftMsg('')
    }, 'Birthday gift created')
  }

  const advance = (b, status) =>
    run(b.gift._id, async () => {
      const extra = status === 'DISPATCHED'
        ? { courierName: ship[b.gift._id]?.courier, trackingNumber: ship[b.gift._id]?.tracking }
        : {}
      await api.patch(`/admin/birthdays/gifts/${b.gift._id}/status`, { status, ...extra })
    }, `Gift marked ${status.toLowerCase()}`)

  if (!stats) return <LoadingSpinner />

  const cards = [
    ['Registered birthdays', stats.totalPetBirthdays],
    ['This month', stats.thisMonth],
    ['Next 10 days', stats.next10Days],
    ['Gifts pending', stats.giftsPending],
    ['Dispatched', stats.giftsDispatched],
    ['Delivered', stats.giftsDelivered],
  ]

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10 md:px-14">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold text-[#5d3a1a]">
        <Cake className="text-[#7a4a21]" /> Paw Birthday Club
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(([l, v]) => (
          <div key={l} className="rounded-[20px] border border-[#e8dcc8] bg-white p-4">
            <p className="text-xs text-[#8a6a4a]">{l}</p>
            <p className="mt-1 text-2xl font-extrabold text-[#5d3a1a]">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              filter === k ? 'bg-[#7a4a21] text-white' : 'border border-[#e5d3b3] bg-white hover:bg-[#f1e6d2]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-[20px] border border-[#e8dcc8] bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-[#e8dcc8] text-[#8a6a4a]">
            <tr>
              <th className="p-4">Pet</th><th className="p-4">Owner</th><th className="p-4">Birthday</th>
              <th className="p-4">In</th><th className="p-4">Orders</th><th className="p-4">Eligible</th>
              <th className="p-4">Gift</th><th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.pet._id} className="border-b border-[#f1e6d2] align-top">
                <td className="p-4 font-semibold">{b.pet.name}<br /><span className="text-xs font-normal text-[#a08b74]">{b.pet.breed}</span></td>
                <td className="p-4">{b.owner.name}<br /><span className="text-xs text-[#a08b74]">{b.owner.email}<br />{b.owner.phone}</span></td>
                <td className="p-4">{new Date(b.pet.nextBirthday).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td className="p-4 font-bold text-[#7a4a21]">{b.daysUntil === 0 ? 'Today!' : `${b.daysUntil}d`}</td>
                <td className="p-4">{b.ordersCount}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${b.eligible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.eligible ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4">
                  {b.gift ? (
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[b.gift.status]}`}>
                      {b.gift.status}
                    </span>
                  ) : (
                    <span className="text-xs text-[#a08b74]">—</span>
                  )}
                </td>
                <td className="p-4">
                  {!b.gift && b.eligible && (
                    <button
                      onClick={() => { setGiftFor(b); setGiftItems([]); setGiftMsg('') }}
                      className="inline-flex items-center gap-1 rounded-full bg-[#7a4a21] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#5f3a19]"
                    >
                      <Gift size={13} /> Prepare gift
                    </button>
                  )}
                  {b.gift && NEXT[b.gift.status] && (
                    <div className="space-y-1.5">
                      {b.gift.status === 'PACKED' && (
                        <div className="flex gap-1">
                          <input
                            placeholder="Courier"
                            onChange={(e) => setShip({ ...ship, [b.gift._id]: { ...ship[b.gift._id], courier: e.target.value } })}
                            className="w-20 rounded-lg border border-[#e5d3b3] px-2 py-1 text-xs"
                          />
                          <input
                            placeholder="Tracking #"
                            onChange={(e) => setShip({ ...ship, [b.gift._id]: { ...ship[b.gift._id], tracking: e.target.value } })}
                            className="w-24 rounded-lg border border-[#e5d3b3] px-2 py-1 text-xs"
                          />
                        </div>
                      )}
                      <button
                        onClick={() => advance(b, NEXT[b.gift.status])}
                        disabled={busy === b.gift._id}
                        className="rounded-full bg-[#7a4a21] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#5f3a19] disabled:opacity-50"
                      >
                        Mark {NEXT[b.gift.status].toLowerCase()}
                      </button>
                      <button
                        onClick={() => advance(b, 'CANCELLED')}
                        disabled={busy === b.gift._id}
                        className="ml-1 text-xs font-bold text-red-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-10 text-center text-[#8a6a4a]">No birthdays in this range 🐶</p>}
      </div>

      {/* GIFT MODAL */}
      {giftFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-[25px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-[#5d3a1a]">Gift for {giftFor.pet.name} 🎁</h2>
              <button onClick={() => setGiftFor(null)} className="rounded-full p-1.5 hover:bg-[#f1e6d2]"><X size={18} /></button>
            </div>
            <p className="mt-1 text-xs text-[#8a6a4a]">
              Owner: {giftFor.owner.name} · {giftFor.owner.email}
            </p>

            <select
              onChange={(e) => { addItem(e.target.value); e.target.value = '' }}
              className="mt-4 w-full rounded-xl border border-[#e5d3b3] bg-white px-3 py-2.5 text-sm outline-none"
            >
              <option value="">+ Add a product to the gift</option>
              {products.filter((p) => p.isActive && p.stock > 0).map((p) => (
                <option key={p._id} value={p._id}>{p.name} — {inr(p.price)} ({p.stock} left)</option>
              ))}
            </select>

            <div className="mt-3 space-y-2">
              {giftItems.map((i) => {
                const p = products.find((x) => x._id === i.productId)
                return (
                  <div key={i.productId} className="flex items-center justify-between rounded-xl border border-[#e8dcc8] px-3 py-2 text-sm">
                    <span className="font-semibold">{p?.name}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number" min="1" max={p?.stock}
                        value={i.quantity}
                        onChange={(e) => setGiftItems(giftItems.map((x) => x.productId === i.productId ? { ...x, quantity: Math.max(1, Number(e.target.value)) } : x))}
                        className="w-14 rounded-lg border border-[#e5d3b3] px-2 py-1 text-xs"
                      />
                      <button onClick={() => setGiftItems(giftItems.filter((x) => x.productId !== i.productId))} className="text-red-500"><X size={14} /></button>
                    </div>
                  </div>
                )
              })}
            </div>

            <textarea
              value={giftMsg}
              onChange={(e) => setGiftMsg(e.target.value)}
              placeholder="Personalized birthday card message..."
              rows={2}
              className="mt-3 w-full rounded-xl border border-[#e5d3b3] bg-white px-4 py-2.5 text-sm outline-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="font-extrabold text-[#5d3a1a]">Est. cost: {inr(estimated)}</span>
              <button
                onClick={submitGift}
                disabled={busy === 'gift' || !giftItems.length}
                className="inline-flex items-center gap-2 rounded-full bg-[#7a4a21] px-6 py-2.5 font-bold text-white transition hover:bg-[#5f3a19] disabled:opacity-50"
              >
                {busy === 'gift' ? <Spinner /> : <Plus size={16} />} Create gift
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
