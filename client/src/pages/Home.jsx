import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, PawPrint, Truck, ShieldCheck, BadgePercent, Bone } from 'lucide-react'
import api from '../api/axios'
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
      {/* HERO */}
      <section className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-10 md:px-14 lg:grid-cols-[1fr_1.08fr] lg:gap-12 lg:px-20">
        <div className="relative z-10 flex flex-col items-start">
          <span className="mb-5 rounded-full border border-[#e5d3b3] bg-white/60 px-4 py-2 text-xs font-semibold tracking-widest text-[#8a5a2b]">
            🐾 WELCOME TO Vallu
          </span>

          <h1 className="max-w-[650px] text-5xl font-extrabold leading-[1.12] tracking-tight text-[#5d3a1a] md:text-6xl xl:text-[68px]">
            Treat your furry friend to the best.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8a6a4a] md:text-xl">
            Premium food, toys & care for happy, healthy dogs. Because your
            little companion deserves it all.
          </p>

          <Link
            to="/shop"
            className="group mt-10 inline-flex min-w-[280px] items-center justify-center gap-5 rounded-full border-b-4 border-[#b8801f] bg-gradient-to-b from-[#f2cf8b] to-[#dda044] px-10 py-5 text-xl font-bold text-[#5d3a1a] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-1"
          >
            Shop Now
            <ArrowRight size={27} className="transition group-hover:translate-x-2" />
          </Link>

          <p className="mt-5 text-sm text-[#8a6a4a]">
            <Heart size={15} fill="currentColor" className="mr-1 inline text-[#a0522d]" />
            Every Tail Deserves a Little Extra Love.
          </p>
        </div>

        <div className="relative h-[430px] w-full md:h-[580px] lg:h-[min(74vh,740px)]">
          <div className="absolute inset-0 overflow-hidden rounded-[35px] shadow-2xl">
            <img
              src="/pet.png"
              alt="Happy Golden Retriever"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5d3a1a]/10 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-[#e8dcc8] bg-white p-4 shadow-xl md:bottom-8 md:-left-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1e3cb] text-[#7a4a21]">
              <PawPrint size={25} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-[#6b4423]">Happy Paws!</p>
              <p className="text-xs text-gray-500">Happy pets, happy hearts.</p>
            </div>
          </div>

          <div className="absolute -right-5 -top-6 rotate-12 text-5xl text-[#d9c39a]">✦</div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative mx-auto max-w-[1400px] px-6 py-12 md:px-14">
        <PawPrint size={90} className="absolute right-6 top-4 text-[#f1e3cb]" fill="currentColor" />
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-extrabold text-[#5d3a1a]">Shop by Category</h2>
          <PawPrint size={28} className="text-[#dda044]" fill="currentColor" />
        </div>
        <p className="mt-1 text-sm text-[#8a6a4a]">
          Find everything your furry friend needs, all in one place.
        </p>

        <div className="mt-6 flex gap-3 overflow-x-auto pb-4 lg:overflow-visible">
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c._id}
              to={`/shop?category=${c.slug}`}
              className="group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-[#e8dcc8] bg-white py-2.5 pl-3 pr-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#dda044] hover:shadow-lg"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf3e7] text-lg transition group-hover:bg-[#f2cf8b]">
                {CATEGORY_ICONS[c.slug] || '🐾'}
              </span>
              <span className="text-sm font-bold text-[#5d3a1a]">{c.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e8dcc8]" />
          <PawPrint size={18} className="text-[#dda044]" fill="currentColor" />
          <div className="h-px flex-1 bg-[#e8dcc8]" />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-[1400px] px-6 py-6 md:px-14">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold text-[#5d3a1a]">Best Sellers</h2>
          <Link to="/shop" className="text-sm font-bold text-[#7a4a21] hover:underline">
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
        <h2 className="text-center text-3xl font-extrabold text-[#5d3a1a]">Why choose Vallu?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-[25px] border border-[#e8dcc8] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e3cb] text-[#7a4a21]">
                <Icon size={26} />
              </div>
              <h3 className="mt-4 font-bold text-[#5d3a1a]">{title}</h3>
              <p className="mt-1 text-sm text-[#8a6a4a]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
