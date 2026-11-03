import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--card)]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 md:grid-cols-4 md:px-14">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/dog-pic.png"
              alt="Vallu mascot"
              className="logo-dog h-11 w-11 rounded-full border-2 border-[var(--line-2)] bg-white object-cover"
            />
            <span className="text-xl font-extrabold">
              Vallu<span className="text-[var(--accent-dark)]">.</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Premium food, toys & care for happy, healthy dogs.
          </p>
          <p className="mt-3 text-sm font-semibold text-[var(--label)]">
            <Heart size={14} fill="currentColor" className="mr-1 inline text-[var(--rust)]" />
            Every Tail Deserves a Little Extra Love.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[var(--ink)]">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li><Link to="/shop" className="hover:text-[var(--brand)]">All Products</Link></li>
            <li><Link to="/shop?category=dog-food" className="hover:text-[var(--brand)]">Dog Food</Link></li>
            <li><Link to="/shop?category=toys-playtime" className="hover:text-[var(--brand)]">Toys & Playtime</Link></li>
            <li><Link to="/shop?category=health-wellness" className="hover:text-[var(--brand)]">Health & Wellness</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[var(--ink)]">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li><Link to="/about" className="hover:text-[var(--brand)]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--brand)]">Contact Us</Link></li>
            <li><Link to="/orders" className="hover:text-[var(--brand)]">My Orders</Link></li>
            <li><Link to="/dogs" className="hover:text-[var(--brand)]">My Dogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[var(--ink)]">Stay in the loop</h4>
          <p className="mt-3 text-sm text-[var(--muted)]">
            New treats and offers, straight to your inbox.
          </p>
          <form
            className="mt-3 flex overflow-hidden rounded-full border border-[var(--line-2)] bg-white"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2.5 text-sm outline-none"
            />
            <button className="bg-[var(--brand)] px-5 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)]">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[var(--line)] py-5 text-center text-xs text-[var(--faint)]">
        © {new Date().getFullYear()} Vallu. Made with love for good dogs everywhere.
      </div>
    </footer>
  )
}
