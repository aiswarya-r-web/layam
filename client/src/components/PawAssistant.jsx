import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  PawPrint,
  ShoppingBag,
  Heart,
  Star,
  ArrowRight,
  Send,
  Circle,
} from 'lucide-react'

const features = [
  { icon: ShoppingBag, title: 'Find the right', subtitle: 'products' },
  { icon: Heart, title: 'Get care &', subtitle: 'feeding tips' },
  { icon: Star, title: 'Personalized', subtitle: 'for your dog' },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const item = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

export default function PawAssistant() {
  return (
    <section className="relative overflow-hidden bg-[#fdf3e3] px-5 py-12 md:px-10 lg:py-14">
      {/* Background decorations */}
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#f1e3cb]/60 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#f2cf8b]/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1450px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr_1fr]">
        {/* LEFT - DOG MASCOT */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative flex items-end justify-center"
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute left-5 top-4 text-[#dda044]"
          >
            <PawPrint size={35} fill="currentColor" />
          </motion.div>

          <motion.span
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute right-5 top-8 text-4xl text-[#a0522d]"
          >
            ✳
          </motion.span>

          <motion.img
            src="/assistant.png"
            alt="Vallu Paw Assistant puppy"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-full max-w-[340px] object-contain drop-shadow-xl"
          />
        </motion.div>

        {/* CENTER - CONTENT */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div variants={item} className="flex items-center gap-2">
            <h2 className="text-3xl font-black tracking-tight text-[#5d3a1a] md:text-4xl xl:text-5xl">
              Paw Assistant
            </h2>
            <PawPrint size={35} fill="#7a4a21" className="text-[#7a4a21]" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-3 max-w-md text-base leading-relaxed text-[#6b553f] md:text-lg"
          >
            Your friendly dog expert. Get product recommendations,
            care tips and more!
          </motion.p>

          <motion.div variants={container} className="mt-6 grid w-full grid-cols-3 gap-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={item}
                  whileHover={{ y: -5, scale: 1.04 }}
                  className="flex items-center gap-2"
                >
                  <Icon size={30} strokeWidth={1.8} className="shrink-0 text-[#8a5a2b]" />
                  <div className="text-left text-xs font-semibold leading-4 text-[#382619] md:text-sm">
                    <p>{feature.title}</p>
                    <p>{feature.subtitle}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div variants={item} className="mt-8">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-4 rounded-full border-b-4 border-[#b8801f] bg-gradient-to-b from-[#f2cf8b] to-[#dda044] px-8 py-4 text-base font-bold text-[#5d3a1a] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl md:text-lg"
            >
              Chat with Paw Assistant
              <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT - CHAT PREVIEW */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-[440px]"
        >
          <div className="overflow-hidden rounded-[30px] border border-[#e8dcc8] bg-[#fffdf8] shadow-[0_15px_40px_rgba(93,58,26,0.12)]">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-[#e8dcc8] bg-[#fdf9f0] px-5 py-4">
              <div className="flex items-center gap-3">
                <img
                  src="/dog-pic.png"
                  alt="Paw Assistant"
                  className="h-10 w-10 rounded-full border border-[#e5d3b3] object-cover"
                />
                <div>
                  <h3 className="font-bold text-[#5d3a1a]">Paw Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#678D36]">
                    <Circle size={8} fill="currentColor" />
                    Online
                  </div>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="space-y-4 p-5">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1e3cb] text-[#7a4a21]">
                  <PawPrint size={20} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-[#f7ead6] px-4 py-3 text-sm text-[#6b553f]">
                  Hi! 🐾 How can I help your furry friend today?
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#ecc89a] px-4 py-3 text-sm text-[#5d3a1a]"
              >
                I have a 3-month-old Golden Retriever. Suggest some toys.
              </motion.div>

              {/* Typing animation */}
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e3cb] text-[#7a4a21]">
                  <PawPrint size={19} />
                </div>
                <div className="flex gap-1 rounded-full bg-[#f7ead6] px-4 py-3">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                      className="h-2 w-2 rounded-full bg-[#7a4a21]"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Chat input preview */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-2 rounded-full border border-[#e5d3b3] bg-white p-2 pl-4">
                <span className="flex-1 text-sm text-[#a08b74]">
                  Ask anything about your dog...
                </span>
                <motion.span
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7a4a21] text-white"
                >
                  <Send size={17} />
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
