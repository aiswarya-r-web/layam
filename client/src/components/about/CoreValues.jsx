import React from 'react'

export default function CoreValues() {
  const values = [
    {
      title: 'Quality First',
      description: 'Safe, durable and dog-approved products.',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#D68A19" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" fill="#D68A19" fillOpacity="0.2" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" fill="#D68A19" fillOpacity="0.15" />
          <circle cx="12" cy="8" r="3" fill="#D68A19" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'Pet-Centric',
      description: "Every decision puts your dog's happiness first.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#D68A19">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          {/* Paw in white inside */}
          <ellipse cx="9" cy="8.5" rx="0.9" ry="1.2" fill="#FFFFFF" />
          <ellipse cx="12" cy="7.2" rx="0.9" ry="1.2" fill="#FFFFFF" />
          <ellipse cx="15" cy="8.5" rx="0.9" ry="1.2" fill="#FFFFFF" />
          <ellipse cx="7.2" cy="11.2" rx="0.75" ry="1" fill="#FFFFFF" />
          <path d="M9.8 12.8C9.8 11.4 10.8 10.7 12 10.7C13.2 10.7 14.2 11.4 14.2 12.8C14.2 14.3 13.1 15.4 12 15.4C10.9 15.4 9.8 14.3 9.8 12.8Z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      title: 'Thoughtful & Safe',
      description: 'Carefully sourced, pet-friendly and reliable brands.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#2B5222">
          <path d="M11 20A9 9 0 0 1 2 11C2 6.5 6 3 11 3c2 0 4 .8 5.5 2.1C18 3.8 20 3 22 3c0 5-3.5 9-8.5 9.5L12 20z" />
          <path d="M11 20c0-4.5 3.5-8.5 8-9" stroke="#EBF1E4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      ),
    },
    {
      title: 'Community',
      description: 'A growing family of dog lovers who care and share.',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="#D68A19">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="relative px-6 py-12 md:px-12 lg:px-16 xl:px-20 overflow-hidden">
      {/* Decorative Paw on Far Left */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 text-[#E8D5BE] pointer-events-none hidden md:block">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="7" rx="2" ry="3" />
          <ellipse cx="11" cy="4" rx="2" ry="3" />
          <ellipse cx="16" cy="5" rx="2" ry="3" />
          <ellipse cx="20" cy="9" rx="2" ry="3" />
          <path d="M7 14C7 11.5 9 10 12.5 10C16 10 18 11.5 18 14C18 17.5 15.5 20 12.5 20C9.5 20 7 17.5 7 14Z" />
        </svg>
      </div>

      {/* Decorative Paw on Far Right */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 text-[#E8D5BE] pointer-events-none hidden md:block">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="6" cy="7" rx="2" ry="3" />
          <ellipse cx="11" cy="4" rx="2" ry="3" />
          <ellipse cx="16" cy="5" rx="2" ry="3" />
          <ellipse cx="20" cy="9" rx="2" ry="3" />
          <path d="M7 14C7 11.5 9 10 12.5 10C16 10 18 11.5 18 14C18 17.5 15.5 20 12.5 20C9.5 20 7 17.5 7 14Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-[1360px]">
        {/* Section Heading */}
        <div className="text-center mb-10 flex items-center justify-center">
          <h2 className="font-serif-title text-[30px] sm:text-[34px] lg:text-[38px] font-bold text-[var(--about-dark-brown)] leading-tight">
            Our Core Values
          </h2>
          <span className="inline-block ml-3 text-[var(--about-forest-green)] align-middle">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 19L9 15M13 21L12 15M20 16L15 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {/* 4 Horizontally Aligned Columns */}
        <div className="about-values-grid">
          {values.map((item) => (
            <div key={item.title} className="about-value-col">
              <div className="mb-3 flex items-center justify-center h-12">
                {item.icon}
              </div>
              <h3 className="font-serif-title text-[18px] lg:text-[19px] font-bold text-[var(--about-dark-brown)]">
                {item.title}
              </h3>
              <p className="mt-2 text-[13.5px] sm:text-[14px] text-[var(--about-text-dark)]/85 leading-[1.55] max-w-[240px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
