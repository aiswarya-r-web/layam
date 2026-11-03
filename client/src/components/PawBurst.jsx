import { PawPrint } from 'lucide-react'

const PARTICLES = [
  { dx: '-40px', dy: '-36px', rot: '-35deg' },
  { dx: '40px', dy: '-40px', rot: '30deg' },
  { dx: '-48px', dy: '8px', rot: '20deg' },
  { dx: '48px', dy: '6px', rot: '-25deg' },
  { dx: '0px', dy: '-52px', rot: '10deg' },
  { dx: '-24px', dy: '-48px', rot: '-15deg' },
  { dx: '26px', dy: '42px', rot: '40deg' },
]

export default function PawBurst() {
  return PARTICLES.map((p, i) => (
    <PawPrint
      key={i}
      size={12 + (i % 3) * 4}
      fill="currentColor"
      className="paw-particle text-[#dda044]"
      style={{
        left: '50%',
        top: '50%',
        '--dx': p.dx,
        '--dy': p.dy,
        '--rot': p.rot,
      }}
    />
  ))
}
