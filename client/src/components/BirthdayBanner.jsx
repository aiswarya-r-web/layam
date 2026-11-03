import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const CONFETTI = Array.from({ length: 18 }, (_, i) => i)

export default function BirthdayBanner() {
  const { user } = useAuth()
  const [upcoming, setUpcoming] = useState([])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!user) return
    api.get('/birthday/upcoming').then((r) => setUpcoming(r.data.upcoming)).catch(() => {})
  }, [user])

  const pet = upcoming[0]
  if (!pet || dismissed) return null
  if (sessionStorage.getItem(`bday-dismissed-${pet._id}-${pet.daysUntil}`)) return null

  const close = () => {
    sessionStorage.setItem(`bday-dismissed-${pet._id}-${pet.daysUntil}`, '1')
    setDismissed(true)
  }

  const isToday = pet.daysUntil === 0

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border-2 border-[var(--line-2)] bg-[var(--cream-x)] p-8 text-center shadow-2xl">
        {CONFETTI.map((i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i * 0.37) % 3}s`,
              background: ['var(--brand)', 'var(--gold)', 'var(--gold-3)', 'var(--rust)', 'var(--gold-lite)'][i % 5],
            }}
          />
        ))}

        <button
          onClick={close}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[var(--faint)] transition hover:bg-[var(--cream)] hover:text-[var(--ink)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <img
          src="/dog-pic.png"
          alt="Vallu mascot"
          className="logo-dog mx-auto h-24 w-24 rounded-full border-2 border-[var(--line-2)] object-cover"
        />

        <div className="mt-4 text-3xl">🎂🎈🐾</div>

        <h2 className="mt-2 text-2xl font-extrabold text-[var(--ink)]">
          {isToday ? `Happy Birthday, ${pet.name}!` : 'Something Special is Coming!'}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Hey {user.name.split(' ')[0]}!{' '}
          {isToday
            ? `It's ${pet.name}'s big day — the whole VAALU family is celebrating your furry friend today!`
            : `${pet.name}'s birthday is just ${pet.daysUntil} day${pet.daysUntil === 1 ? '' : 's'} away! Our VAALU family is getting ready to celebrate.`}
          <br />
          {isToday ? 'Have a pawsome day! 🐶❤️' : 'Stay excited — a little surprise might be coming your way. 🐶❤️'}
        </p>

        <p className="mt-4 text-xs font-bold tracking-widest text-[var(--tan)]">
          WITH LOVE, TEAM VAALU
        </p>
      </div>
    </div>
  )
}
