import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const CONFETTI_COLORS = ['var(--brand)', 'var(--gold)', 'var(--gold-2)', '#e2574c', '#5aa469', 'var(--rust)']
const CONFETTI = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 83) % 100}%`,
  delay: `${(i % 10) * 0.12}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  width: 6 + (i % 3) * 3,
  height: 10 + (i % 4) * 3,
}))

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [state, setState] = useState('verifying')
  const [orderId, setOrderId] = useState(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    if (!sessionId) return setState('failed')
    api
      .post('/stripe/verify', { sessionId })
      .then((r) => {
        if (r.data.verified) {
          setOrderId(r.data.orderId)
          setState('verified')
        } else {
          setState('unpaid')
        }
      })
      .catch(() => setState('failed'))
  }, [sessionId])

  if (state === 'verifying') {
    return (
      <main className="mx-auto max-w-[700px] px-6 py-20 text-center">
        <LoadingSpinner text="Confirming your payment..." />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[700px] px-6 py-20 text-center">
      {state === 'verified' ? (
        <>
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
          <img src="/dognew.gif" alt="" className="mx-auto h-16" />
          <h1 className="mt-4 text-3xl font-extrabold text-[var(--ink)]">Payment successful!</h1>
          <p className="mt-2 text-[var(--muted)]">
            Your order is confirmed — your pup's goodies are on the way.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            {orderId && (
              <Link
                to={`/orders/${orderId}`}
                className="rounded-full bg-[var(--brand)] px-8 py-3 font-bold text-white transition hover:bg-[var(--brand-dark)]"
              >
                View order
              </Link>
            )}
            <Link
              to="/shop"
              className="rounded-full border border-[var(--line-2)] px-8 py-3 font-bold text-[var(--brand)] transition hover:bg-[var(--cream)]"
            >
              Keep shopping
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-5xl">😟</p>
          <h1 className="mt-4 text-2xl font-extrabold text-[var(--ink)]">
            {state === 'unpaid' ? 'Payment not completed' : 'Could not verify payment'}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            {state === 'unpaid'
              ? 'Your payment was cancelled or did not go through. No charges were made.'
              : 'Something went wrong — if you were charged, contact support with your receipt.'}
          </p>
          <Link
            to="/checkout"
            className="mt-8 inline-flex rounded-full bg-[var(--brand)] px-8 py-3 font-bold text-white transition hover:bg-[var(--brand-dark)]"
          >
            Back to checkout
          </Link>
        </>
      )}
    </main>
  )
}
