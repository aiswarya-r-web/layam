import { useEffect, useState } from 'react'
import { Copy, Gift } from 'lucide-react'
import api from '../api/axios'
import { useToast } from '../context/ToastContext'

const SEG_COLORS = [
  'var(--gold-lite)', 'var(--cream-2)', 'var(--gold-3)', 'var(--cream)',
  'var(--gold-2)', 'var(--sand)', 'var(--gold)', 'var(--peach)',
]
const CONFETTI_COLORS = ['var(--brand)', 'var(--gold)', 'var(--gold-2)', '#e2574c', '#5aa469', 'var(--rust)']

const CONFETTI = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 83) % 100}%`,
  delay: `${(i % 10) * 0.12}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  width: 6 + (i % 3) * 3,
  height: 10 + (i % 4) * 3,
}))

export default function SpinWheel({ orderId }) {
  const { toast } = useToast()
  const [info, setInfo] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [blast, setBlast] = useState(false)
  const [msg, setMsg] = useState('')

  const celebrate = (rewardType) => {
    if (rewardType === 'no_win') return
    setBlast(true)
    setTimeout(() => setBlast(false), 2400)
  }

  useEffect(() => {
    api
      .get(`/spin/status?orderId=${orderId}`)
      .then((r) => {
        setInfo(r.data)
        if (r.data.attempt) {
          setResult({ ...r.data.attempt, done: true })
          celebrate(r.data.attempt.reward?.rewardType)
        }
      })
      .catch(() => {})
  }, [orderId])

  if (!info || (!info.eligible && !info.reason && !result)) return null

  const rewards = info.rewards || []
  const gradient = `conic-gradient(${rewards
    .map((_, i) => `${SEG_COLORS[i % SEG_COLORS.length]} ${i * 45}deg ${(i + 1) * 45}deg`)
    .join(', ')})`

  const doSpin = async () => {
    if (spinning) return
    setMsg('')
    setSpinning(true)
    try {
      const res = await api.post('/spin', { orderId })
      const { segmentIndex, reward, coupon, giftCode } = res.data
      const target = 360 * 6 + (360 - (segmentIndex * 45 + 22.5))
      setRotation(target)
      setTimeout(() => {
        setResult({ reward, coupon, giftCode })
        setSpinning(false)
        celebrate(reward.rewardType)
      }, 4300)
    } catch (e) {
      setSpinning(false)
      setMsg(e.response?.data?.message || 'Could not spin right now')
    }
  }

  const copy = (code) => {
    navigator.clipboard?.writeText(code)
    toast('Coupon code copied')
  }

  return (
    <div className="rounded-[25px] border border-[var(--line)] bg-white p-6 text-center shadow-sm">
      <h2 className="flex items-center justify-center gap-2 font-extrabold text-[var(--ink)]">
        <Gift size={18} /> Your Pawsome Surprise Awaits!
      </h2>

      {!result && !info.eligible && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--muted)]">
          🔒 {info.reason}
        </p>
      )}

      {!result && info.eligible && (
        <>
          <p className="mt-1 text-xs text-[var(--muted)]">
            You spent ₹{info.minimumOrderAmount}+ — spin the wheel for a little extra happiness!
          </p>

          <div className="relative mx-auto mt-4 aspect-square w-full max-w-[260px]">
            <div
              className="absolute -top-1 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-[var(--brand)]"
            />
            <div
              className="absolute inset-0 rounded-full border-4 border-[var(--brand)] shadow-lg"
              style={{
                background: gradient,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? 'transform 4.2s cubic-bezier(0.15, 0.9, 0.2, 1)'
                  : 'none',
              }}
            >
              {rewards.map((r, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex justify-center"
                  style={{ transform: `rotate(${i * 45 + 22.5}deg)` }}
                >
                  <span
                    className="mt-2 text-[8px] font-extrabold uppercase leading-tight text-[var(--ink)]"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '42%' }}
                  >
                    {r.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--brand)] text-xl text-white shadow-md">
              🐾
            </div>
          </div>

          {msg && <p className="mt-3 text-sm font-semibold text-red-600">{msg}</p>}

          <button
            onClick={doSpin}
            disabled={spinning}
            className="mt-4 w-full rounded-full bg-[var(--brand)] py-3 font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--brand-dark)] disabled:opacity-50"
          >
            {spinning ? 'Spinning...' : 'SPIN NOW'}
          </button>
        </>
      )}

      {result && (
        <div className="mt-3">
          {result.reward?.rewardType === 'no_win' ? (
            <p className="text-sm font-bold text-[var(--muted-dark)]">
              Better luck next time — your pup still loves you 🐾
            </p>
          ) : (
            <>
              <p className="text-lg font-extrabold text-[var(--ink)]">You won {result.reward?.name}!</p>
              {result.coupon && (
                <button
                  onClick={() => copy(result.coupon.code)}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[var(--gold)] bg-[var(--page)] px-4 py-2 font-extrabold tracking-wider text-[var(--ink)] transition hover:bg-[var(--cream)]"
                >
                  {result.coupon.code} <Copy size={14} />
                </button>
              )}
              {result.coupon && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Use on your next order before{' '}
                  {new Date(result.coupon.expiryDate).toLocaleDateString('en-IN')}
                </p>
              )}
              {result.giftCode && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-[var(--gold)] bg-[var(--page)] px-4 py-2 font-extrabold tracking-wider text-[var(--ink)]">
                  {result.giftCode}
                </p>
              )}
              {result.giftCode && (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Show this code to claim your free toy with a future delivery
                </p>
              )}
            </>
          )}
        </div>
      )}

      {blast && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {CONFETTI.map((c, i) => (
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
        </div>
      )}
    </div>
  )
}
