import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dog, LogOut, Package, Pencil, User } from 'lucide-react'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const handleLogout = () => {
    logout()
    toast('Logged out', 'info')
    navigate('/', { replace: true })
  }

  const openEdit = () => {
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      currentPassword: '',
      newPassword: '',
    })
    setMsg('')
    setEditing(true)
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    setMsg('')
    setBusy(true)
    try {
      const payload = { name: form.name, phone: form.phone }
      if (form.newPassword) {
        payload.newPassword = form.newPassword
        payload.currentPassword = form.currentPassword
      }
      const res = await api.put('/auth/me', payload)
      setUser(res.data.user)
      setEditing(false)
      toast('Profile updated')
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update profile'
      setMsg(message)
      toast(message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-[800px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[var(--ink)]">My Profile</h1>

      <div className="mt-8 rounded-[25px] border border-[var(--line)] bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cream-2)] text-[var(--brand)]">
              <User size={30} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[var(--ink)]">{user.name}</p>
              <p className="text-sm text-[var(--muted)]">{user.email}</p>
              {user.phone && <p className="text-sm text-[var(--muted)]">{user.phone}</p>}
              <span className="mt-1 inline-block rounded-full bg-[var(--cream-2)] px-3 py-0.5 text-xs font-bold capitalize text-[var(--brand)]">
                {user.role}
              </span>
            </div>
          </div>
          {!editing && (
            <button
              onClick={openEdit}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line-2)] px-4 py-2 text-sm font-bold text-[var(--brand)] transition hover:bg-[var(--cream)]"
            >
              <Pencil size={15} /> Edit
            </button>
          )}
        </div>

        {editing && (
          <form onSubmit={save} className="mt-6 border-t border-[var(--line)] pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-[var(--label)]">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={set('name')}
                  className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-2.5 outline-none focus:border-[var(--accent-dark)]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--label)]">Phone</label>
                <input
                  value={form.phone}
                  onChange={set('phone')}
                  className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-2.5 outline-none focus:border-[var(--accent-dark)]"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[var(--label)]">New password (optional)</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={set('newPassword')}
                  placeholder="Leave blank to keep current"
                  className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-2.5 outline-none focus:border-[var(--accent-dark)]"
                />
              </div>
              {form.newPassword && (
                <div>
                  <label className="text-sm font-semibold text-[var(--label)]">Current password</label>
                  <input
                    type="password"
                    required
                    value={form.currentPassword}
                    onChange={set('currentPassword')}
                    className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-2.5 outline-none focus:border-[var(--accent-dark)]"
                  />
                </div>
              )}
            </div>
            {msg && <p className="mt-3 text-sm font-semibold text-red-600">{msg}</p>}
            <div className="mt-5 flex gap-3">
              <button
                disabled={busy}
                className="flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)] disabled:opacity-60"
              >
                {busy && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-[var(--line-2)] px-6 py-2.5 text-sm font-bold text-[var(--muted)]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {user.addresses?.length > 0 && (
          <div className="mt-6 border-t border-[var(--line)] pt-5">
            <h2 className="font-bold text-[var(--ink)]">Saved addresses</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {user.addresses.map((a) => (
                <div key={a._id} className="rounded-2xl border border-[var(--line)] bg-[var(--input)] p-4 text-sm text-[var(--muted-dark)]">
                  {a.label && <p className="font-bold text-[var(--ink)]">{a.label}</p>}
                  {a.street}, {a.city}, {a.state} {a.postalCode}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link to="/orders" className="flex items-center gap-3 rounded-[20px] border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <Package size={24} className="text-[var(--brand)]" />
          <span className="font-bold text-[var(--ink)]">My Orders</span>
        </Link>
        <Link to="/dogs" className="flex items-center gap-3 rounded-[20px] border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <Dog size={24} className="text-[var(--brand)]" />
          <span className="font-bold text-[var(--ink)]">My Dogs</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-[20px] border border-red-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <LogOut size={24} className="text-red-500" />
          <span className="font-bold text-red-600">Log out</span>
        </button>
      </div>
    </main>
  )
}
