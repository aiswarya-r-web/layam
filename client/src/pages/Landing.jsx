import { Link } from 'react-router-dom'
import { ArrowRight, Heart, PawPrint, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ExploreCollections from '../components/ExploreCollections'
import PawAssistant from '../components/PawAssistant'
import VaaluCommunity from '../components/VaaluCommunity'

export default function Landing() {
  const { user } = useAuth()

  return (
    <main>
      <section className="relative mx-auto grid min-h-[calc(100vh-82px)] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-10 md:px-14 lg:grid-cols-[1fr_1.08fr] lg:gap-12 lg:px-20">
        <div className="relative z-10 flex flex-col items-start">
          <span className="mb-5 rounded-full border border-[#e5d3b3] bg-white/60 px-4 py-2 text-xs font-semibold tracking-widest text-[#8a5a2b]">
            🐾 WELCOME TO VALLU
          </span>

          <h1 className="max-w-[650px] text-5xl font-extrabold leading-[1.12] tracking-tight text-[#5d3a1a] md:text-6xl xl:text-[68px]">
            Treat your furry friend to the best.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8a6a4a] md:text-xl">
            Premium food, toys & care for happy, healthy dogs. Because your
            little companion deserves it all.
          </p>

          {user ? (
            <Link
              to="/home"
              className="group mt-10 inline-flex min-w-[280px] items-center justify-center gap-5 rounded-full border-b-4 border-[#b8801f] bg-gradient-to-b from-[#f2cf8b] to-[#dda044] px-10 py-5 text-xl font-bold text-[#5d3a1a] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-1"
            >
              Continue shopping
              <ArrowRight size={27} className="transition group-hover:translate-x-2" />
            </Link>
          ) : (
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 rounded-full border-b-4 border-[#b8801f] bg-gradient-to-b from-[#f2cf8b] to-[#dda044] px-9 py-4 text-lg font-bold text-[#5d3a1a] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-1"
              >
                <UserPlus size={22} /> Sign up free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full border-2 border-[#7a4a21] bg-white px-9 py-4 text-lg font-bold text-[#7a4a21] shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#f1e6d2]"
              >
                <LogIn size={22} /> Log in
              </Link>
            </div>
          )}

          <p className="mt-6 text-sm text-[#8a6a4a]">
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

      <ExploreCollections />
      <PawAssistant />
      <VaaluCommunity />
    </main>
  )
}
