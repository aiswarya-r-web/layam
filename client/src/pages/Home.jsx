import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  { icon: Truck, title: 'Free Delivery', text: 'On orders above ₹999', bg: 'var(--peach-2)' },
  { icon: ShieldCheck, title: 'Quality Checked', text: 'Vet-friendly picks only', bg: 'var(--gold-x)' },
  { icon: BadgePercent, title: 'Great Offers', text: 'Deals your dog will love', bg: '#FCE5E5' },
  { icon: Bone, title: 'For Every Dog', text: 'Puppy to senior, small to large', bg: 'var(--peach)' },
]

const perksContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

const perkCard = {
  hidden: { opacity: 0, y: 45, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

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
      <section className="relative mx-auto max-w-[1400px] overflow-hidden px-6 py-14 md:px-14">
        {/* Floating paw decorations */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 13, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[4%] top-10 text-[var(--line-2)]"
        >
          <PawPrint size={34} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 13, 0], rotate: [0, -16, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-[5%] text-[var(--gold)]"
        >
          <PawPrint size={30} fill="currentColor" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-2"
        >
          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <PawPrint size={28} fill="var(--rust)" className="text-[var(--rust)]" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-[var(--ink)]">Why choose Vaalu?</h2>
        </motion.div>

        <motion.div
          variants={perksContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {perks.map(({ icon: Icon, title, text, bg }, index) => (
            <motion.div
              key={title}
              variants={perkCard}
              whileHover={{ y: -10, scale: 1.03, rotate: index % 2 === 0 ? -1 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{ backgroundColor: bg }}
              className="group relative overflow-hidden rounded-[28px] p-6 text-center shadow-sm hover:shadow-xl"
            >
              <motion.span
                animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                className="absolute right-5 top-4 text-xl text-[var(--rust)]"
              >
                ✳
              </motion.span>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-[var(--brand)] shadow-sm"
              >
                <Icon size={28} />
              </motion.div>
              <h3 className="mt-4 font-extrabold text-[var(--ink)]">{title}</h3>
              <p className="mt-1 text-sm text-[var(--muted-dark)]">{text}</p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 0.15, y: 0 }}
                className="pointer-events-none absolute -bottom-3 -left-3 text-[var(--brand)]"
              >
                <PawPrint size={60} fill="currentColor" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  )
}
