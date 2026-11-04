import { Link, useNavigate } from 'react-router-dom'
import { Dog, LogOut, Package, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast('Logged out', 'info')
    navigate('/', { replace: true })
  }

  return (
    <main className="mx-auto max-w-[800px] px-6 py-10 md:px-14">
      <h1 className="text-3xl font-extrabold text-[var(--ink)]">My Profile</h1>

      <div className="mt-8 rounded-[25px] border border-[var(--line)] bg-white p-6">
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
