import { PawPrint } from 'lucide-react'

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-[var(--accent-dark)]">
      <PawPrint size={40} className="animate-bounce" fill="currentColor" />
      <p className="font-semibold">{text}</p>
    </div>
  )
}
