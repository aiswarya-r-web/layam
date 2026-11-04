import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await login(form.email, form.password)
      toast(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/home'), { replace: true })
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      toast(message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[30px] border border-[var(--line)] bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <img
            src="/dog-pic.png"
            alt="Vaalu mascot"
            className="logo-dog h-16 w-16 rounded-full border-2 border-[var(--line-2)] bg-[var(--page)] object-cover"
          />
          <h1 className="mt-4 text-2xl font-extrabold text-[var(--ink)]">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Log in to your Vaalu account</p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-[var(--label)]">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-3 outline-none transition focus:border-[var(--accent-dark)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--label)]">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-3 outline-none transition focus:border-[var(--accent-dark)]"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={busy}
            className="w-full rounded-full bg-[var(--brand)] py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--brand-dark)] disabled:opacity-60"
          >
            {busy ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          New to Vaalu?{' '}
          <Link to="/signup" className="font-bold text-[var(--brand)] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
