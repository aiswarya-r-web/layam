import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'

const links = (user) => [
  { to: user ? '/home' : '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },

]

function Badge({ n }) {
  if (!n) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-xs text-white">
      {n}
    </span>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount, wishlist } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)

  const handleLogout = () => {
    setMenu(false)
    logout()
    toast('Logged out', 'info')
    navigate('/', { replace: true })
  }

  const navCls = ({ isActive }) =>
    `transition hover:text-[var(--accent-dark)] ${isActive ? 'font-bold text-[var(--brand)]' : ''}`

  return (
    <nav className="sticky top-0 z-40 flex h-[82px] items-center justify-between border-b border-[var(--line)] bg-[var(--card)]/95 px-6 backdrop-blur md:px-14 lg:px-20">
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <img
          src="/dog-pic.png"
          alt="Vaalu mascot"
          className="logo-dog h-12 w-12 shrink-0 rounded-full border-2 border-[var(--line-2)] bg-white object-cover"
        />
        <span className="truncate text-2xl font-extrabold tracking-tight">
          Vaalu<span className="text-[var(--accent-dark)]">.</span>
        </span>
      </Link>

      <div className="hidden items-center gap-10 text-[16px] font-medium lg:flex">
        {links(user).map((l) => (
          <NavLink key={l.to} to={l.to} className={navCls} end={l.to === '/' || l.to === '/home'}>
            {l.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={navCls}>
            Admin
          </NavLink>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={toggleTheme}
          title={theme === 'veg' ? 'Veg theme — switch to non-veg' : 'Non-veg theme — switch to veg'}
          aria-label="Toggle veg theme"
          className="hidden h-7 w-12 items-center rounded-full border border-[var(--line-2)] bg-[var(--input)] px-1 transition hover:bg-[var(--cream)] sm:flex"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-transform duration-300 ${
              theme === 'veg' ? 'translate-x-5 border-green-600' : 'translate-x-0 border-[#8b2f2f]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${theme === 'veg' ? 'bg-green-600' : 'bg-[#8b2f2f]'}`} />
          </span>
        </button>
        {user ? (
          <>
            <Link to="/wishlist" className="relative rounded-full p-2 transition hover:bg-[var(--cream)]" aria-label="Wishlist">
              <Heart size={23} />
              <Badge n={wishlist.length} />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2 transition hover:bg-[var(--cream)]" aria-label="Cart">
              <ShoppingCart size={23} />
              <Badge n={cartCount} />
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[var(--cream)]"
              >
                <User size={21} />
                <span className="hidden max-w-[100px] truncate text-sm font-semibold sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              {menu && (
                <div
                  className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-[var(--line)] bg-white py-2 shadow-xl"
                  onMouseLeave={() => setMenu(false)}
                >
                  {[
                    ['/profile', 'My Profile'],
                    ['/dogs', 'My Dogs'],
                    ['/orders', 'My Orders'],
                    ...(user.role === 'admin' ? [['/admin', 'Admin Dashboard']] : []),
                  ].map(([to, label]) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenu(false)}
                      className="block px-4 py-2 text-sm transition hover:bg-[var(--page)] hover:text-[var(--brand)]"
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-2 text-[15px] font-semibold text-[var(--label)] transition hover:bg-[var(--cream)] sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center rounded-full bg-[var(--brand)] px-5 py-2.5 text-[15px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--brand-dark)]"
            >
              Sign up
            </Link>
          </>
        )}
        <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-[var(--line)] bg-[var(--card)] px-6 py-4 shadow-lg lg:hidden">
          {links(user).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/' || l.to === '/home'}
              onClick={() => setOpen(false)}
              className="block py-2 font-medium"
            >
              {l.label}
            </NavLink>
          ))}
          {!user && (
            <NavLink to="/login" onClick={() => setOpen(false)} className="block py-2 font-medium">
              Log in
            </NavLink>
          )}
          <button
            onClick={toggleTheme}
            className="mt-2 flex w-full items-center gap-2.5 border-t border-[var(--line)] py-3 font-medium"
          >
            <span className={`flex h-4 w-4 items-center justify-center border-2 ${theme === 'veg' ? 'border-green-600' : 'border-[#8b2f2f]'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${theme === 'veg' ? 'bg-green-600' : 'bg-[#8b2f2f]'}`} />
            </span>
            {theme === 'veg' ? 'Veg theme' : 'Non-veg theme'}
          </button>
        </div>
      )}
    </nav>
  )
}
