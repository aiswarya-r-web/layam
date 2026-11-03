import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-14 md:px-14">
      <h1 className="text-3xl font-extrabold text-[var(--ink)]">Contact Us</h1>
      <p className="mt-2 text-[var(--muted)]">Questions about an order or a product? We'd love to help.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true) }}
          className="rounded-[25px] border border-[var(--line)] bg-white p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-[var(--label)]">Name</label>
              <input required className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-2.5 outline-none focus:border-[var(--accent-dark)]" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[var(--label)]">Email</label>
              <input type="email" required className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-2.5 outline-none focus:border-[var(--accent-dark)]" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold text-[var(--label)]">Message</label>
            <textarea required rows={5} className="mt-1 w-full rounded-xl border border-[var(--line-2)] bg-[var(--input)] px-4 py-3 outline-none focus:border-[var(--accent-dark)]" />
          </div>
          {sent && (
            <p className="mt-3 rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              Thanks! We'll get back to you within 24 hours.
            </p>
          )}
          <button className="mt-5 rounded-full bg-[var(--brand)] px-8 py-3 font-bold text-white transition hover:bg-[var(--brand-dark)]">
            Send message
          </button>
        </form>

        <div className="space-y-4">
          {[
            [Mail, 'Email', 'hello@layam.pet'],
            [Phone, 'Phone', '+91 98765 43210'],
            [MapPin, 'Address', 'Chennai, Tamil Nadu, India'],
          ].map(([Icon, label, value]) => (
            <div key={label} className="flex items-center gap-4 rounded-[20px] border border-[var(--line)] bg-white p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream-2)] text-[var(--brand)]">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">{label}</p>
                <p className="font-bold text-[var(--ink)]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
