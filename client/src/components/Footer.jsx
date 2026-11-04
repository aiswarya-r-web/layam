import { Heart, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--card)]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 md:grid-cols-4 md:px-14">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/dog-pic.png"
              alt="Vaalu mascot"
              className="logo-dog h-11 w-11 rounded-full border-2 border-[var(--line-2)] bg-white object-cover"
            />
            <span className="text-xl font-extrabold">
              Vaalu<span className="text-[var(--accent-dark)]">.</span>
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

            <li><Link to="/orders" className="hover:text-[var(--brand)]">My Orders</Link></li>
            <li><Link to="/dogs" className="hover:text-[var(--brand)]">My Dogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[var(--ink)]">Get in touch</h4>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Questions about an order or your pup? We're here to help.
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="mailto:support@vaalu.com"
                className="flex items-center gap-2.5 font-semibold text-[var(--ink)] transition hover:text-[var(--brand)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream-2)] text-[var(--brand)]">
                  <Mail size={16} />
                </span>
                support@vaalu.com
              </a>
            </li>
            <li>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 font-semibold text-[var(--ink)] transition hover:text-[var(--brand)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream-2)] text-[var(--brand)]">
                  <Phone size={16} />
                </span>
                +91 98765 43210
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line)] py-5 text-center text-xs text-[var(--faint)]">
        © {new Date().getFullYear()} Vaalu. Made with love for good dogs everywhere.
      </div>
    </footer>
  )
}
