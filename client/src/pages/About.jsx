import React from 'react'
import AboutHero from '../components/about/AboutHero'
import MissionVision from '../components/about/MissionVision'
import CoreValues from '../components/about/CoreValues'
import StatsSection from '../components/about/StatsSection'
import FamilyCTA from '../components/about/FamilyCTA'
import '../components/about/about.css'

export default function About() {
  return (
    <main className="about-page-wrapper">
      <AboutHero />
      <MissionVision />
      <CoreValues />
      <StatsSection />
      <FamilyCTA />
    </main>
  )
}
