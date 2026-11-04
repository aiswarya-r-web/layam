import { Link } from 'react-router-dom'
import { ArrowRight, Heart, PawPrint, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ExploreCollections from '../components/ExploreCollections'
import PawAssistantSection from '../components/PawAssistantSection'
import VaaluCommunity from '../components/VaaluCommunity'

export default function Landing() {
  const { user } = useAuth()

  return (
    <main>
      <section className="relative mx-auto grid min-h-[calc(100vh-82px)] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-10 md:px-14 lg:grid-cols-[1fr_1.08fr] lg:gap-12 lg:px-20">
        <div className="relative z-10 flex flex-col items-start">
          <span className="mb-5 rounded-full border border-[var(--line-2)] bg-white/60 px-4 py-2 text-xs font-semibold tracking-widest text-[var(--accent-dark)]">
            🐾 WELCOME TO VAaLU
          </span>

          <h1 className="max-w-[650px] text-5xl font-extrabold leading-[1.12] tracking-tight text-[var(--ink)] md:text-6xl xl:text-[68px]">
            Treat your furry friend to the best.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)] md:text-xl">
            Premium food, toys & care for happy, healthy dogs. Because your
            little companion deserves it all.
          </p>

          {user ? (
            <Link
              to="/home"
              className="group mt-10 inline-flex min-w-[280px] items-center justify-center gap-5 rounded-full border-b-4 border-[var(--gold-dark)] bg-gradient-to-b from-[var(--gold-lite)] to-[var(--gold)] px-10 py-5 text-xl font-bold text-[var(--ink)] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-1"
            >
              Continue shopping
              <ArrowRight size={27} className="transition group-hover:translate-x-2" />
            </Link>
          ) : (
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 rounded-full border-b-4 border-[var(--gold-dark)] bg-gradient-to-b from-[var(--gold-lite)] to-[var(--gold)] px-9 py-4 text-lg font-bold text-[var(--ink)] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-1"
              >
                <UserPlus size={22} /> Sign up free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full border-2 border-[var(--brand)] bg-white px-9 py-4 text-lg font-bold text-[var(--brand)] shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[var(--cream)]"
              >
                <LogIn size={22} /> Log in
              </Link>
            </div>
          )}

          <p className="mt-6 text-sm text-[var(--muted)]">
            <Heart size={15} fill="currentColor" className="mr-1 inline text-[var(--rust)]" />
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
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/10 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-xl md:bottom-8 md:-left-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream-2)] text-[var(--brand)]">
              <PawPrint size={25} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-[var(--label)]">Happy Paws!</p>
              <p className="text-xs text-gray-500">Happy pets, happy hearts.</p>
            </div>
          </div>

          <div className="absolute -right-5 -top-6 rotate-12 text-5xl text-[var(--sand)]">✦</div>
        </div>
      </section>

      <ExploreCollections />
      <PawAssistantSection />
      <VaaluCommunity />
    </main>
  )
}
