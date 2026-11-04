import { Star } from 'lucide-react'

export default function Rating({ value = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5 text-[var(--gold)]">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={size}
            fill={s <= Math.round(value) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-[var(--muted)]">({count})</span>
      )}
    </div>
  )
}
