import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PawPrint, Truck, ShieldCheck, BadgePercent, Bone } from 'lucide-react'
import api from '../api/axios'
import HeroCarousel from '../components/HeroCarousel'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'

const CATEGORY_ICONS = {
  'dog-food': '🥣',
  'treats-snacks': '🍪',
  'toys-playtime': '🎾',
  'grooming-hygiene': '🧴',
  'collars-leashes': '🦮',
  'beds-furniture': '🛏️',
  'health-wellness': '❤️',
  'clothing-accessories': '👕',
  'feeding-accessories': '🍖',
  'travel-accessories': '🧳',
}

const perks = [
  { icon: Truck, title: 'Free Delivery', text: 'On orders above ₹999' },
  { icon: ShieldCheck, title: 'Quality Checked', text: 'Vet-friendly picks only' },
  { icon: BadgePercent, title: 'Great Offers', text: 'Deals your dog will love' },
  { icon: Bone, title: 'For Every Dog', text: 'Puppy to senior, small to large' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products?sort=popular&limit=8'),
      api.get('/categories'),
    ])
      .then(([p, c]) => {
        setFeatured(p.data.products)
        setCategories(c.data.categories)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <HeroCarousel />

      {/* CATEGORIES */}
      <section className="relative mx-auto max-w-[1400px] px-6 py-12 md:px-14">
        <PawPrint size={90} className="absolute right-6 top-4 text-[var(--cream-2)]" fill="currentColor" />
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-extrabold text-[var(--ink)]">Shop by Category</h2>
          <PawPrint size={28} className="text-[var(--gold)]" fill="currentColor" />
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Find everything your furry friend needs, all in one place.
        </p>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-4 lg:overflow-visible">
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c._id}
              to={`/shop?category=${c.slug}`}
              className="group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-[var(--line)] bg-white py-2.5 pl-3 pr-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-lg"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--page)] text-lg transition group-hover:bg-[var(--gold-lite)]">
                {CATEGORY_ICONS[c.slug] || '🐾'}
              </span>
              <span className="text-sm font-bold text-[var(--ink)]">{c.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--line)]" />
          <PawPrint size={18} className="text-[var(--gold)]" fill="currentColor" />
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-[1400px] px-6 py-6 md:px-14">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold text-[var(--ink)]">Best Sellers</h2>
          <Link to="/shop" className="text-sm font-bold text-[var(--brand)] hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* WHY LAYAM */}
      <section className="mx-auto max-w-[1400px] px-6 py-14 md:px-14">
        <h2 className="text-center text-3xl font-extrabold text-[var(--ink)]">Why choose Vallu?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-[25px] border border-[var(--line)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cream-2)] text-[var(--brand)]">
                <Icon size={26} />
              </div>
              <h3 className="mt-4 font-bold text-[var(--ink)]">{title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
