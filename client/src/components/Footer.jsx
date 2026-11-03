import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[#e8dcc8] bg-[#fdf9f0]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 md:grid-cols-4 md:px-14">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/dog-pic.png"
              alt="Vallu mascot"
              className="logo-dog h-11 w-11 rounded-full border-2 border-[#e5d3b3] bg-white object-cover"
            />
            <span className="text-xl font-extrabold">
              Vallu<span className="text-[#8a5a2b]">.</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-[#8a6a4a]">
            Premium food, toys & care for happy, healthy dogs.
          </p>
          <p className="mt-3 text-sm font-semibold text-[#6b4423]">
            <Heart size={14} fill="currentColor" className="mr-1 inline text-[#a0522d]" />
            Every Tail Deserves a Little Extra Love.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#5d3a1a]">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#8a6a4a]">
            <li><Link to="/shop" className="hover:text-[#7a4a21]">All Products</Link></li>
            <li><Link to="/shop?category=dog-food" className="hover:text-[#7a4a21]">Dog Food</Link></li>
            <li><Link to="/shop?category=toys-playtime" className="hover:text-[#7a4a21]">Toys & Playtime</Link></li>
            <li><Link to="/shop?category=health-wellness" className="hover:text-[#7a4a21]">Health & Wellness</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#5d3a1a]">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#8a6a4a]">
            <li><Link to="/about" className="hover:text-[#7a4a21]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#7a4a21]">Contact Us</Link></li>
            <li><Link to="/orders" className="hover:text-[#7a4a21]">My Orders</Link></li>
            <li><Link to="/dogs" className="hover:text-[#7a4a21]">My Dogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#5d3a1a]">Stay in the loop</h4>
          <p className="mt-3 text-sm text-[#8a6a4a]">
            New treats and offers, straight to your inbox.
          </p>
          <form
            className="mt-3 flex overflow-hidden rounded-full border border-[#e5d3b3] bg-white"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2.5 text-sm outline-none"
            />
            <button className="bg-[#7a4a21] px-5 text-sm font-bold text-white transition hover:bg-[#5f3a19]">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#e8dcc8] py-5 text-center text-xs text-[#a08b74]">
        © {new Date().getFullYear()} Vallu. Made with love for good dogs everywhere.
      </div>
    </footer>
  )
}
