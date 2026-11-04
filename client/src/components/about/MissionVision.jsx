import React from 'react'

export default function MissionVision() {
  return (
    <section id="mission-vision" className="relative px-6 py-12 md:px-12 lg:px-16 xl:px-20">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Beagle Puppy (~5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start relative">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[1/1.05]">
              {/* 3 small orange radiating hand-drawn rays at top right of puppy */}
              <div className="absolute -top-3 -right-2 text-[var(--about-orange)] pointer-events-none z-10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M5 19L9 15M13 21L12 15M20 16L15 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="about-beagle-frame w-full h-full relative">
                <img
                  src="/Beagle-puppy.png.jpeg"
                  alt="Beagle puppy with tennis ball"
                  className="w-full h-full object-cover object-[center_35%]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Heading & 2 Horizontal Cards (~7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Heading with 3 green radiating lines */}
            <div className="mb-6 flex items-center">
              <h2 className="font-serif-title text-[30px] sm:text-[34px] lg:text-[38px] font-bold text-[var(--about-dark-brown)] leading-tight">
                Our Mission &amp; Vision
              </h2>
              <span className="inline-block ml-3 text-[var(--about-forest-green)] align-middle">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M5 19L9 15M13 21L12 15M20 16L15 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>

            {/* Two Cards Arranged Horizontally on Desktop */}
            <div className="grid gap-6 sm:grid-cols-2">
              
              {/* Mission Card (Pale Sage Green) */}
              <div className="about-mission-box flex flex-col justify-between">
                <div>
                  <div className="mb-4 text-[var(--about-forest-green)]">
                    {/* Archery Target / Bullseye Icon */}
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="6" r="6" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>
                  </div>
                  <h3 className="font-serif-title text-[21px] font-bold text-[var(--about-forest-green)]">
                    Our Mission
                  </h3>
                  <p className="mt-3 text-[14px] sm:text-[14.5px] text-[var(--about-text-dark)]/90 leading-[1.65]">
                    To make pet parenting easier and more joyful by offering safe, high-quality and thoughtfully curated products for dogs.
                  </p>
                </div>
              </div>

              {/* Vision Card (Pale Peach) */}
              <div className="about-vision-box flex flex-col justify-between">
                <div>
                  <div className="mb-4 text-[var(--about-dark-brown)]">
                    {/* Binoculars Icon */}
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="6" cy="15" r="4" />
                      <circle cx="18" cy="15" r="4" />
                      <path d="M10 15h4" />
                      <path d="M4 11l2.2-6h3.6l-1 6" />
                      <path d="M20 11l-2.2-6h-3.6l1 6" />
                    </svg>
                  </div>
                  <h3 className="font-serif-title text-[21px] font-bold text-[var(--about-dark-brown)]">
                    Our Vision
                  </h3>
                  <p className="mt-3 text-[14px] sm:text-[14.5px] text-[var(--about-text-dark)]/90 leading-[1.65]">
                    To build a trusted, love-filled community for dog lovers across India, where every dog lives a healthier, happier life.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
