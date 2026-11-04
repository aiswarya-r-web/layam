import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  PawPrint,
  ShoppingBag,
  Heart,
  Star,
  ArrowRight,
  Send,
  Circle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAssistant } from '../context/AssistantContext'

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

export default function PawAssistantSection() {
  const { user } = useAuth()
  const { setOpen } = useAssistant()
  const navigate = useNavigate()

  const openChat = () => {
    if (user) setOpen(true)
    else navigate('/signup')
  }

  return (
    <section className="relative overflow-hidden bg-[var(--cream-x)] px-5 py-12 md:px-10 lg:py-14">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[var(--gold-lite)]/60 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[var(--peach)]/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1450px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr_1fr]">
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
            className="absolute left-5 top-4 text-[var(--gold-2)]"
          >
            <PawPrint size={35} fill="currentColor" />
          </motion.div>

          <motion.span
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute right-5 top-8 text-4xl text-[var(--gold-dark)]"
          >
            ✳
          </motion.span>

          <motion.img
            src="/assistant.png"
            alt="VAALU Paw Assistant puppy"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-full max-w-[340px] object-contain drop-shadow-xl"
          />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div variants={item} className="flex items-center gap-2">
            <h2 className="text-3xl font-black tracking-tight text-[var(--brand)] md:text-4xl xl:text-5xl">
              Paw Assistant
            </h2>
            <PawPrint size={35} className="fill-[var(--gold)] text-[var(--gold)]" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-3 max-w-md text-base leading-relaxed text-[var(--muted-dark)] md:text-lg"
          >
            Your AI-powered dog expert. Get product recommendations,
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
                  <Icon size={30} strokeWidth={1.8} className="shrink-0 text-[var(--rust)]" />
                  <div className="text-left text-xs font-semibold leading-4 text-[var(--text)] md:text-sm">
                    <p>{feature.title}</p>
                    <p>{feature.subtitle}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.button
            variants={item}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={openChat}
            className="group mt-8 flex items-center justify-center gap-4 rounded-full border-b-4 border-[var(--gold-dark)] bg-gradient-to-b from-[var(--gold-lite)] to-[var(--gold)] px-8 py-4 text-base font-extrabold text-[var(--ink)] shadow-xl transition hover:shadow-2xl md:text-lg"
          >
            Chat with Paw Assistant
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-[440px]"
        >
          <div className="overflow-hidden rounded-[30px] border border-[var(--line)] bg-[var(--card)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--page)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)] text-white">
                  <PawPrint size={23} fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--label)]">Paw Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-green-600">
                    <Circle size={8} fill="currentColor" />
                    Online
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold-lite)] text-[var(--brand)]">
                  <PawPrint size={20} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-[var(--cream-2)] px-4 py-3 text-sm text-[var(--muted-dark)]">
                  Hi! 🐾 How can I help your furry friend today?
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[var(--peach-2)] px-4 py-3 text-sm text-[var(--label)]"
              >
                I have a 3-month-old Golden Retriever. Suggest some toys.
              </motion.div>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold-lite)] text-[var(--brand)]">
                  <PawPrint size={19} />
                </div>
                <div className="flex gap-1 rounded-full bg-[var(--cream-2)] px-4 py-3">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                      className="h-2 w-2 rounded-full bg-[var(--brand)]"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-white p-2 pl-4">
                <span className="flex-1 text-sm text-[var(--faint)]">
                  Ask anything about your dog...
                </span>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  onClick={openChat}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)] text-white"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
