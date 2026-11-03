import { Heart, PawPrint } from 'lucide-react'

export default function About() {
  return (
    <main className="mx-auto max-w-[900px] px-6 py-14 md:px-14">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--line-2)] bg-white text-[var(--accent-dark)]">
          <PawPrint size={30} fill="currentColor" />
        </div>
        <h1 className="mt-5 text-4xl font-extrabold text-[var(--ink)]">About Vallu
          
        </h1>
        <p className="mt-3 text-lg text-[var(--muted)]">Every Tail Deserves a Little Extra Love.</p>
      </div>

      <div className="mt-10 space-y-6 rounded-[30px] border border-[var(--line)] bg-white p-8 leading-relaxed text-[var(--muted-dark)]">
        <p>
          Vallu started with a simple belief: our dogs give us their whole hearts,
          so they deserve the very best in return. We curate premium food, treats,
          toys and care essentials — everything your furry friend needs to live a
          happy, healthy life.
        </p>
        <p>
          From a puppy's first kibble to a senior's orthopedic bed, every product
          in our store is chosen with care. We work with trusted brands, check
          quality obsessively, and price things fairly — because good care
          shouldn't be complicated.
        </p>
        <p>
          Whether your dog is a tug-of-war champion, a professional napper, or a
          snack connoisseur, we've got something that will make their tail wag.
        </p>
        <p className="font-bold text-[var(--brand)]">
          <Heart size={15} fill="currentColor" className="mr-1 inline" />
          Happy pets, happy hearts.
        </p>
      </div>
    </main>
  )
}
