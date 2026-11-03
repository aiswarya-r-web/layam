const COLORS = ['#f4b860', '#dda044', '#e2574c', '#ffe9a3', '#ff8c42']

const particles = (seed) =>
  Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + seed
    const dist = 55 + ((i * 17 + Math.round(seed * 29)) % 40)
    return {
      dx: `${Math.cos(angle) * dist}px`,
      dy: `${Math.sin(angle) * dist}px`,
      color: COLORS[(i + Math.round(seed * 7)) % COLORS.length],
      delay: `${(i * 0.11 + seed) % 1.9}s`,
    }
  })

function Burst({ style, seed }) {
  return (
    <div className="absolute" style={style}>
      {particles(seed).map((p, i) => (
        <span
          key={i}
          className="cracker-particle"
          style={{ '--dx': p.dx, '--dy': p.dy, background: p.color, color: p.color, animationDelay: p.delay }}
        />
      ))}
    </div>
  )
}

export default function Crackers() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <Burst seed={0.3} style={{ left: '7%', top: '18%' }} />
      <Burst seed={1.1} style={{ left: '4%', top: '52%' }} />
      <Burst seed={2.0} style={{ left: '12%', top: '78%' }} />
      <Burst seed={0.7} style={{ right: '8%', top: '22%' }} />
      <Burst seed={1.6} style={{ right: '4%', top: '56%' }} />
      <Burst seed={2.5} style={{ right: '13%', top: '80%' }} />
    </div>
  )
}
