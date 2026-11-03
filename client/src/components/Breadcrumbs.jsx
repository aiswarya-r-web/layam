import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, PawPrint } from 'lucide-react'

const NAMES = {
  home: 'Home', shop: 'Shop', products: 'Product', cart: 'Cart',
  wishlist: 'Wishlist', checkout: 'Checkout', orders: 'My Orders',
  profile: 'Profile', dogs: 'My Dogs', about: 'About', contact: 'Contact',
  admin: 'Admin', birthdays: 'Birthday Club', login: 'Log in', signup: 'Sign up',
}

export default function Breadcrumbs() {
  const { pathname } = useLocation()
  if (pathname === '/' || pathname === '/home') return null

  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex w-full items-center gap-1.5 border-b border-[var(--cream)] bg-[var(--card)] px-6 py-2.5 text-sm md:px-14" aria-label="Breadcrumb">
      <Link to="/home" className="flex items-center gap-1 font-semibold text-[var(--muted)] transition hover:text-[var(--brand)]">
        <PawPrint size={14} /> Home
      </Link>
      {segments.map((seg, i) => {
        const to = '/' + segments.slice(0, i + 1).join('/')
        const last = i === segments.length - 1
        const label = NAMES[seg] || (seg.length > 12 ? `#${seg.slice(-6).toUpperCase()}` : seg)
        return (
          <span key={to} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-[var(--tan)]" />
            {last ? (
              <span className="font-bold text-[var(--brand)]">{label}</span>
            ) : (
              <Link to={to} className="font-semibold text-[var(--muted)] transition hover:text-[var(--brand)]">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
