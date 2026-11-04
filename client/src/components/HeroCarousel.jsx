import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { BANNERS } from '../data/banners'
import Crackers from './Crackers'

const variants = {
  enter: (dir) => ({ x: dir >= 0 ? 80 : -80, opacity: 0, scale: 1.04 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir >= 0 ? -80 : 80, opacity: 0 }),
}

export default function HeroCarousel({ slides = BANNERS }) {
  const [[index, dir], setIndex] = useState([0, 0])
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (d) => setIndex(([i]) => [(i + d + slides.length) % slides.length, d]),
    [slides.length]
  )
  const goTo = (i) => setIndex(([cur]) => [i, i === cur ? cur : i > cur ? 1 : -1])

  useEffect(() => {
    if (paused || slides.length < 2) return
    const t = setInterval(() => go(1), 5000)
    return () => clearInterval(t)
  }, [index, paused, slides.length, go])

  if (!slides.length) return null
  const s = slides[index]

  return (
    <section
      className="mx-auto mt-3 w-full max-w-[1440px] px-3 sm:mt-5 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[300px] overflow-hidden rounded-[25px] shadow-xl sm:h-[360px] lg:h-[420px]">
      <AnimatePresence custom={dir} initial={false}>
        <motion.div
          key={index}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={s.image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-2xl brightness-[.8] saturate-150"
          />
          {s.overlay === false ? (
            <Link to={s.link} className="relative block h-full w-full">
              <img src={s.image} alt={s.title} className="h-full w-full object-contain" />
            </Link>
          ) : (
            <img src={s.image} alt={s.title} className="relative h-full w-full object-contain" />
          )}
          {s.overlay !== false && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.55 }}
                className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-14 lg:px-24"
              >
                <span className="rounded-full bg-[var(--gold)] px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[var(--ink)] shadow-lg sm:text-sm">
                  {s.badge}
                </span>
                <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                  {s.title}
                </h1>
                <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-white/85 sm:text-base lg:text-lg">
                  {s.description}
                </p>
                <Link
                  to={s.link}
                  className="mt-6 inline-flex items-center gap-3 rounded-full border-b-4 border-[var(--gold-dark)] bg-gradient-to-b from-[var(--gold-lite)] to-[var(--gold)] px-8 py-3.5 text-base font-extrabold text-[var(--ink)] shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl sm:px-10 sm:text-lg"
                >
                  {s.cta} <ArrowRight size={20} />
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <Crackers />

      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[var(--ink)] shadow-lg backdrop-blur transition hover:scale-110 hover:bg-white sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[var(--ink)] shadow-lg backdrop-blur transition hover:scale-110 hover:bg-white sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((sl, i) => (
              <button
                key={sl.id || i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
      </div>
    </section>
  )
}
