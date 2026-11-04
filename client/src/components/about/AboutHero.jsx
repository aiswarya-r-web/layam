import React from 'react'

export default function AboutHero() {
  return (
    <section className="about-hero-section relative w-full overflow-hidden">
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Column: ~48% width */}
        <div className="w-full lg:w-[48%] pl-6 sm:pl-12 lg:pl-16 pr-6 lg:pr-4 py-8 lg:py-6 z-10 flex flex-col justify-center relative">
          
          {/* Eyebrow Badge */}
          <div className="mb-3.5">
            <span className="about-eyebrow-badge">
              <span className="text-[#A0522D] text-xs">♥</span> About Vaalu
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif-title text-[32px] sm:text-[38px] lg:text-[42px] font-bold text-[var(--about-dark-brown)] leading-[1.15]">
            More Than a Pet Store,
            {/* 3 orange radiating lines right next to Store, */}
            <span className="inline-block relative ml-2 align-middle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[var(--about-orange)]">
                <path d="M4 14L8 11M11 5L11 10M17 7L13 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="block relative mt-1">
              A Family for Dog Lovers
              {/* Green hand-drawn wavy underline */}
              <svg
                className="block w-full max-w-[285px] mt-1 text-[var(--about-forest-green)]"
                viewBox="0 0 290 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 10C55 3 155 3 287 9C220 5 120 6 42 12"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 text-[14px] sm:text-[14.5px] text-[var(--about-text-dark)]/85 leading-[1.65] font-normal max-w-[430px]">
            Vaalu is a dog-first brand built with love, care and a deep understanding of what our furry friends really need. From everyday essentials to special treats, we bring together quality, comfort and happiness — for happier tails!
          </p>

          {/* CTA Button */}
          <div className="mt-6 flex items-center">
            <a href="#mission-vision" className="about-btn-pill">
              <span>Our Story</span>
              <span className="text-base leading-none">&rarr;</span>
            </a>
          </div>

          {/* Decorative Brown Outline Heart */}
          <div className="absolute top-[240px] right-2 sm:right-6 text-[#A67B51]/70 rotate-[-12deg] pointer-events-none hidden sm:block">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 26 C12 21 4 16 4 9 C4 5 7 2 11 2 C13.5 2 15 3.5 16 5 C17 3.5 18.5 2 21 2 C25 2 28 5 28 9 C28 16 20 21 16 26 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Soft Tan Paw Print near CTA */}
          <div className="absolute bottom-1 right-20 sm:right-32 text-[#E8D5BE] pointer-events-none hidden sm:block">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="6" cy="7" rx="2" ry="3" />
              <ellipse cx="11" cy="4" rx="2" ry="3" />
              <ellipse cx="16" cy="5" rx="2" ry="3" />
              <ellipse cx="20" cy="9" rx="2" ry="3" />
              <path d="M7 14C7 11.5 9 10 12.5 10C16 10 18 11.5 18 14C18 17.5 15.5 20 12.5 20C9.5 20 7 17.5 7 14Z" />
            </svg>
          </div>

        </div>

        {/* Right Column: ~52% width, edge-to-edge on right */}
        <div className="w-full lg:w-[52%] h-[320px] sm:h-[380px] lg:h-full relative overflow-hidden flex items-end justify-end">
          <div className="about-hero-img-container w-full h-full relative">
            <img
              src="/golden.png"
              alt="Golden retriever wearing green bandana being petted"
              className="w-full h-full object-cover object-[center_18%] sm:object-[center_15%]"
              loading="eager"
            />
            {/* White/Yellow radiating strokes near foliage on right */}
            <div className="absolute bottom-12 right-8 text-white/95 pointer-events-none hidden sm:block drop-shadow-sm">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M5 19L9 15M13 21L12 15M20 16L15 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
