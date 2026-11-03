import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

let idSeq = 0

const ICONS = { success: CheckCircle2, error: XCircle, info: Info }
const COLORS = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-[#8a5a2b]',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = ++idSeq
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[320px] flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info
          return (
            <div
              key={t.id}
              className="toast-item pointer-events-auto flex items-center gap-3 rounded-2xl border border-[#e8dcc8] bg-white px-4 py-3 shadow-xl"
            >
              <Icon size={20} className={`shrink-0 ${COLORS[t.type]}`} />
              <p className="flex-1 text-sm font-semibold text-[#382619]">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-[#a08b74] transition hover:text-[#5d3a1a]"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
