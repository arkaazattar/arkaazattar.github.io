import type { CSSProperties } from 'react'
import './LeavesOverlay.css'

type Leaf = {
  delay: string
  duration: string
  flutterDuration: string
  left: string
  scale: string
  sway: string
  swayDuration: string
  tone: 'amber' | 'gold' | 'red'
  wind: string
}

const leafTones: Leaf['tone'][] = ['amber', 'gold', 'red']
const leafCount = 36
const leafLoopSeconds = 18
const leaves: Leaf[] = Array.from({ length: leafCount }, (_, index) => {
  const random = createSeededRandom(1427 + index * 97)
  const horizontalPosition = getEdgeWeightedPosition(random, index)
  const windDirection = random() > 0.48 ? 1 : -1
  const windAmount = randomRange(random, 4, 18) * windDirection

  return {
    delay: `${-((index * leafLoopSeconds) / leafCount).toFixed(2)}s`,
    duration: `${randomRange(random, 15, 22).toFixed(2)}s`,
    flutterDuration: `${randomRange(random, 2.1, 3.8).toFixed(2)}s`,
    left: `${horizontalPosition.toFixed(2)}%`,
    scale: randomRange(random, 0.52, 0.98).toFixed(2),
    sway: `${randomRange(random, 6, 18).toFixed(1)}px`,
    swayDuration: `${randomRange(random, 3.2, 6.2).toFixed(2)}s`,
    tone: leafTones[Math.floor(random() * leafTones.length)],
    wind: `${windAmount.toFixed(2)}vw`,
  }
})

export default function LeavesOverlay() {
  return (
    <div className="leaves-overlay" aria-hidden="true">
      {leaves.map((leaf, index) => (
        <span
          className="falling-leaf-path"
          key={`${leaf.left}-${index}`}
          style={{
            '--leaf-delay': leaf.delay,
            '--leaf-duration': leaf.duration,
            '--leaf-flutter-duration': leaf.flutterDuration,
            '--leaf-left': leaf.left,
            '--leaf-scale': leaf.scale,
            '--leaf-sway': leaf.sway,
            '--leaf-sway-duration': leaf.swayDuration,
            '--leaf-wind': leaf.wind,
          } as CSSProperties}
        >
          <span className={`falling-leaf falling-leaf-${leaf.tone}`} />
        </span>
      ))}
    </div>
  )
}

function createSeededRandom(seed: number) {
  let value = seed

  return () => {
    value = (value * 16807) % 2147483647

    return (value - 1) / 2147483646
  }
}

function randomRange(random: () => number, min: number, max: number) {
  return min + random() * (max - min)
}

function getEdgeWeightedPosition(random: () => number, index: number) {
  const distributedPosition = (index * 0.61803398875 + random() * 0.35) % 1
  const distanceFromCenter = Math.abs(distributedPosition - 0.5) * 2
  const edgeBiasedDistance = Math.pow(distanceFromCenter, 0.72) / 2
  const direction = distributedPosition < 0.5 ? -1 : 1

  return (0.5 + direction * edgeBiasedDistance) * 106 - 3
}
