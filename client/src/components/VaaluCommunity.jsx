import { motion } from 'framer-motion'
import { Heart, Star, Quote } from 'lucide-react'

export default function VaaluCommunity() {
  return (
    <section className="relative overflow-hidden px-5 py-10 md:px-10">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 lg:grid-cols-[0.8fr_1.7fr_1.15fr]">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <h2 className="text-2xl font-black leading-tight text-[var(--ink)] md:text-3xl">
              The VAALU
              <br />
              Community
            </h2>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={27} fill="var(--rust)" className="text-[var(--rust)]" />
            </motion.div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-dark)]">
            Real pets. Real stories.
            <br />
            A happier & healthier
            <br />
            paw family.
          </p>
        </motion.div>

        {/* CENTER - COMMUNITY IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >
          <motion.img
            src="/Community.png"
            alt="VAALU community of happy dogs"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03 }}
            className="h-auto w-full max-w-[560px] rounded-[35px] object-cover shadow-xl"
          />
          <motion.span
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-2 top-0 text-3xl text-[var(--rust)]"
          >
            ✳
          </motion.span>
        </motion.div>

        {/* RIGHT - TESTIMONIAL */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -5 }}
          className="rounded-[30px] border border-[var(--line)] bg-gradient-to-br from-[var(--card-2)] to-[var(--cream-3)] p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <Quote size={30} fill="var(--rust)" className="text-[var(--rust)]" />
            <div className="flex gap-0.5 text-[var(--gold)]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} fill="currentColor" strokeWidth={1} />
              ))}
            </div>
          </div>

          <p className="mt-2 text-sm italic leading-relaxed text-[var(--muted-dark)]">
            "VAALU always has the best quality products for my Bruno.
            The toys are super durable and he absolutely loves them!"
          </p>

          <div className="mt-4 flex items-center gap-3">
            <img
              src="/dog-pic.png"
              alt="Ananya"
              className="h-10 w-10 rounded-full border-2 border-white object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-[var(--ink)]">Ananya S.</h4>
              <p className="text-xs text-[var(--muted)]">Pet Parent</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
