import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Signup() {
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      return setError('Passwords do not match')
    }
    setBusy(true)
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      toast(`Welcome to Layam, ${user.name.split(' ')[0]}!`)
      navigate('/home', { replace: true })
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed'
      setError(message)
      toast(message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const fields = [
    ['name', 'Full name', 'text', 'Aish R'],
    ['email', 'Email', 'email', 'you@example.com'],
    ['phone', 'Phone (optional)', 'tel', '9876543210'],
    ['password', 'Password', 'password', 'Min. 6 characters'],
    ['confirm', 'Confirm password', 'password', 'Repeat password'],
  ]

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[30px] border border-[var(--line)] bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <img
            src="/dog-pic.png"
            alt="Vaalu mascot"
            className="logo-dog h-16 w-16 rounded-full border-2 border-[var(--line-2)] bg-[var(--page)] object-cover"
          />
          <h1 className="mt-4 text-2xl font-extrabold text-[var(--ink)]">Join Vaalu</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Create your account in seconds</p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {fields.map(([key, label, type, ph]) => (
            <div key={key}>
              <label className="text-sm font-semibold text-[var(--label)]">{label}</label>
              <input
                type={type}
                required={key !== 'phone'}
                value={form[key]}
                onChange={set(key)}
                className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-3 outline-none transition focus:border-[var(--accent-dark)]"
                placeholder={ph}
              />
            </div>
          ))}
          <button
            disabled={busy}
            className="w-full rounded-full bg-[var(--brand)] py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--brand-dark)] disabled:opacity-60"
          >
            {busy ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[var(--brand)] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
