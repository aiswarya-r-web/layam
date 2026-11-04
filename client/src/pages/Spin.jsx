import { Link, useParams } from 'react-router-dom'
import SpinWheel from '../components/SpinWheel'

export default function Spin() {
  const { id } = useParams()

  return (
    <main className="mx-auto max-w-[700px] px-6 py-12 text-center">
      <p className="text-5xl">🎡</p>
      <h1 className="mt-3 text-3xl font-extrabold text-[var(--ink)]">VAALU Paw Spin</h1>
      <p className="mt-2 text-[var(--muted)]">Spin, win &amp; wag — your pawsome surprise awaits!</p>

      <div className="mx-auto mt-8 max-w-[420px]">
        <SpinWheel orderId={id} />
      </div>

      <Link
        to={`/orders/${id}`}
        className="mt-6 inline-block text-sm font-bold text-[var(--brand)] hover:underline"
      >
        ← Back to order
      </Link>
    </main>
  )
}
