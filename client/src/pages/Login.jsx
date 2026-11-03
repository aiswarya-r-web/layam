import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PawPrint } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
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
      await login(form.email, form.password)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[30px] border border-[#e8dcc8] bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#e5d3b3] bg-[#faf3e7] text-[#8a5a2b]">
            <PawPrint size={28} fill="currentColor" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-[#5d3a1a]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#8a6a4a]">Log in to your Layam account</p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#6b4423]">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-3 outline-none transition focus:border-[#8a5a2b]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[#6b4423]">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#e5d3b3] bg-[#faf9f5] px-4 py-3 outline-none transition focus:border-[#8a5a2b]"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={busy}
            className="w-full rounded-full bg-[#7a4a21] py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#5f3a19] disabled:opacity-60"
          >
            {busy ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#8a6a4a]">
          New to Layam?{' '}
          <Link to="/signup" className="font-bold text-[#7a4a21] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
