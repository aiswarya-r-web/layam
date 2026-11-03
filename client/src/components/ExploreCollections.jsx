import { motion } from 'framer-motion'
import { ArrowRight, PawPrint } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Food & Treats',
    description: 'Nutritious & tasty picks for a healthy pup.',
    image: '/rope.png',
    bg: '#FFE8D2',
    to: '/shop?category=dog-food',
  },
  {
    name: 'Toys',
    description: 'Fun, durable toys for endless playtime.',
    image: '/dog-toy.png',
    bg: '#FFF0C9',
    to: '/shop?category=toys-playtime',
  },
  {
    name: 'Grooming',
    description: 'Keep them clean, fresh & happy.',
    image: '/grooming.png',
    bg: '#FCE5E5',
    to: '/shop?category=grooming-hygiene',
  },
  {
    name: 'Accessories',
    description: 'Stylish, comfy & safe everyday essentials.',
    image: '/collar.png',
    bg: '#FFE9D7',
    to: '/shop?category=collars-leashes',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 55, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
}

export default function ExploreCollections() {
  return (
    <section className="relative overflow-hidden px-5 py-16 md:px-12">
      {/* Floating paw decorations */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[7%] top-10 text-[#e5d3b3]"
      >
        <PawPrint size={38} fill="currentColor" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 14, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[8%] top-12 text-[#dda044]"
      >
        <PawPrint size={32} fill="currentColor" />
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <PawPrint size={30} fill="#a0522d" className="text-[#a0522d]" />
          </motion.div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#5d3a1a] md:text-4xl">
            Explore Our Collections
          </h2>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm text-[#8a6a4a] md:text-base"
        >
          Everything your dog needs, in one happy place.
        </motion.p>
      </motion.div>

      {/* Category cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            variants={cardVariants}
            whileHover={{ y: -12, scale: 1.035, rotate: index % 2 === 0 ? -1 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            style={{ backgroundColor: category.bg }}
            className="group relative flex min-h-[265px] flex-col items-center justify-center overflow-hidden rounded-[30px] px-5 py-6 text-center shadow-sm hover:shadow-xl"
          >
            <motion.span
              animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="absolute right-6 top-5 text-2xl text-[#a0522d]"
            >
              ✳
            </motion.span>

            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-3 flex h-[115px] w-full items-center justify-center"
            >
              <motion.img
                src={category.image}
                alt={category.name}
                whileHover={{ scale: 1.17, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 250 }}
                className="h-full w-[78%] object-contain drop-shadow-md"
              />
            </motion.div>

            <h3 className="text-xl font-extrabold text-[#5d3a1a]">{category.name}</h3>
            <p className="mt-1 max-w-[190px] text-sm leading-5 text-[#6b553f]">
              {category.description}
            </p>

            <motion.div whileTap={{ scale: 0.85 }} className="mt-4">
              <Link
                to={category.to}
                aria-label={`Explore ${category.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7a4a21] text-white shadow-md transition-transform hover:scale-110"
              >
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 0.15, y: 0 }}
              className="pointer-events-none absolute -bottom-3 -left-3 text-[#7a4a21]"
            >
              <PawPrint size={65} fill="currentColor" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
