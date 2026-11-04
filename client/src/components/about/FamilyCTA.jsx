import React from 'react'
import { Link } from 'react-router-dom'

export default function FamilyCTA() {
  return (
    <section className="relative px-6 py-12 md:px-12 lg:px-16 xl:px-20 overflow-hidden">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Side: Puppy with Plush Toy Photograph (~55% -> 6.5 cols on lg) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-start relative">
            <div className="relative w-full max-w-[520px] lg:max-w-[620px] aspect-[4/3.2]">
              {/* White Outline Heart above dog's head on the left */}
              <div className="absolute top-6 left-8 text-white pointer-events-none z-10 drop-shadow-md">
                <svg width="38" height="38" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 26 C12 21 4 16 4 9 C4 5 7 2 11 2 C13.5 2 15 3.5 16 5 C17 3.5 18.5 2 21 2 C25 2 28 5 28 9 C28 16 20 21 16 26 Z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Puppy Image with Organic Asymmetrical Curved Boundary */}
              <div className="about-family-img-frame w-full h-full relative">
                <img
                  src="/Pug-Puppy.png.png"
                  alt="Puppy cuddling plush toy - Vaalu family"
                  className="w-full h-full object-cover object-[center_35%]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Peach Decorative Content Area (~45% -> 5.5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            
            {/* Subtle Oversized Paw-Print Decoration extending outward into background */}
            <div className="absolute -right-8 -top-8 text-[#EEDBCA]/65 pointer-events-none z-0 hidden sm:block">
              <svg width="220" height="220" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="6" cy="7" rx="1.9" ry="2.8" />
                <ellipse cx="11" cy="4" rx="1.9" ry="2.8" />
                <ellipse cx="16" cy="5" rx="1.9" ry="2.8" />
                <ellipse cx="20" cy="9" rx="1.9" ry="2.8" />
                <path d="M7 14C7 11.5 9 10 12.5 10C16 10 18 11.5 18 14C18 17.5 15.5 20 12.5 20C9.5 20 7 17.5 7 14Z" />
              </svg>
            </div>

            {/* Asymmetrical Organic Blob-Shaped Peach Background Container */}
            <div className="about-peach-blob-bg p-8 sm:p-10 lg:py-12 lg:px-12 relative z-10">
              
              {/* Tan Paw Outline Icon above heading */}
              <div className="mb-3 text-[#A67B51] relative z-10">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="6" cy="7" rx="1.8" ry="2.6" />
                  <ellipse cx="11" cy="4" rx="1.8" ry="2.6" />
                  <ellipse cx="16" cy="5" rx="1.8" ry="2.6" />
                  <ellipse cx="20" cy="9" rx="1.8" ry="2.6" />
                  <path d="M7 14C7 11.5 9 10 12.5 10C16 10 18 11.5 18 14C18 17.5 15.5 20 12.5 20C9.5 20 7 17.5 7 14Z" />
                </svg>
              </div>

              {/* Heading: Left-aligned, two lines */}
              <h2 className="font-serif-title text-[32px] sm:text-[38px] lg:text-[42px] font-bold text-[var(--about-dark-brown)] leading-[1.18] relative z-10">
                Because
                <span className="block mt-1">
                  They're Family
                </span>
              </h2>

              {/* Description */}
              <p className="mt-4 text-[14.5px] sm:text-[15.5px] text-[var(--about-text-dark)]/90 leading-[1.65] relative z-10 max-w-[440px]">
                At Vaalu, we believe dogs aren't just pets — they're family. And family deserves the best! 🐾
              </p>

              {/* Green CTA Button: Pill-shaped (capsule), never stretched */}
              <div className="mt-7 relative z-10 flex items-center justify-start">
                <Link to="/shop" className="about-btn-pill">
                  <span>Shop Now</span>
                  <span className="text-lg leading-none">&rarr;</span>
                </Link>
              </div>

            </div>

            {/* Soft Tan Paw Stamp in Bottom Right */}
            <div className="absolute -bottom-4 right-4 text-[#E8D5BE] pointer-events-none hidden sm:block">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="6" cy="7" rx="2" ry="3" />
                <ellipse cx="11" cy="4" rx="2" ry="3" />
                <ellipse cx="16" cy="5" rx="2" ry="3" />
                <ellipse cx="20" cy="9" rx="2" ry="3" />
                <path d="M7 14C7 11.5 9 10 12.5 10C16 10 18 11.5 18 14C18 17.5 15.5 20 12.5 20C9.5 20 7 17.5 7 14Z" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
