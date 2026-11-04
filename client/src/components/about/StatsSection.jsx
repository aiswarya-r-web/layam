import React from 'react'

export default function StatsSection() {
  const stats = [
    {
      value: '10,000+',
      label: 'Happy Dogs',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="7" rx="2" ry="3" />
          <ellipse cx="11" cy="4" rx="2" ry="3" />
          <ellipse cx="16" cy="5" rx="2" ry="3" />
          <ellipse cx="20" cy="9" rx="2" ry="3" />
          <path d="M7 14C7 11.5 9 10 12.5 10C16 10 18 11.5 18 14C18 17.5 15.5 20 12.5 20C9.5 20 7 17.5 7 14Z" />
        </svg>
      ),
    },
    {
      value: '5,000+',
      label: 'Pet Parents',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      value: '500+',
      label: 'Curated Products',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      value: '4.9★',
      label: 'Customer Rating',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="relative px-6 py-10 md:px-12 lg:px-16 xl:px-20">
      <div className="mx-auto max-w-[1360px] flex items-center justify-center relative">
        
        {/* 3 small green radiating strokes on the left outside the pill */}
        <div className="absolute -left-2 sm:left-4 lg:left-6 text-[var(--about-forest-green)] pointer-events-none hidden sm:block">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 14L8 11M11 5L11 10M17 7L13 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 3 small green radiating strokes on the right outside the pill */}
        <div className="absolute -right-2 sm:right-4 lg:right-6 text-[var(--about-forest-green)] pointer-events-none hidden sm:block">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 19L9 15M13 21L12 15M20 16L15 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Main Pill Container - Expanded across the section */}
        <div className="about-stats-pill-container w-full max-w-[1240px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 items-center">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center px-3 sm:px-6 ${
                  index !== 0 ? 'md:border-l md:border-white/20' : ''
                }`}
              >
                <div className="mb-2 text-white/95">
                  {stat.icon}
                </div>
                <div className="font-serif-title text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-white tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-[12px] sm:text-[13px] font-medium text-[#E8F0E4]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
