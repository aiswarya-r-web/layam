import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

const links = (user) => [
  { to: user ? '/home' : '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Badge({ n }) {
  if (!n) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7a4a21] text-xs text-white">
      {n}
    </span>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount, wishlist } = useCart()
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
    `transition hover:text-[#8a5a2b] ${isActive ? 'font-bold text-[#7a4a21]' : ''}`

  return (
    <nav className="sticky top-0 z-40 flex h-[82px] items-center justify-between border-b border-[#e8dcc8] bg-[#fdf9f0]/95 px-6 backdrop-blur md:px-14 lg:px-20">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/dog-pic.png"
          alt="Vallu mascot"
          className="logo-dog h-12 w-12 rounded-full border-2 border-[#e5d3b3] bg-white object-cover"
        />
        <span className="text-2xl font-extrabold tracking-tight">
          Vallu<span className="text-[#8a5a2b]">.</span>
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

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link to="/wishlist" className="relative rounded-full p-2 transition hover:bg-[#f1e6d2]" aria-label="Wishlist">
              <Heart size={23} />
              <Badge n={wishlist.length} />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2 transition hover:bg-[#f1e6d2]" aria-label="Cart">
              <ShoppingCart size={23} />
              <Badge n={cartCount} />
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#f1e6d2]"
              >
                <User size={21} />
                <span className="hidden max-w-[100px] truncate text-sm font-semibold sm:inline">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              {menu && (
                <div
                  className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-[#e8dcc8] bg-white py-2 shadow-xl"
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
                      className="block px-4 py-2 text-sm transition hover:bg-[#faf3e7] hover:text-[#7a4a21]"
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
              className="hidden rounded-full px-4 py-2 text-[15px] font-semibold text-[#6b4423] transition hover:bg-[#f1e6d2] sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center rounded-full bg-[#7a4a21] px-5 py-2.5 text-[15px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#5f3a19]"
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
        <div className="absolute left-0 right-0 top-full border-b border-[#e8dcc8] bg-[#fdf9f0] px-6 py-4 shadow-lg lg:hidden">
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
        </div>
      )}
    </nav>
  )
}
